from os import abort
import os
from flask import Flask,request,jsonify,make_response,current_app, redirect,url_for,session,send_from_directory
from flask.templating import render_template
from flask_session import Session
from datetime import datetime, date,timedelta
from  flask_cors import CORS
from functools import update_wrapper
import requests
from app.config import *
from app.general import *


urlAPI = UrlAPI
app = Flask(__name__)
app.config['SECRET_KEY'] = 'Dexertedza@1'
app.config['SESSION_TYPE'] = 'filesystem'
Session(app)

from .models import apiResult,paymentModel

@app.route("/")
def home():
    username = request.cookies.get('username')
    userId = request.cookies.get('userId')
    if not 'logged_in' in session:
        return render_template("login.html")
    else:
        return render_template("index.html",username = session['username'])

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
    paymentList = requests.get(urlAPI+'api/getPaymentListAll').json()
    for pay in paymentList['data']:
        if pay['payDate'] != None:
            payDate = pay['payDate'].replace('T',' ')
        else:
            payDate = ''
        if pay['updateDate'] != None:
            updateDate = pay['updateDate'].replace('T',' ')
        else:
            updateDate = ''
        pay['updateDate'] = updateDate
        pay['payDate'] = payDate
    if not 'logged_in' in session:
        return render_template("login.html")
    else:
        return render_template("billmanage.html",username = session['username'],paymentList = paymentList['data'])


@app.route("/orderhistory")
def orderhistory(): 
    orderList = requests.get(urlAPI+'api/getOrderList').json()
    for order in orderList['data']:
        if order['updateDate'] != None:
            updateDate = order['updateDate'].replace('T',' ')
        else:
            updateDate = ''
        order['updateDate'] = updateDate
    if not 'logged_in' in session:
        return render_template("login.html")
    else:
        return render_template("orderhistory.html",username = session['username'],orderList = orderList['data'])

@app.route("/deliverymanage")
def deliverymanage(): 
    deliveryList = requests.get(urlAPI+'api/getDeliveryAll').json()
    for deli in deliveryList['data']:
        if deli['updateDate'] != None:
            updateDate = deli['updateDate'].replace('T',' ')
        else:
            updateDate = ''
        deli['updateDate'] = updateDate
    if not 'logged_in' in session:
        return render_template("login.html")
    else:
        return render_template("deliverymanage.html",username = session['username'],deliveryList = deliveryList['data'])

@app.route("/promotionmanage")
def promotionmanage(): 
    promoLs = requests.get(urlAPI+'api/getPromotion').json()
    for promo in promoLs['data']:
        dateFormat = "%Y-%m-%dT%H:%M:%S"
        dateString = '%d/%m/%Y %H:%M'
        startDateStr = promo['startDate']
        endDateStr = promo['endDate']
        startDate = datetime.strptime(startDateStr, dateFormat)
        endDate = datetime.strptime(endDateStr, dateFormat)
        promo['startDate'] = startDate.strftime(dateString)
        promo['endDate'] = endDate.strftime(dateString)
        promo['discountType'] = 'เปอร์เซ็นต์' if promo['discountType'] == 'percentage' else 'บาท'
    return render_template("promotionmanage.html",promoLs=promoLs['data'],username = session['username']) 


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


@app.route('/api/getPromotionId')
def getPromotionId():
    try:
        result = apiResult.apiResult()
        promoId = request.args.get('promoId')
        promo = requests.get(urlAPI+'api/getPromotionId',params={"promoId":promoId}).json()
        result.data = promo['data']
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)

@app.route('/api/editPromotion',methods=['PUT'])
def editPromotion():
    try:
        result = apiResult.apiResult()
        promoId = request.json.get('promoId')
        promoCode = request.json.get('promoCode')
        promoDescription = request.json.get('promoDescription')
        startDate = request.json.get('startDate')
        endDate = request.json.get('endDate')
        targetAmount = request.json.get('targetAmount')
        discount = request.json.get('discount')
        discountType = request.json.get('discountType')
        limitCode = request.json.get('limitCode')
        updateDate = request.json.get('updateDate')
        activeFlag = request.json.get('activeFlag')
        payload = {
            "promoId":promoId,
            "promoCode": promoCode,
            "promoDescription": promoDescription,
            "startDate":startDate,
            "endDate":endDate,
            "targetAmount":targetAmount,
            "discount":discount,
            "discountType":discountType,
            "activeFlag": activeFlag,
            "limitCode": limitCode,
            "updateDate": updateDate
        }
        promo = requests.request("PUT",urlAPI+'api/editPromotion',json=payload).json()
        result.data = promo['data']
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)


