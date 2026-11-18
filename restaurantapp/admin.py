from flask_admin import Admin
from flask_admin.contrib.sqla import ModelView
from restaurantapp import app, db
from models import *
from flask_login import logout_user, current_user

admin = Admin(app, name="Quản Lý Nhà Hàng",url="/admin")

admin.add_view(ModelView(Category, db.session))
admin.add_view(ModelView(User, db.session))
admin.add_view(ModelView(Staff, db.session))
admin.add_view(ModelView(Role, db.session))
admin.add_view(ModelView(DiningTable, db.session))
admin.add_view(ModelView(Dish, db.session))
admin.add_view(ModelView(FoodOrder, db.session))
admin.add_view(ModelView(OrderDetail, db.session))
admin.add_view(ModelView(Bill, db.session))
admin.add_view(ModelView(Payment, db.session))

