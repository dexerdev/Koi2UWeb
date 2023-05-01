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
        productLs = requests.get(urlAPI+'api/getProductAll').json()
        return render_template("productmanage.html",categoryLs=categoryLs['data'],productLs=productLs['data'],username = session['username'])

@app.route('/checkSession')
def checkSession():
    if not 'logged_in' in session:
        return jsonify({"result":False})
    else:
        return jsonify({"result":True})

@app.route("/productmanage")
def productmanage():
    try:
        # userId = request.cookies.get('userId')
        categoryLs = requests.get(urlAPI+'api/getCategory').json()
        productLs = requests.get(urlAPI+'api/getProductAll').json()
        if not 'logged_in' in session:
            return render_template("login.html")
        else:
            return render_template("productmanage.html",categoryLs=categoryLs['data'],productLs=productLs['data'],username = session['username'])
    except Exception as e:
        raise e

@app.route('/productgroup')
def productgroup():
    try:
        productTop = requests.get(urlAPI+'api/getProductGroupTop').json()
        productLs = requests.get(urlAPI+'api/getProductAll').json()
        if not 'logged_in' in session:
            return render_template("login.html")
        else:
            return render_template("productgroup.html",productTop=productTop['data'],productLs=productLs['data'],username = session['username'])
    except Exception as e:
        raise e

@app.route("/usermanage")
def usermanage(): 
    try:
        userLs = requests.get(urlAPI+'api/getUserAll').json()
        if not 'logged_in' in session:
            return render_template("login.html")
        else:
            # return render_template("productgroup.html",productTop=productTop['data'],productLs=productLs['data'],username = session['username'])
            return render_template("usermanage.html",userLs=userLs['data'],username = session['username']) 
    except Exception as e:
        raise e

@app.route("/login")
def login():
    return render_template("login.html")

@app.route('/logout')
def logout():
    session.pop('logged_in', None)
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

@app.route('/api/delProduct',methods=['DELETE'])
def delProduct():
    try:
        result = apiResult.apiResult()
        productId = request.args.get('productId')
        prod = requests.delete(urlAPI+'api/delProduct',params={"productId":productId}).json()
        result.data = prod
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)


@app.route('/api/createProductGroup',methods=['POST'])
def createProductGroup():
    try:
        result = apiResult.apiResult()
        prodGrouptName = request.json.get('prodGrouptName')
        createDate = request.json.get('createDate')
        activeFlag = request.json.get('activeFlag')
        productIdList = request.json.get('productIdList')
        payload = {
            "prodGrouptName":prodGrouptName,
            "createDate": createDate,
            "updateDate": createDate,
            "productIdList": productIdList,
            "activeFlag":activeFlag
        }
        prodG = requests.post(urlAPI+'api/createProductGroup',json=payload).json()
        result.data = prodG
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)



@app.route('/api/getProductGroupTopId')
def getProductGroupTopId():
    try:
        result = apiResult.apiResult()
        prodGroupId = request.args.get('prodGroupId')
        prod = requests.get(urlAPI+'api/getProductGroupTopId',params={"prodGroupId":prodGroupId}).json()
        result.data = prod['data']
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)

@app.route('/api/delProductGroup',methods=['DELETE'])
def delProductGroup():
    try:
        result = apiResult.apiResult()
        prodGroupId = request.args.get('prodGroupId')
        prod = requests.delete(urlAPI+'api/delProductGroup',params={"prodGroupId":prodGroupId}).json()
        result.data = prod
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)

@app.route('/api/editProductGroup',methods=['PUT'])
def editProductGroup():
    try:
        result = apiResult.apiResult()
        prodGroupId = request.json.get('prodGroupId')
        prodGrouptName = request.json.get('prodGrouptName')
        updateDate = request.json.get('updateDate')
        activeFlag = request.json.get('activeFlag')
        productIdList = request.json.get('productIdList')
        payload = {
            "prodGroupId":prodGroupId,
            "prodGrouptName":prodGrouptName,
            "updateDate": updateDate,
            "productIdList": productIdList,
            "activeFlag":activeFlag
        }
        prodG = requests.request("PUT",urlAPI+'api/editProductGroup',json=payload).json()
        result.data = prodG
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)


@app.route('/api/getUserProfile')
def getUserProfile():
    try:
        result = apiResult.apiResult()
        userId = request.args.get('userId')
        usr = requests.get(urlAPI+'api/getUserProfile',params={"userId":userId}).json()
        result.data = usr['data']
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)