@app.route('/api/createPromotion',methods=['POST'])
def createPromotion():
    try:
        result = apiResult.apiResult()
        promoCode = request.json.get('promoCode')
        promoDescription = request.json.get('promoDescription')
        startDate = request.json.get('startDate')
        endDate = request.json.get('endDate')
        targetAmount = request.json.get('targetAmount')
        discount = request.json.get('discount')
        discountType = request.json.get('discountType')
        limitCode = request.json.get('limitCode')
        updateDate = request.json.get('updateDate')
        createDate = request.json.get('createDate')
        activeFlag = request.json.get('activeFlag')
        payload = {
            "promoCode": promoCode,
            "promoDescription": promoDescription,
            "startDate":startDate,
            "endDate":endDate,
            "targetAmount":targetAmount,
            "discount":discount,
            "discountType":discountType,
            "activeFlag": activeFlag,
            "limitCode": limitCode,
            "updateDate": updateDate,
            "createDate":createDate
        }
        promo = requests.request("POST",urlAPI+'api/createPromotion',json=payload).json()
        result.data = promo['data']
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)


@app.route('/api/delPromotionId',methods=['DELETE'])
def delPromotionId():
    try:
        result = apiResult.apiResult()
        promoId = request.args.get('promoId')
        promo = requests.delete(urlAPI+'api/delPromotion',params={"promoId":promoId}).json()
        result.data = promo
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)

@app.route('/api/getSlipImg')
def apiGetSlipImg():
    try:
        result = apiResult.apiResult()
        paymentId = request.args.get('paymentId')
        slip = requests.get(urlAPI+'api/getSlipImg',params={"paymentId":paymentId}).json()
        result.data = slip['data']
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)

@app.route('/api/cancelPayment',methods=['PUT'])
def apiCancelPayment():
    try:
        result = apiResult.apiResult()
        paymentId = request.args.get('paymentId')
        paymentRes = requests.put(urlAPI+'api/cancelPayment',params={"paymentId":paymentId}).json()
        result.data = paymentRes
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)



@app.route('/api/recievedPayment',methods=['POST'])
def apiRecievedPayment():
    try:
        result = apiResult.apiResult()
        if not request.json:
            abort(400, description="Request Wrong Json Format")
        paymentId = request.json.get('paymentId')
        payload = {
            "paymentId" : paymentId
        }
        paymentRes = requests.post(urlAPI+'api/recievedPayment',json=payload).json()
        result.data = paymentRes
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)


@app.route("/invoice")
def invoice():
    paymentId = request.args.get('paymentId')
    _paymentDet = requests.get(urlAPI+'api/getPaymentDetail',params={"paymentId":paymentId}).json()
    _paymentDet = _paymentDet['data']
    invoiceDet = paymentModel.invoiceModel()
    invoiceDet.addressText = _paymentDet[0]['addressText']
    invoiceDet.subDistrict = _paymentDet[0]['subDistrict']
    invoiceDet.district = _paymentDet[0]['district']
    invoiceDet.province = _paymentDet[0]['province']
    invoiceDet.zipcode = _paymentDet[0]['zipcode']
    invoiceDet.firstname = _paymentDet[0]['firstName']
    invoiceDet.lastname = _paymentDet[0]['lastName']
    if _paymentDet[0]['payDate'] != None:
        invoiceDet.payDate = datetime.strptime(_paymentDet[0]['payDate'],'%Y-%m-%dT%H:%M:%S').strftime('%d/%m/%Y')
    else:
        invoiceDet.payDate = "ชำระปลายทาง"
    invoiceDet.paymentId = _paymentDet[0]['paymentId']
    invoiceDet.totalAmount = _paymentDet[0]['totalAmount']
    invoiceDet.totalThaiBath =  thaiBath(_paymentDet[0]['totalAmount'])
    invoiceDet.telNo = _paymentDet[0]['telNo']
    invoiceDet.discountTotal = _paymentDet[0]['discountTotal']
    invoiceDet.total = _paymentDet[0]['total']
    paymentLs = []
    for payDet in _paymentDet:
        payDetail = paymentModel.paymentDetail()
        payDetail.price = payDet['price']
        payDetail.qty = payDet['qty']
        payDetail.productName = payDet['productName']
        paymentLs.append(payDetail)
    invoiceDet.paymentDetail = paymentLs
    return render_template("invoice.html",invoiceDet = invoiceDet)

@app.route('/api/delivered',methods=['PUT'])
def apiDelivered():
    try:
        result = apiResult.apiResult()
        if not request.json:
            abort(400, description="Request Wrong Json Format")
        deliveryId = request.json.get('deliveryId')
        payload = {
            "deliveryId" : deliveryId
        }
        deliveryRes = requests.put(urlAPI+'api/delivered',json=payload).json()
        result.data = deliveryRes
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)

@app.route('/privacy')
def privacy():
    return render_template("privacy.html")

@app.route('/api/backwardDeliver',methods=['PUT'])
def apiBackwardDeliver():
    try:
        result = apiResult.apiResult()
        if not request.json:
            abort(400, description="Request Wrong Json Format")
        deliveryId = request.json.get('deliveryId')
        payload = {
            "deliveryId" : deliveryId
        }
        deliveryRes = requests.put(urlAPI+'api/backwardDeliver',json=payload).json()
        result.data = deliveryRes
        result.success = True
        result.message = "Completed!!"
    except Exception as e:
        result.success = False
        result.message = "Failed!!"
        result.error = str(e)
    return jsonify(result.__dict__)
# @app.route('/login_screen')
# def login_screen():
#     return render_template("login_screen.html")

# @app.route('/register_screen')
# def register_screen():
#     return render_template("register_screen.html")