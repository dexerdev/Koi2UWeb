from os import abort
import os
from flask import Flask,request,jsonify,make_response,current_app, redirect,url_for
from flask.templating import render_template
from datetime import datetime, date
from datetime import timedelta
from  flask_cors import CORS
from functools import update_wrapper
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
