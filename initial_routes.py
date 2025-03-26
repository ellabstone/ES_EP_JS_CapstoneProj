# initial_routes.py
from flask import Blueprint, request, jsonify
from models import Users, InitialExpense, InitialIncome
from extensions import db

initial_bp = Blueprint('initial', __name__)

# Add initial expense for user (before budget creation)
@initial_bp.route("/api/users/<int:user_id>/initial-expenses", methods=["POST"])
def add_initial_expense(user_id):
    try:
        user = Users.query.get(user_id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        
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
        new_expense = InitialExpense(title=data['title'], amount=data['amount'], category_type=data['category_type'], user_id=user_id)
        db.session.add(new_expense)
        db.session.commit()

        return jsonify(new_expense.to_json()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500
    
# Update an Expense Category
@initial_bp.route("/api/users/<int:user_id>/initial-expenses/<int:expense_id>", methods=["PATCH"])
def update_initial_expense(user_id, expense_id):
    try:
        expense = InitialExpense.query.filter_by(id=expense_id, user_id=user_id).first()
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
        return jsonify(expense.to_json()), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500

# Get all initial expenses for a user
@initial_bp.route("/api/users/<int:user_id>/initial-expenses", methods=["GET"])
def get_all_initial_expenses(user_id):
    try:
        user = Users.query.get(user_id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        
        expenses = [expense.to_json() for expense in user.initial_expenses]
        return jsonify(expenses), 200
    
    except Exception as e:
        return jsonify({"error":str(e)}), 500
    
# Delete an initial expense
@initial_bp.route("/api/users/<int:user_id>/initial-expenses/<int:expense_id>", methods=["DELETE"])
def delete_initial_expense(user_id, expense_id):
    try:
        expense = InitialExpense.query.filter_by(id=expense_id, user_id=user_id).first()
        if not expense:
            return jsonify({"error": "Expense not found"}), 404
        
        db.session.delete(expense)
        db.session.commit()
        return jsonify({"msg": "Expense deleted successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# Add initial income for user (before budget creation)
@initial_bp.route("/api/users/<int:user_id>/initial-incomes", methods=["POST"])
def add_initial_income(user_id):
    try:
        user = Users.query.get(user_id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        
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
        new_income = InitialIncome(title=data['title'], amount=data['amount'], user_id=user_id)
        db.session.add(new_income)
        db.session.commit()

        return jsonify(new_income.to_json()), 201
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500
    
# Update an Income Category
@initial_bp.route("/api/users/<int:user_id>/initial-incomes/<int:income_id>", methods=["PATCH"])
def update_initial_income(user_id, income_id):
    try:
        income = InitialIncome.query.filter_by(id=income_id, user_id=user_id).first()
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
        return jsonify(income.to_json()), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify(income.to_json()), 500

# Get all initial incomes for a user
@initial_bp.route("/api/users/<int:user_id>/initial-incomes", methods=["GET"])
def get_all_initial_incomes(user_id):
    try:
        user = Users.query.get(user_id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        
        incomes = [income.to_json() for income in user.initial_incomes]
        return jsonify(incomes), 200
    
    except Exception as e:
        return jsonify({"error":str(e)}), 500

# Delete an initial income
@initial_bp.route("/api/users/<int:user_id>/initial-incomes/<int:income_id>", methods=["DELETE"])
def delete_initial_income(user_id, income_id):
    try:
        income = InitialIncome.query.filter_by(id=income_id, user_id=user_id).first()
        if not income:
            return jsonify({"error": "Income not found"}), 404
        
        db.session.delete(income)
        db.session.commit()
        return jsonify({"msg": "Income deleted successfully"}), 200
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500