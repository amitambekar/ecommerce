from flask import *
import hashlib, os
from werkzeug.utils import secure_filename

from pymongo import MongoClient
app = Flask(__name__)
app.secret_key = 'abcd'

from config import *

def get_products(product_ids = []):
    client = MongoClient()
    filters = {}
    if product_ids:
        filters = {"product_id" : {"$in" : product_ids}}
    products_list = list(client[DATABASE][PRODUCTS_COLLECTION].find(filters,{"_id":False}))
    return products_list

def process_order(order_list,address):
    client = MongoClient()
    product_ids = [str(row['product_id']) for row in order_list]
    products = get_products(product_ids = product_ids)
    def get_price(x):
        price = sum([z['price'] for z in products if str(z['product_id']) == str(x['product_id']) ])
        x['price'] = price
        x['total_price'] = price * x['quantity']
        return x

    order_list = list(map(lambda x: get_price(x) ,order_list))
    username = session['username']
    client[DATABASE][ORDER_COLLECTION].insert({"username":username,"products":order_list,"address":address})
    return True

@app.route("/checkout",methods = ['GET'])
def checkout():
    products_list = get_products()
    return render_template("checkout.html", products_list = products_list)

@app.route("/place_order",methods = ['POST'])
def place_order():
    if request.method == 'POST':
        args = request.get_json()
        products = args['products']
        address = args['address']
        process_order(products,address)
        return jsonify({"message":"success"})

@app.route("/")
def home():
    if 'is_logged_in' in session:
        products_list = get_products()
        return render_template("home.html", products_list = products_list)
    else:
        return redirect(url_for('login'))

@app.route("/login", methods = ['GET','POST'])
def login():
    if request.method == 'GET':
        return render_template("login.html" , error = '')
    elif request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        client = MongoClient()
        data = client[DATABASE][USER_COLLECTION].find_one({"username":username,"password":password})
        if data:
            session['username'] = username
            session['name'] = data['name']
            session['is_logged_in'] = True
            return redirect(url_for('home'))
        else:
            return render_template("login.html",error = 'Invalid UserId / Password')

if __name__ == '__main__':
    app.run(debug=True)