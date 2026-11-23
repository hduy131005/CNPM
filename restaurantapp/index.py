from flask import Flask, jsonify, render_template, request, redirect, url_for
from restaurantapp import app, login
from models import Category
from dao import *
import admin
from flask_login import login_user, logout_user, login_required

@app.get("/")
def index():
    return render_template("index.html")

@app.route("/menu")
def menu():
    return render_template("menu.html")

@app.route("/order")
def pay():
    return render_template("order.html")

@app.route("/invoice")
def invoice():
    return render_template("invoice.html")

@app.route("/chef")
def chef():
    return render_template("order_management.html")

@app.route('/login', methods=['GET', 'POST'])
def login():
    error = None

    if request.method == 'POST':
        username = request.form.get('username', '').strip()
        password = request.form.get('password', '')

        if not username or not password:
            error = "Nhập đủ username và password."

        else:

            error = "Username hoặc password không chính xác."

    return render_template('login.html', error=error)

@app.route("/login", methods=['GET', 'POST'])
def login_my_user():
    err_msg = None
    if request.method.__eq__('POST'):
        username = request.form.get('email')
        password = request.form.get('password')

        user = auth(username=username, password=password)
        if user:
            login_user(user=user)
            return redirect(url_for("index"))
        else:
            err_msg = "Tài khoản hoặc mật khẩu không đúng!!"

    return render_template("login.html", err_msg=err_msg)

@login.user_loader
def load_user(user_id):
    return User.query.get(user_id)

if __name__ == "__main__":
    app.run(debug=True)

