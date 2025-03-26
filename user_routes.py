# user_routes.py
from flask import Blueprint, request, jsonify
from models import Users
from extensions import db
from bcrypt import hashpw, gensalt, checkpw

user_bp = Blueprint("user", __name__)

# Get all users
@user_bp.route("/api/users", methods = ["GET"])
def get_users():
    users = Users.query.all()
    result = [user.to_json() for user in users]
    # [ {...}, {...}, {...}] What we are story in the result var
    return jsonify(result) # 200 by default

# Create a user
@user_bp.route("/api/users", methods=["POST"]) # 'POST' corresponds to an official method: As seen in POSTMAN Collections
def create_user():
    try:
        data = request.json # Take request and turn into json take a look into fields

        #Add validation that required fields are filled
        required_fields = ["name", "username", "password"]
        for field in required_fields:
            if field not in data:
                return jsonify({"error":f'Missing required field: {field}'}), 400

        name = data.get("name")

        # Verify the username does not already exists
        username = data.get("username")
        existing_user = Users.query.filter_by(username=username).first()
        if existing_user: # is NOT None
            return jsonify({"error": "Username already taken"}), 400

        # Verify password length requirement
        password = data.get("password")
        if len(password) < 8:
            return jsonify({"error":f'Password must be at least 8 characters in length.'}), 400
        # Hash the password
        hashed_password = hashpw(password.encode("utf-8"), gensalt())

        # Create a new user object in database
        new_user = Users(name=name,
                         username=username,
                         password=hashed_password.decode("utf-8")
                            )  # Store the hashed password as a string
        # Add to database session. Will not immediately add, need to commit
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"msg":"User created successfully"}), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({"error":str(e)}), 500
    
#Deleting a user
@user_bp.route("/api/users/<int:id>", methods=["DELETE"]) # 'DELETE' corresponds to an official method
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
    
#Update a user: Do we need to add a input password again
@user_bp.route("/api/users/<int:id>", methods=["PATCH"])
def update_user(id):
    try:
        user = Users.query.get(id)
        if user is None:
            return jsonify({"error":"User not found"}), 404
        
        data = request.json

        # if the user does not pass a new value, it will keep 'old' value
        user.name = data.get("name", user.name)

        # Check if username is being updated and if it is already in taken
        new_username = data.get("username")
        if new_username and (new_username != user.username): # if new username exists and it does not equal old username...
            existing_user = Users.query.filter_by(username=new_username).first()
            if existing_user:
                return jsonify({"error": "Username already taken"}), 400
            user.username = new_username

        # Check if password is being updated and length requirement fulfilled
        new_password = data.get("password")
        if new_password:
            if len(new_password) < 8:
                return jsonify({"error":f'Password must be at least 8 characters in length.'}), 400
            user.password = new_password

        db.session.commit() # Can immediately commit b/c we have updated fields directly
        return jsonify(user.to_json()), 200
    
    except Exception as e:
        # Rollback to previous state b/c something unexpected happened
        db.session.rollback()
        return jsonify({"error":str(e)}), 500
    
# Login: username and hashed password check:
@user_bp.route("/api/login", methods=["POST"])
def login():
    try:
        data = request.json
        username = data.get("username")
        password = data.get("password")

        # Validate input
        if not username or not password:
            return jsonify({"error": "Username and password are required"}), 400

        # Find the user by username
        user = Users.query.filter_by(username=username).first()
        if user is None:
            return jsonify({"error": "Invalid username or password"}), 401

        # Verify the password exists and matches the username
        if not checkpw(password.encode("utf-8"), user.password.encode("utf-8")):
            return jsonify({"error": "Invalid username or password"}), 401

        # Login successful
        return jsonify({"msg": "Login successful", "user": user.to_json()}), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500