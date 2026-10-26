
import json
from pathlib import Path
from flask import Flask, render_template

app = Flask(__name__)

BASE_DIR = Path(__file__).resolve().parent
DATA_FILE = BASE_DIR / "data" / "products.json"


@app.route("/")
def home():
    with DATA_FILE.open("r", encoding="utf-8") as file:
        products = json.load(file)

    return render_template(
        "index.html",
        products=products
    )


if __name__ == "__main__":
    app.run(debug=True)
