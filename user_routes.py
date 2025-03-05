# user_routes.py
from flask import Blueprint, request, jsonify
from models import Users
from extensions import db

user_bp = Blueprint("user", __name__)

'''@user_bp.route("/api/users", methods=["GET"])
def get_users():
    users = Users.query.all()
    result = [user.to_json() for user in users]
    return jsonify(result)'''

# Get all users
# To create a route, need to create a decorator
#GET method
#Using Python code to interact with database
@user_bp.route("/api/users", methods = ["GET"])
def get_users():
    users = Users.query.all()
    result = [user.to_json() for user in users]
    # [ {...}, {...}, {...}] What we are story in the result var
    return jsonify(result) # 200 by default

# Create a user
@user_bp.route("/api/users",methods=["POST"]) # 'POST' corresponds to an official method: As seen in POSTMAN Collections
def create_user():
    try:
        data = request.json # Take request and turn into json take a look into fields

        #Add validation that required fields are filled
        required_fields = ["name", "income", "expenses", "gender"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error":f'Missing required field: {field}'}), 400

        name = data.get("name")
        income = data.get("income")
        expenses = data.get("expenses")
        gender = data.get("gender")
        # Create img url dynamically for back end
        # Fetch avatar image based on gender
        if gender == "male":
            img_url = f"https://avatar.iran.liara.run/public/boy?username={name}"
        elif gender == "female":
            img_url = f"https://avatar.iran.liara.run/public/girl?username={name}"
        else: # Most likely will never hit
            img_url = None
        # Create a new user object in database
        new_user = Users(name=name, income=income, expenses=expenses, gender=gender, img_url=img_url)
        # Add to database session. Will not immediately add, need to commit
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg":"User created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500
    
#Deleting a user
@user_bp.route("/api/users/<int:id>",methods=["DELETE"]) # 'DELETE' corresponds to an official method
def delete_user(id):
    try:
        user = Users.query.get(id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        
        db.session.delete(user)
        db.session.commit()
        return jsonify({"msg":"User deleted"}), 200
    except Exception as e:
        # Rollback to previous state b/c something unexpected happened
        db.session.rollback()
        return jsonify({"error":str(e)}), 500
    
#Update a user
@user_bp.route("/api/users/<int:id>",methods=["PATCH"])
def update_user(id):
    try:
        user = Users.query.get(id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        
        data = request.json

        # if the user does not pass a new value, it will keep 'old' value
        user.name = data.get("name", user.name)
        user.income = data.get("income", user.income)
        user.expenses = data.get("expenses", user.expenses)
        user.gender = data.get("gender", user.gender)

        db.session.commit() # Can immediately commit b/c we have updated fields directly
        return jsonify(user.to_json()), 200
    except Exception as e:
        # Rollback to previous state b/c something unexpected happened
        db.session.rollback()
        return jsonify({"error":str(e)}), 500