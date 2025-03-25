# expense_routes.py
from flask import Blueprint, request, jsonify
from models import Users, ExpenseCategories
from extensions import db

expense_categories_bp = Blueprint("expense", __name__)

# Add and expense category for a user
@expense_categories_bp.route("/api/users/<int:user_id>/expense-categories",methods=["POST"])
def add_expense_category(user_id):
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
        
        title = data.get("title")
        amount = data.get("amount")

        # Create new expense category
        new_category = ExpenseCategories(title=title, amount=amount, user_id=user_id)
        db.session.add(new_category)
        db.session.commit()

        return jsonify({"msg":f'Expense category "{title}" added successffully'}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"msg":str(e)}), 500
    
# Get all expense categories for a user
@expense_categories_bp.route("/api/users/<int:user_id>/expense-categories",methods=["GET"])
def get_expense_categories(user_id):
    try:
        user = Users.query.get(user_id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        
        categories = [category.to_json() for category in user.expense_categories]
        return jsonify(categories), 200
    except Exception as e:
        return jsonify({"msg":str(e)}), 500

# Update an Expense Category
@expense_categories_bp.route("/api/users/<int:user_id>/expense-categories/<int:category_id>",methods=["PATCH"])
def update_expense_category(user_id, category_id):
    try:
        # Check if user exists
        user = Users.query.get(user_id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        
        # Check if expense catgory exists AND belongs to user
        category = ExpenseCategories.query.filter_by(id=category_id, user_id=user_id).first()
        if category is None:
            return jsonify({"error":"Expense category not found"}), 404
        
        data = request.json

        # Update the category fields if provided
        category.title = data.get("title", category.title)
        category.amount = data.get("amount", category.amount)

        db.session.commit()
        return jsonify({"msg":"Expense category updated successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500

# Delete an Expense Category
@expense_categories_bp.route("/api/users/<int:user_id>/expense-categories/<int:category_id>",methods=["DELETE"])
def delete_expense_category(user_id, category_id):
    try:
        user = Users.query.get(user_id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        
        category = ExpenseCategories.query.filter_by(id=category_id, user_id=user_id).first()
        if category is None:
            return jsonify({"error":"Expense category not found"}), 404
        
        # Delete category for specific user
        db.session.delete(category)
        db.session.commit()

        return jsonify({"msg":"Expense category deleted successfully"}), 200
    
    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500
