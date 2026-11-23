from sqlalchemy import Column, Integer, String, Boolean, Enum, Float, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from restaurantapp import db, app
from enum import  Enum as MyEnum
from datetime import datetime
from flask_login import UserMixin

class BaseModel(db.Model):
    __abstract__ = True

    id = Column(Integer, primary_key=True, autoincrement=True)
    active = Column(Boolean, default=True)

class UserRole(MyEnum):
    ADMIN = 1
    USER = 2

class MethodPayment(MyEnum):
    CASH = 1
    CREDIT_CARD = 2
    OR_CODE = 3

class Status(MyEnum):
    PENDING = 1
    COOKING = 2
    DONE = 3

class User(BaseModel, UserMixin):
    name = Column(String(50), nullable=False)
    username = Column(String(50), nullable=False, unique=True)
    password = Column(String(50), nullable=False)
    user_role = Column(Enum(UserRole), default=UserRole.USER)
    staffs = relationship("Staff", backref="user", lazy=True)

    def __str__(self):
        return self.name

class Staff(BaseModel):
    user_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    phone = Column(String(50), nullable=False, unique=True)
    email = Column(String(50), nullable=False, unique=True)
    role_id = Column(Integer, ForeignKey('role.id'), nullable=False)

class Role(BaseModel):
    name = Column(String(50), nullable=False)
    staffs = relationship("Staff", backref='role', lazy=True)

    def __str__(self):
        return self.name

class Category(BaseModel):
    name = Column(String(20), nullable=False)
    dishes = relationship("Dish", backref='category', lazy=True)

    def __str__(self):
        return self.name

class DiningTable(BaseModel):
    name = Column(String(10), nullable=False, unique=True)
    is_available = Column(Boolean, default=True)
    food_orders = relationship("FoodOrder", backref="dining_table", lazy=True)

    def __str__(self):
        return self.name

class Dish(BaseModel):
    name = Column(String(255), nullable=False, unique=True)
    price = Column(Float, default=0)
    image_url = Column(String(255))
    category_id = Column(Integer, ForeignKey('category.id'), nullable=False)

    def __str__(self):
        return self.name

class FoodOrder(BaseModel):
    staff_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    diningtable_id = Column(Integer, ForeignKey('dining_table.id'), nullable=False)
    status = Column(Enum(Status), default=Status.PENDING)
    order_time = Column(DateTime, default=datetime.now, nullable=False)
    order_details = relationship("OrderDetail", backref="food_order", lazy=True)
    bill = relationship("Bill", backref="food_order", lazy=True)

class OrderDetail(BaseModel):
    order_id = Column(Integer, ForeignKey('food_order.id'), nullable=False)
    dish_id = Column(Integer, ForeignKey('dish.id'), nullable=False)
    quantity = Column(Integer, default=1)
    notes = Column(String(50), nullable=False)

    def __str__(self):
        return self.order_id

class Bill(BaseModel):
    staff_id = Column(Integer, ForeignKey('user.id'), nullable=False)
    order_id = Column(Integer, ForeignKey('food_order.id'), nullable=False)
    total = Column(Float, default=0)
    is_paid = Column(Boolean, default=False)
    payment = relationship("Payment", backref="bill", lazy=True)

class Payment(BaseModel):
    bill_id = Column(Integer, ForeignKey('bill.id'), nullable=False)
    method = Column(Enum(MethodPayment), default=MethodPayment.CASH)


if __name__ == "__main__":
    with app.app_context():
        db.create_all()
