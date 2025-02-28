# A model will just be a table in our database
# Using this file when we interact with database
from app import db

class Users(db.Model):
    #(type, Going to be unique and incremented by one)
    #The PRIMARY KEY constraint uniquely identifies each
    # record in a table. Primary keys must contain UNIQUE values,
    # and cannot contain NULL values.
    id = db.Column(db.Integer, primary_key = True)
    # Max length is 100, cannot be null
    # if nullable = True --> optional
    name = db.Column(db.String(100), nullable = False)
    income = db.Column(db.String(50), nullable = False)
    expenses = db.Column(db.String(50), nullable = False)
    gender = db.Column(db.String(10), nullable = False)
    img_url = db.Column(db.String(200), nullable = True)

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
            "imgUrl":self.img_url
        }