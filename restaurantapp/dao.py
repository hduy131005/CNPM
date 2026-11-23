from restaurantapp import app, db
from models import Category, User
import hashlib
from flask_login import current_user

def add_user(name, username, password):
    password = hashlib.md5(password.encode("utf-8")).hexdigest()
    user =User(name=name, username=username, password=password)
    db.session.add(user)
    db.session.commit()

def auth(username, password):
    password = hashlib.md5(password.strip().encode('utf-8')).hexdigest()

    return User.query.filter(User.username.__eq__(username.strip()), User.password.__eq__(password)).first()

def get_user_byId(user_id):
    return User.query.get(user_id)

# if __name__== "__main__":
#     with app.app_context():
#         print(add_user(name="ABC", username="Abc", password="123"))