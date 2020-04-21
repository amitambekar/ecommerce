from pymongo import MongoClient
from config import *

client = MongoClient()
client[DATABASE][PRODUCTS_COLLECTION].insert({ "product_id" : "1" ,"name":"Polo", "color" : "Black", "size" : "M","price" : 100 })
client[DATABASE][PRODUCTS_COLLECTION].insert({ "product_id" : "2" ,"name":"Puma", "color" : "Green", "size" : "XL","price" : 200 })
client[DATABASE][PRODUCTS_COLLECTION].insert({ "product_id" : "3" ,"name":"Adidas", "color" : "White", "size" : "L","price" : 300 })
client[DATABASE][PRODUCTS_COLLECTION].insert({ "product_id" : "4" ,"name":"Nike", "color" : "Red", "size" : "M","price" : 400 })
client[DATABASE][PRODUCTS_COLLECTION].insert({ "product_id" : "5" ,"name":"Rebook", "color" : "Yellow", "size" : "M","price" : 500 })