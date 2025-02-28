from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS

# Flask wants to pass--> Important for relative pass
app = Flask(__name__)
CORS(app) # Allows requests/responses between websites

# database is created locally under the backend folder
app.config['SQLALCHEMY_DATABASE_URI'] = "sqlite:///budgetUsers.db"
# Performance: Do not consume resources, we do not care about modifications that sqlalc does
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
#Creating db isntance
db = SQLAlchemy(app)

import routes # not returning anything from file so no "from" needed

#Create all tables in our database
# Need to pass so sqlAlc can do it's job in a more optimized way
with app.app_context():
    db.create_all()

if __name__ == "__main__":
    #Better debugging in console
    app.run(debug = True)

'''
set FLASK_APP=app.py
set FLASK_ENV=development
flask run
'''