
import json
from pathlib import Path
from flask import Flask, jsonify, render_template, request
from restaurantapp import app
from restaurantapp.models import Category

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "products.json"


@app.get("/")
def get_products():
    with open(DATA_FILE, "r", encoding="utf-8") as file:
        products = json.load(file)

    return render_template("index.html", products=products)

@app.get("/order")
def get_order():
    category = Category.query.all()
    select_category = request.args.get("category", type=int, default=1)
    return render_template("order.html", category = category, select_category = select_category)

if __name__ == "__main__":
    app.run(debug=True)

