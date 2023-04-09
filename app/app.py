from os import abort
import os
from flask import Flask,request,jsonify,make_response,current_app, redirect,url_for
from flask.templating import render_template
from datetime import datetime, date
from datetime import timedelta
from  flask_cors import CORS
from functools import update_wrapper
import requests

urlAPI = 'http://127.0.0.1:5000/'
app = Flask(__name__)


@app.route("/")
def home():
    # username = request.cookies.get('username')
    # userId = request.cookies.get('userId')
    return render_template("productmanage.html")


@app.route("/productmanage")
def productmanage():
    # username = request.cookies.get('username')
    # userId = request.cookies.get('userId')
    return render_template("productmanage.html")

@app.route("/usermanage")
def usermanage(): 
    return render_template("usermanage.html") 

@app.route("/login")
def login():
    return render_template("login.html")

@app.route("/billmanage")
def billmanage(): 
    return render_template("billmanage.html") 

@app.route("/orderhistory")
def orderhistory(): 
    return render_template("orderhistory.html") 

@app.route("/deliverymanage")
def deliverymanage(): 
    return render_template("deliverymanage.html") 




@app.route('/api/checkLogin',methods=['POST'])
def apiCheckLogin():
    try:
        if not request.json:
            abort(400, description="Request Wrong Json Format")
        username = request.json.get('username')
        password = request.json.get('password')
        login = requests
        if(login != None):
            result.data = login
            result.success = True
            result.message = "Completed!!"
        else:
            result.data = []
            result.success = False
            result.message = "username or password wrong!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)