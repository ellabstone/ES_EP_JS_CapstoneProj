# models.py
from extensions import db
from datetime import datetime, timezone

class Users(db.Model):
    #The PRIMARY KEY constraint uniquely identifies each
    # record in a table. Primary keys must contain UNIQUE values,
    # and cannot contain NULL values.
    id = db.Column(db.Integer, primary_key = True)
    name = db.Column(db.String(100), nullable = False)
    username = db.Column(db.String(100), nullable = False)
    password = db.Column(db.String(100), nullable = False) # Store hashed passwords

    # Relationships
    initial_expenses = db.relationship("InitialExpense", backref="user", lazy=True, cascade="all, delete-orphan")

    initial_incomes = db.relationship("InitialIncome", backref="user", lazy=True, cascade="all, delete-orphan")

    budgets = db.relationship("Budget", backref="user", lazy=True, cascade="all, delete-orphan")
    
    # Taking user and convert to json
    def to_json(self):
        return{
            "id":self.id,
            "name":self.name,
            "username":self.username,
            #"password":self.password,
            "initial_expenses_count": len(self.initial_expenses),
            "initial_incomes_count": len(self.initial_incomes),
            "initial_expenses": [initial_expense.to_json() for initial_expense in self.initial_expenses],
            "initial_incomes": [initial_income.to_json() for initial_income in self.initial_incomes],
            "budgets_count": len(self.budgets)
        }

class InitialExpense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category_type = db.Column(db.String(100), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "amount": self.amount,
            "category_type": self.category_type,
            "user_id": self.user_id
        }

class InitialIncome(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "title": self.title,
            "amount": self.amount,
            "user_id": self.user_id
        }

class Budget(db.Model):
    __tablename__ = 'budgets'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    method = db.Column(db.String(100), nullable=False)
    period = db.Column(db.String(100), nullable=False)
    created_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = db.Column(db.DateTime, default=lambda: datetime.now(timezone.utc),
                           onupdate=lambda: datetime.now(timezone.utc))

    expenses = db.relationship("BudgetExpense", backref="budget", lazy=True, cascade="all, delete-orphan")
    incomes = db.relationship("BudgetIncome", backref="budget", lazy=True, cascade="all, delete-orphan")

    def to_json(self):
        return {
            "id": self.id,
            "userId": self.user_id,
            "method": self.method,
            "period": self.period,
            "createdAt": self.created_at.isoformat() if self.created_at else None,
            "updatedAt": self.updated_at.isoformat() if self.updated_at else None,
            "expenses": [expense.to_json() for expense in self.expenses],
            "incomes": [income.to_json() for income in self.incomes],
            "total_income": sum(income.amount for income in self.incomes),
            "total_expenses": sum(expense.amount for expense in self.expenses),
            "balance_after_expenses": sum(income.amount for income in self.incomes) - sum(expense.amount for expense in self.expenses)
        }

class BudgetExpense(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    budget_id = db.Column(db.Integer, db.ForeignKey("budgets.id"), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    category_type = db.Column(db.String(100), nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "budget_id": self.budget_id,
            "title": self.title,
            "amount": self.amount,
            "category_type": self.category_type
        }

class BudgetIncome(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    budget_id = db.Column(db.Integer, db.ForeignKey("budgets.id"), nullable=False)
    title = db.Column(db.String(100), nullable=False)
    amount = db.Column(db.Float, nullable=False)

    def to_json(self):
        return {
            "id": self.id,
            "budget_id": self.budget_id,
            "title": self.title,
            "amount": self.amount
        }

'''class ExpenseCategories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Name of the category (ex. "rent" or "subscriptions")
    title = db.Column(db.String(100), nullable=False)
    # Amount allocated to this category
    amount = db.Column(db.Float, nullable=False)
    category_type = db.Column(db.String(100), nullable=False) # e.g. "Necessities", "Wants", "Savings"
    # Link to the user's budget
    budget_id = db.Column(db.Integer, db.ForeignKey("budgets.id"), nullable=False)

    # Define a relationship with Budgets
    budget = db.relationship("Budgets",
                             backref="expense_categories",
                             lazy=True,
                             cascade="all, delete-orphan")

    def to_json(self):
        return{
            "id":self.id,
            "title":self.title,
            "amount":self.amount,
            "category":self.category_type,
            "budgetId":self.budget_id
        }
    
class IncomeCategories(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # Name of the category (ex. "rent" or "subscriptions")
    title = db.Column(db.String(100), nullable=False)
    # Amount allocated to this category
    amount = db.Column(db.Float, nullable=False)
    # Link to the user's budget
    budget_id = db.Column(db.Integer, db.ForeignKey("budgets.id"), nullable=False)

    # Define a relationship with Budgets
    budget = db.relationship("Budgets",
                             backref="income_categories",
                             lazy=True,
                             cascade="all, delete-orphan")

    def to_json(self):
        return{
            "id":self.id,
            "title":self.title,
            "amount":self.amount,
            "budgetId":self.budget_id
        }'''