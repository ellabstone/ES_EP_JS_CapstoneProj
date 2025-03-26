# budget_item_routes.py
from flask import Blueprint, request, jsonify, redirect, url_for
from models import Budget, BudgetExpense, BudgetIncome
import budget_routes
from extensions import db

budget_item_bp = Blueprint('budget_items', __name__)

## ToDo:
'''Add route to get certain categories for each expense, add route to get single income or expense'''

# Add budget expense for user
@budget_item_bp.route("/api/budgets/<int:budget_id>/budget-expenses", methods=["POST"])
def add_budget_expense(budget_id):
    try:
        budget = Budget.query.get(budget_id)
        if budget is None:
            return jsonify({"error":"Budget not found"}), 404
        
        data = request.json

        # Validate required fields
        required_fields = ["title", "amount", "category_type"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error":f'Missing required field: {field}'}), 400
        
        if float(data['amount']) < 0:
            return jsonify({"error": "Amount cannot be negative"}), 400
        
        valid_categories = ['Necessities', 'Wants', 'Savings']
        if data['category_type'] not in valid_categories:
            return jsonify({"error": "Invalid category type"}), 400
        
        if len(data['title']) > 100:
            return jsonify({"error": "Title too long"}), 400

        # Create new expense category
        new_expense = BudgetExpense(title=data['title'], amount=data['amount'], category_type=data['category_type'], budget_id=budget_id)
        db.session.add(new_expense)
        db.session.commit()

        return jsonify(new_expense.to_json()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500
    
# Update an Expense Category
@budget_item_bp.route("/api/budgets/<int:budget_id>/budget-expenses/<int:budget_expense_id>", methods=["PATCH"])
def update_budget_expense(budget_id, budget_expense_id):
    try:
        expense = BudgetExpense.query.filter_by(id=budget_expense_id, budget_id=budget_id).first()
        if not expense:
            return jsonify({"error": "Expense not found"}), 404
        
        data = request.json

        if 'amount' in data:
            if float(data['amount']) < 0:
                return jsonify({"error": "Amount cannot be negative"}), 400
        
        valid_categories = ['Necessities', 'Wants', 'Savings']
        if 'category_type' in data:
            if data['category_type'] not in valid_categories:
                return jsonify({"error": "Invalid category type"}), 400
        
        if 'title' in data:
            if len(data['title']) > 100:
                return jsonify({"error": "Title too long"}), 400
        
        # Update the expense fields if provided and validated
        expense.title = data.get("title", expense.title)
        expense.amount = data.get("amount", expense.amount)
        expense.category_type = data.get("category_type", expense.category_type)

        db.session.commit()
        # Trigger recalculation
        return redirect(url_for('budget.calculate_budget', 
                    user_id=expense.budget.user_id, 
                    budget_id=budget_id))
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get all budget expenses for a user
@budget_item_bp.route("/api/budgets/<int:budget_id>/budget-expenses", methods=["GET"])
def get_all_budget_expenses(budget_id):
    try:
        budget = Budget.query.get(budget_id)
        if budget is None:
            return jsonify({"error":"Budget not found"}), 404
        
        expenses = [expense.to_json() for expense in budget.expenses]
        return jsonify(expenses), 200
    
    except Exception as e:
        return jsonify({"error":str(e)}), 500
    
# Delete an budget expense
@budget_item_bp.route("/api/budgets/<int:budget_id>/budget-expenses/<int:budget_expense_id>", methods=["DELETE"])
def delete_budget_expense(budget_id, budget_expense_id):
    try:
        expense = BudgetExpense.query.filter_by(id=budget_expense_id, budget_id=budget_id).first()
        if not expense:
            return jsonify({"error": "Expense not found"}), 404
        
        db.session.delete(expense)
        db.session.commit()
        return jsonify({"msg": "Expense deleted successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add budget income for user
@budget_item_bp.route("/api/budgets/<int:budget_id>/budget-incomes", methods=["POST"])
def add_budget_income(budget_id):
    try:
        budget = Budget.query.get(budget_id)
        if budget is None:
            return jsonify({"error":"Budget not found"}), 404
        
        data = request.json

        # Validate required fields
        required_fields = ["title", "amount"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error":f'Missing required field: {field}'}), 400
        
        if float(data['amount']) < 0:
            return jsonify({"error": "Amount cannot be negative"}), 400
        
        if len(data['title']) > 100:
            return jsonify({"error": "Title too long"}), 400

        # Create new expense category
        new_income = BudgetIncome(title=data['title'], amount=data['amount'], budget_id=budget_id)
        db.session.add(new_income)
        db.session.commit()

        return jsonify(new_income.to_json()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500
    
# Update an Income Category
@budget_item_bp.route("/api/budgets/<int:budget_id>/budget-incomes/<int:budget_income_id>", methods=["PATCH"])
def update_budget_income(budget_id, budget_income_id):
    try:
        income = BudgetIncome.query.filter_by(id=budget_income_id, budget_id=budget_id).first()
        if not income:
            return jsonify({"error": "Income not found"}), 404
        
        data = request.json

        if 'amount' in data:
            if float(data['amount']) < 0:
                return jsonify({"error": "Amount cannot be negative"}), 400
        
        if 'title' in data:
            if len(data['title']) > 100:
                return jsonify({"error": "Title too long"}), 400
        
        # Update the income fields if provided and validated
        income.title = data.get("title", income.title)
        income.amount = data.get("amount", income.amount)

        db.session.commit()
        # Trigger recalculation
        return redirect(url_for('budget.calculate_budget', 
                    user_id=income.budget.user_id, 
                    budget_id=budget_id))
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get all budget incomes for a user
@budget_item_bp.route("/api/budgets/<int:budget_id>/budget-incomes", methods=["GET"])
def get_all_budget_incomes(budget_id):
    try:
        budget = Budget.query.get(budget_id)
        if budget is None:
            return jsonify({"error":"Budget not found"}), 404
        
        incomes = [income.to_json() for income in budget.incomes]
        return jsonify(incomes), 200
    
    except Exception as e:
        return jsonify({"error":str(e)}), 500

# Delete an budget income
@budget_item_bp.route("/api/budgets/<int:budget_id>/budget-incomes/<int:budget_income_id>", methods=["DELETE"])
def delete_budget_income(budget_id, budget_income_id):
    try:
        income = BudgetIncome.query.filter_by(id=budget_income_id, budget_id=budget_id).first()
        if not income:
            return jsonify({"error": "Income not found"}), 404
        
        db.session.delete(income)
        db.session.commit()
        return jsonify({"msg": "Income deleted successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500