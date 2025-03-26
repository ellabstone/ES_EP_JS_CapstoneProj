#extensions.py
from flask_sqlalchemy import SQLAlchemy

#Creating db isntance
db = SQLAlchemy()

# By moving db initialization to a separate file (extensions.py)
# this break the circular dependency of previous db initializaing in app.py