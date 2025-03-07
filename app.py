# app.py
from flask import Flask
#from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from extensions import db # Import db from extension.py
from user_routes import user_bp
from expense_routes import expense_categories_bp
import os

# Flask wants to pass--> Important for relative pass
app = Flask(__name__)
CORS(app) # Allows requests/responses between websites

# Register Blueprints
app.register_blueprint(user_bp)
app.register_blueprint(expense_categories_bp)

## Configure database:
# database is created locally under the backend folder
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///budgetUsers.db"
# Performance: Do not consume resources, we do not care about modifications that sqlalc does
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
print(app.config.keys())

# Initialize db with app
db.init_app(app)

# Because I separated the routes and are now importing them separately do I not need?
#import routes # not returning anything from file so no "from" needed

#Create all tables in our database
# Need to pass so sqlAlc can do it's job in a more optimized way
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    #Better debugging in console
    # ToDo: Hide for production by using environment variables
    app.run(host="0.0.0.0", port=10000, debug=True)

'''
Enter in terminal (within venv) before running app
export FLASK_APP=app.py
export FLASK_ENV=development
flask run
'''