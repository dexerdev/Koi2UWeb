class paymentList :
    def __init__(self,paymentId = None,totalAmount = None, orderId = None,userId = None,status = None,updateDate = None, paymentDetail = None,deliveryStatus = None):
        self.paymentId = paymentId
        self.totalAmount = totalAmount
        self.orderId = orderId
        self.userId = userId
        self.status = status
        self.updateDate = updateDate
        self.paymentDetail = paymentDetail
        self.deliveryStatus = deliveryStatus
        
class paymentDetail:
    def __init__(self,productId = None,qty = None, price = None,productName = None,imageBase64 = None,categoryId = None, categoryName = None):
        self.productId = productId
        self.qty = qty
        self.price = price
        self.productName = productName
        self.imageBase64 = imageBase64
        self.categoryId = categoryId
        self.categoryName = categoryName

class invoiceModel:
    def __init__(self,firstname = None, lastname = None, addressText= None, paymentId = None, payDate = None,\
        totalAmount =None, paymentDetail=None , totalThaiBath = None, subDistrict = None,district = None,\
        province = None,zipcode = None,telNo = None,discountTotal=None, total = None):
        self.firstname = firstname 
        self.lastname = lastname 
        self.addressText= addressText
        self.subDistrict = subDistrict
        self.district = district
        self.province = province
        self.zipcode = zipcode
        self.paymentId = paymentId 
        self.payDate = payDate 
        self.totalAmount = totalAmount 
        self.paymentDetail = paymentDetail
        self.totalThaiBath = totalThaiBath
        self.telNo = telNo
        self.discountTotal = discountTotal
        self.total = total