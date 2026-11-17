from flask import Flask, jsonify, render_template, request
from restaurantapp import app
from models import Category
import admin

@app.get("/")
def get_products():

    return render_template("index.html")

@app.get("/order")
def get_order():
    category = Category.query.all()
    select_category = request.args.get("category", type=int, default=1)
    return render_template("order.html", category = category, select_category = select_category)

@app.get("/table")
def get_table():
    return render_template("table.html")

if __name__ == "__main__":
    app.run(debug=True)

