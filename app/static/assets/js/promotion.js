function getPromotionId(promoId){
    var url = '/api/getPromotionId?promoId=' + promoId;
    fetch(url).then(response => response.json()).then((json) => {
        if (json.success) {
            console.log(json);
            document.getElementById("editPromoCode").value = json.data.promoCode;
            document.getElementById("editPromoDescription").value = json.data.promoDescription;
            document.getElementById("editStartDate").value = json.data.startDate;
            document.getElementById("editEndDate").value = json.data.endDate;

            if (json.data.activeFlag) {
                document.getElementById("editActiveFlag").value = "Active";
            }
            else {
                document.getElementById("editActiveFlag").value = "InActive";
            }
            document.getElementById("editTargetAmount").value = json.data.targetAmount;
            document.getElementById("editDiscount").value = json.data.discount;
            document.getElementById("editDiscountType").value = json.data.discountType;
            document.getElementById("editLimitCode").value = json.data.limitCode;
            document.getElementById("btnEditPromotion").setAttribute('onclick', 'editPromotion(' + promoId + ')');
            $("#editPromotion").modal("show");
        }
        else {
            Swal.fire(
                'ไม่พบ Promotion',
                '',
                'error'
            );
        }
    });
}

function editPromotion(promoId){
    var url = '/api/editPromotion';
    var promoCode = document.getElementById("editPromoCode").value;
    var promoDescription = document.getElementById("editPromoDescription").value;
    var startDate = document.getElementById("editStartDate").value;
    var endDate = document.getElementById("editEndDate").value;
    var activeFlag = document.getElementById("editActiveFlag").value;
    var targetAmount = document.getElementById("editTargetAmount").value;
    var discount = document.getElementById("editDiscount").value;
    var discountType =document.getElementById("editDiscountType").value;
    var limitCode = document.getElementById("editLimitCode").value;
    if (promoCode === "") {
        Swal.fire(
            'PromoCode',
            'promo code cannot be empty',
            'error'
        );
    }

    if (activeFlag == "Active") {
        activeFlag = true
    }
    else {
        activeFlag = false
    }
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    var updateDate = today;
    
    var json = JSON.stringify({
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
    });
    
    fetch(url, {
        method: 'PUT',
        body: json,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(response => response.json()).then((json) => {
        if (json.success) {
            Swal.fire({
                title: 'แก้ไขรายการเรียบร้อย',
                icon: 'success',
                showconfirmbutton: true,
                allowoutsideclick: false,
                allowescapekey: false
            }).then(function () {
                //console.log(json.data);
                window.location.href = "/promotionmanage";
            });
        }
        else {
            Swal.fire(
                'แก้ไขสินค้าไม่สำเร็จ',
                '',
                'error'
            );
        }
    });
}


function createPromotion(){
    var url = '/api/createPromotion';
    var promoCode = document.getElementById("promoCode").value;
    var promoDescription = document.getElementById("promoDescription").value;
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    var activeFlag = document.getElementById("activeFlag").value;
    var targetAmount = document.getElementById("targetAmount").value;
    var discount = document.getElementById("discount").value;
    var discountType =document.getElementById("discountType").value;
    var limitCode = document.getElementById("limitCode").value;
    if (promoCode === "") {
        Swal.fire(
            'PromoCode',
            'promo code cannot be empty',
            'error'
        );
    }

    if (activeFlag == "Active") {
        activeFlag = true
    }
    else {
        activeFlag = false
    }
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    var updateDate = today;
    var createDate = today;
    var json = JSON.stringify({
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
    });
    
    fetch(url, {
        method: 'POST',
        body: json,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(response => response.json()).then((json) => {
        if (json.success) {
            Swal.fire({
                title: 'เพิ่มรายการเรียบร้อย',
                icon: 'success',
                showconfirmbutton: true,
                allowoutsideclick: false,
                allowescapekey: false
            }).then(function () {
                //console.log(json.data);
                window.location.href = "/promotionmanage";
            });
        }
        else {
            Swal.fire(
                'เพิ่มสินค้าไม่สำเร็จ',
                '',
                'error'
            );
        }
    });
}

function delPromotionId(promoId) {
    var url = '/api/delPromotionId?promoId=' + promoId;
    Swal.fire({
        title: 'ต้องการลบกลุ่มสินค้า ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(url, {
                method: 'DELETE',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response => response.json()).then((json) => {
                if (json.success) {
                    Swal.fire({
                        title: 'ลบโปรโมชันเรียบร้อย',
                        icon: 'success',
                        showconfirmbutton: true,
                        allowoutsideclick: false,
                        allowescapekey: false
                    }).then(function () {
                        //console.log(json.data);
                        window.location.href = "/promotionmanage";
                    });
                }
                else {
                    Swal.fire(
                        'ลบโปรโมชันไม่สำเร็จ',
                        '',
                        'error'
                    );
                }
            });
        }
    })
}