from os import abort
import os
from flask import Flask,request,jsonify,make_response,current_app, redirect,url_for,session,send_from_directory
from flask.templating import render_template
from flask_session import Session
from datetime import datetime, date
from datetime import timedelta
from  flask_cors import CORS
from functools import update_wrapper
import requests
from app.config import *

urlAPI = UrlAPI
app = Flask(__name__)
app.config['SECRET_KEY'] = 'Dexertedza@1'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

from .models import apiResult


@app.route("/")
def home():
    username = request.cookies.get('username')
    userId = request.cookies.get('userId')
    if not 'logged_in' in session:
        return render_template("login.html")
    else:
        categoryLs = requests.get(urlAPI+'api/getCategory').json()
        return render_template("productmanage.html",categoryLs=categoryLs['data'])


@app.route("/productmanage")
def productmanage():
    try:
        # userId = request.cookies.get('userId')
        categoryLs = requests.get(urlAPI+'api/getCategory').json()
        productLs = requests.get(urlAPI+'api/getProductAll').json()
        if not 'logged_in' in session:
            return render_template("login.html")
        else:
            return render_template("productmanage.html",categoryLs=categoryLs['data'],productLs=productLs['data'])
    except Exception as e:
        raise e

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
def checkLogin():
    try:
        if not request.json:
            abort(400, description="Request Wrong Json Format")
        result = apiResult.apiResult()
        username = request.json.get('username')
        password = request.json.get('password')
        payload = {"username":username,"password":password}
        login = requests.post(urlAPI+'api/checkLogin',json=payload).json()
        session['logged_in'] = True
        session['username'] = username
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

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
    return redirect(url_for('login'))

@app.route('/api/createCategory',methods=['POST'])
def createCategory():
    try:
        result = apiResult.apiResult()
        categoryName = request.json.get('categoryName')
        createDate = request.json.get('createDate')
        createBy = session['username']
        payload = {"categoryName":categoryName,"createDate":createDate,"createBy":createBy}
        cate = requests.post(urlAPI+'api/createCategory',json=payload).json()
        result.data = cate
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)

@app.route('/api/delCategory',methods=['DELETE'])
def delCategory():
    try:
        result = apiResult.apiResult()
        categoryId = request.args.get('categoryId')
        cate = requests.delete(urlAPI+'api/delCategory',params={"categoryId":categoryId}).json()
        result.data = cate
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)


@app.route('/api/createProduct',methods=['POST'])
def createProduct():
    try:
        result = apiResult.apiResult()
        productData = request.form
        createBy = session['username']
        payload={'productName': productData['productName'],
                'productDetail': productData['productDetail'],
                'price': productData['price'],
                'categoryId': productData['categoryId'],
                'createDate': productData['createDate'],
                'createBy': createBy,
                'qty': productData['qty'],
                'unit': productData['unit']}
        files = []
        for file in request.files.getlist('productImages'):
            files.append(('productImages', (file.filename, file.read(), file.content_type)))
        response = requests.request("POST", urlAPI+'api/createProduct',data=payload,files=files).json()
        result.data = response
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)


@app.route('/images/<path:image_name>')
def images(image_name):
    filenames = image_name.split('/')
    filename = filenames[-1]
    path = image_name.replace(filename,'')
    return send_from_directory(f'/{path}',filename)

@app.route('/api/getProduct')
def getProudt():
    try:
        result = apiResult.apiResult()
        productId = request.args.get('productId')
        prod = requests.get(urlAPI+'api/getProduct',params={"productId":productId}).json()
        result.data = prod['data']
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)


@app.route('/api/editProduct',methods=['PUT'])
def editProduct():
    try:
        result = apiResult.apiResult()
        productData = request.form
        payload={'productId':productData['productId'],
                'productName': productData['productName'],
                'productDetail': productData['productDetail'],
                'price': productData['price'],
                'categoryId': productData['categoryId'],
                'editImages': productData['editImages'],
                'qty': productData['qty'],
                'unit': productData['unit']}
        files = []
        for file in request.files.getlist('productImages'):
            files.append(('productImages', (file.filename, file.read(), file.content_type)))
        response = requests.request("PUT", urlAPI+'api/editProduct',data=payload,files=files).json()
        result.data = response
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)