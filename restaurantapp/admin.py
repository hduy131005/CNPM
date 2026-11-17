from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from restaurantapp import app, db
from models import Category

admin = Admin(app, name="Quản Lý Nhà Hàng",url="/admin")

admin.add_view(ModelView(Category, db.session))
