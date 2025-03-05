# models.py
# A model will just be a table in our database
# Using this file when we interact with database
from extensions import db

class Users(db.Model):
    #(type, Going to be unique and incremented by one)
    #The PRIMARY KEY constraint uniquely identifies each
    # record in a table. Primary keys must contain UNIQUE values,
    # and cannot contain NULL values.
    id = db.Column(db.Integer, primary_key = True)
    # Max length is 100, cannot be null
    # if nullable = True --> optional
    name = db.Column(db.String(100), nullable = False)
    income = db.Column(db.Float, nullable = False)
    expenses = db.Column(db.Float, nullable = False)
    gender = db.Column(db.String(10), nullable = False)
    img_url = db.Column(db.String(200), nullable = True)

    ###### Create a new table, ExpenseCategories, which will store the
    # custom expense categories for each user. This table will have a foreign
    # key that links it to the Users table.

    # Defining a one-to-many relationship with ExpenseCategories
    expense_categories = db.relationship("ExpenseCategories",
                                          backref="user",
                                          lazy=True,
                                          cascade="all, delete-orphan")

    # When you send data to client, need to send via json
    # Create it once, whenever we need to convert to json we call this function
    # Taking user and convert to json
    def to_json(self):
        return{
            "id":self.id,
            "name":self.name,
            "income":self.income,
            "expenses":self.expenses,
            "gender":self.gender,
            #Camel case is common in javaScript
            "imgUrl":self.img_url,
            # Include categories in JSON
            "expenseCategories": [category.to_json() for category in self.expense_categories]
        }
    
class ExpenseCategories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Name of the category (ex. "rent" or "subscriptions")
    title = db.Column(db.String(100), nullable=False)
    # Amount allocated to this category
    amount = db.Column(db.Float, nullable=False)
    # Link to the User
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)

    def to_json(self):
        return{
            "id":self.id,
            "title":self.title,
            "amount":self.amount,
            "userId":self.user_id
        }
