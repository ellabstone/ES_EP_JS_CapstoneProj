# budget_routes.py
from flask import Blueprint, request, jsonify
from models import Users, Budget, InitialExpense, InitialIncome, BudgetExpense, BudgetIncome
from extensions import db
from copy import deepcopy

budget_bp = Blueprint("budget", __name__)

#### ToDo:
'''Handle what to do with the budget period, add validation to ensure all three categories exist for expenses'''

# Create a Budget
@budget_bp.route("/api/users/<int:user_id>/budget", methods=["POST"])
def create_budget(user_id):
    try:
        # 1. Validate user exists
        user = Users.query.get(user_id)
        if not user:
            return jsonify({"error":"User not found"}), 404
        
        data = request.json

        # 2. Validate required fields
        required_fields = ["method", "period"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error":f'Missing required field: {field}'}), 400
        
        # 3. Validate budget method
        valid_methods = ['50-30-20', 'zero-based', 'pay-yourself-first', 'custom']
        if data['method'].lower() not in valid_methods:
            return jsonify({
                "error": "Invalid budget method",
                "valid_methods": valid_methods
            }), 400
        
        # 4. Validate budget period
        valid_periods = ['weekly', 'monthly', 'yearly']
        if data['period'].lower() not in valid_periods:
            return jsonify({
                "error": "Invalid budget method",
                "valid_methods": valid_periods
            }), 400

        # 5. Validate Initial Data Exists
        if not user.initial_expenses and not user.initial_incomes:
            return jsonify({
                "error": "Add initial expenses/initial incomes before creating a budget"
            }), 400
        method = data.get("method")
        period = data.get("period")
        new_budget = Budget(user_id=user_id, method=method, period=period)
        db.session.add(new_budget)
        db.session.flush() # Get the current budget ID

        # Copy initial expenses/incomes to budget-specific ones
        for expense in user.initial_expenses:
            budget_expense = BudgetExpense(
                budget_id=new_budget.id,
                title=expense.title,
                amount=expense.amount,
                category_type=expense.category_type
            )
            db.session.add(budget_expense)

        for income in user.initial_incomes:
            budget_income = BudgetIncome(
                budget_id=new_budget.id,
                title=income.title,
                amount=income.amount
            )
            db.session.add(budget_income)
        
        db.session.commit()

        calculate_budget(user_id, new_budget.id)

        return jsonify({"msg":f'Budget created successfully'}), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500

@budget_bp.route("/api/users/<int:user_id>/budgets/<int:budget_id>/calculate", methods=["POST", "GET"])
def calculate_budget(user_id, budget_id):
    try:
        # Get budget with ownership check
        budget = Budget.query.filter_by(
            id=budget_id,
            user_id=user_id
        ).first()
        
        if not budget:
            return jsonify({"error": "Budget not found or access denied"}), 404
        
        # Route to the appropriate calculator
        calculators = {
            '50-30-20': calculate_50_30_20,
            'zero-based': calculate_zero_based,
            'pay-yourself-first': calculate_pay_yourself_first
        }
        
        if budget.method not in calculators:
            return jsonify({"error": "Unsupported budget method"}), 400
            
        # Pass budget_id instead of budget object
        return calculators[budget.method](budget_id)
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Get all Budgets for a User
@budget_bp.route("/api/users/<int:user_id>/budgets", methods=["GET"])
def get_all_budgets(user_id):
    try:
        budgets = Budget.query.filter_by(user_id=user_id).all()
        return jsonify([budget.to_json() for budget in budgets]), 200
    except Exception as e:
        return jsonify({"error":str(e)}), 500

# Deleting a Budget
@budget_bp.route("/api/users/<int:user_id>/budgets/<int:budget_id>", methods=["DELETE"])
def delete_budget(user_id, budget_id):
    try:
        # Verify the budget exists AND belongs to the specified user
        budget = Budget.query.filter_by(id=budget_id, user_id=user_id).first()
        if not budget:
            return jsonify({"error": "Budget not found or access denied"}), 404
        
        db.session.delete(budget)
        db.session.commit()
        return jsonify({"msg": "Budget deleted"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Calculate 50/30/20 Budget Plan
@budget_bp.route("/api/budgets/<int:budget_id>/calculate-50-30-20", methods=["POST"])
def calculate_50_30_20(budget_id):
    try:
        budget = Budget.query.get(budget_id)
        if not budget:
            return jsonify({"error": "Budget not found"}), 404
        
        # Calculate total income
        total_income = sum(income.amount for income in budget.incomes)

        # Calculate recommended allocations
        allocations = {
            'Necessities': total_income * 0.50,
            'Wants': total_income * 0.30,
            'Savings': total_income * 0.20
        }

        # Calculate current allocations
        current = {k: 0 for k in allocations.keys()}
        for expense in budget.expenses:
            if expense.category_type in current:
                current[expense.category_type] += expense.amount

        # Generate recommendations
        recommendations = []
        for category, target in allocations.items():
            difference = current[category] - target
            if difference > 0:
                recommendations.append(
                    f"Reduce {category} by ${difference:.2f} (current: ${current[category]:.2f}, target: ${target:.2f})"
                )
            elif difference < 0:
                recommendations.append(
                    f"Increase {category} by ${-difference:.2f} (current: ${current[category]:.2f}, target: ${target:.2f})"
                )
        
        return jsonify({
            "method": "50-30-20",
            "total_income": total_income,
            "allocations": allocations,
            "current": current,
            "recommendations": recommendations,
            "budget": budget.to_json()
        }), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@budget_bp.route("/api/budgets/<int:budget_id>/calculate-zero-based", methods=["POST"])
def calculate_zero_based(budget_id):
    try:
        budget = Budget.query.get(budget_id)
        if budget is None:
            return jsonify({"error":"Budget not found"}), 404
        
        total_income = sum(income.amount for income in budget.incomes)
        total_expenses = sum(expense.amount for expense in budget.expenses)
        balance_after_expenses = total_income - total_expenses
        
        return jsonify({
            "method": "zero-based",
            "income": round(total_income, 2),
            "expenses": round(total_expenses, 2),
            "balance_after_expenses": round(balance_after_expenses, 2),
            "is_balanced": abs(balance_after_expenses) < 0.01,  # Account for floating point precision
            "recommendation": {
                "action": "adjust" if abs(balance_after_expenses) >= 0.01 else "none",
                "amount": round(abs(balance_after_expenses), 2) if abs(balance_after_expenses) >= 0.01 else 0
            }
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@budget_bp.route("/api/budgets/<int:budget_id>/calculate-pay-yourself-first", methods=["POST"])
def calculate_pay_yourself_first(budget_id):
    try:
        budget = Budget.query.get(budget_id)
        if budget is None:
            return jsonify({"error":"Budget not found"}), 404
        
        savings_goal = next((e.amount for e in budget.expenses 
                            if e.category_type == "Savings"), 0)
        
        total_income = sum(income.amount for income in budget.incomes)

        remaining = total_income - savings_goal
        
        essential_expenses = sum(e.amount for e in budget.expenses 
                            if e.category_type == "Necessities")
        
        return jsonify({
            "method": "pay-yourself-first",
            "income": round(total_income, 2),
            "savings_goal": round(savings_goal, 2),
            "remaining_after_savings": round(remaining, 2),
            "essential_expenses": round(essential_expenses, 2),
            "discretionary_left": round(remaining - essential_expenses, 2),
            "success": remaining >= essential_expenses,
            "recommendation": {
                "action": "increase_income" if remaining < essential_expenses else "none",
                "amount": round(essential_expenses - remaining, 2) if remaining < essential_expenses else 0
            }
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500