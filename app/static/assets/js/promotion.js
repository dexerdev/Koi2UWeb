function getPromotionId(promoId) {
    EditIconUpload()
    var url = '/api/getPromotionId?promoId=' + promoId;
    fetch(url).then(response => response.json()).then((json) => {
        if (json.success) {
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

            var imgWraps = document.querySelectorAll('.upload_edit_img-wrap_icon');
            imgWraps.forEach(imgWrap => {
                imgWrap.innerHTML = '';
            });
            if (json.data.thumbnail != null) {
                imgIconArrayEdit.push({"promoId": json.data.promoId});
                var html = "<div class='upload_edit_img-box_icon'><div style='background-image: url(data:image/png;base64," + json.data.thumbnail + ")' onclick='editIconClose(" + json.data.promoId + ")' data-number='" + $(".upload_edit_img-close_icon").length + "' data-file='oldicon-" + promoId + "' class='img-bg'><div class='upload_edit_img-close_icon'></div></div></div>";
                imgWraps.forEach(imgWrap => {
                    imgWrap.innerHTML += html;
                });
                imgIconOldHave = true;
            }
            else {
                imgIconOldHave = false;
            }


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

function editPromotion(promoId) {
    var url = '/api/editPromotion';
    var promoCode = document.getElementById("editPromoCode").value;
    var promoDescription = document.getElementById("editPromoDescription").value;
    var startDate = document.getElementById("editStartDate").value;
    var endDate = document.getElementById("editEndDate").value;
    var activeFlag = document.getElementById("editActiveFlag").value;
    var targetAmount = document.getElementById("editTargetAmount").value;
    var discount = document.getElementById("editDiscount").value;
    var discountType = document.getElementById("editDiscountType").value;
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
    debugger;
    var formData = new FormData();
    for (var i = 0; i < imgIconArrayEdit.length; i++) {
        formData.append("edit_promo_bg", imgIconArrayEdit[i]);
    }
    var editIconImages = [];
    for (var i = 0; i < imgIconArrayEdit.length; i++) {
        if (typeof imgIconArrayEdit[i] === 'object' && !(imgIconArrayEdit[i] instanceof File)) {
            editIconImages.push(imgIconArrayEdit[i]);
        } else if (imgIconArrayEdit[i] instanceof File) {
            // formData.append("edit_promo_bg", imgIconArrayEdit[i]);
        } else {
            console.log("Other:", imgIconArrayEdit[i]);
        }
    }
    formData.append("editBGsImages", JSON.stringify(editIconImages));
    formData.append("promoId",promoId);
    formData.append("promoCode", promoCode);
    formData.append("promoDescription", promoDescription);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("targetAmount", targetAmount);
    formData.append("discount", discount);
    formData.append("discountType", discountType);
    formData.append("activeFlag", activeFlag);
    formData.append("limitCode", limitCode);
    formData.append("updateDate", updateDate);
    var requestOptions = {
        method: 'PUT',
        body: formData,
        redirect: 'follow'
    };
    fetch(url, requestOptions).then(response => response.json()).then((json) => {
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
function createPromotion() {
    var url = '/api/createPromotion';
    var promoCode = document.getElementById("promoCode").value;
    var promoDescription = document.getElementById("promoDescription").value;
    var startDate = document.getElementById("startDate").value;
    var endDate = document.getElementById("endDate").value;
    var activeFlag = document.getElementById("activeFlag").value;
    var targetAmount = document.getElementById("targetAmount").value;
    var discount = document.getElementById("discount").value;
    var discountType = document.getElementById("discountType").value;
    var limitCode = document.getElementById("limitCode").value;
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    var updateDate = today;
    var createDate = today;
    if (promoCode === "") {
        Swal.fire(
            'PromoCode',
            'promo code cannot be empty',
            'error'
        );
        return
    }

    if (startDate === "") {
        Swal.fire(
            'Start Date',
            'Start Date cannot be empty',
            'error'
        );
        return
    }
    if (endDate === "") {
        Swal.fire(
            'End Date',
            'End Date cannot be empty',
            'error'
        );
        return
    }
    if (targetAmount === "") {
        Swal.fire(
            'targetAmount',
            'targetAmount cannot be empty',
            'error'
        );
        return
    }
    if (discount === "") {
        Swal.fire(
            'discount',
            'discount cannot be empty',
            'error'
        );
        return
    }

    if (limitCode === "") {
        Swal.fire(
            'limitCode',
            'limitCode cannot be empty',
            'error'
        );
        return
    }

    if (activeFlag == "Active") {
        activeFlag = true
    }
    else {
        activeFlag = false
    }

    var formData = new FormData();
    for (var i = 0; i < imgIconArray.length; i++) {
        formData.append("promo_bg", imgIconArray[i]);
    }

    formData.append("promoCode", promoCode);
    formData.append("promoDescription", promoDescription);
    formData.append("startDate", startDate);
    formData.append("endDate", endDate);
    formData.append("targetAmount", targetAmount);
    formData.append("discount", discount);
    formData.append("discountType", discountType);
    formData.append("activeFlag", activeFlag);
    formData.append("limitCode", limitCode);
    formData.append("updateDate", updateDate);
    formData.append("createDate", createDate);
    var requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow'
    };
    fetch(url, requestOptions).then(response => response.json()).then((json) => {
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
                'เพิ่มโปรโมชันไม่สำเร็จ',
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
var imgIconArray = [];
jQuery(document).ready(function () {
    ImgIconUpload();
});
function ImgIconUpload() {
    var imgWrap = "";
    $('.upload__inputfile_icon').each(function () {
        $(this).on('change', function (e) {
            imgWrap = $(this).closest('.upload__box_icon').find('.upload__img-wrap_icon');
            var maxLength = $(this).attr('data-max_length_icon');

            var files = e.target.files;
            var filesArr = Array.prototype.slice.call(files);
            var iterator = 0;
            filesArr.forEach(function (f, index) {
                if (!f.type.match('image.*')) {
                    return;
                }

                if (imgIconArray.length > maxLength) {
                    return false
                } else {
                    var len = 0;
                    for (var i = 0; i < imgIconArray.length; i++) {
                        if (imgIconArray[i] !== undefined) {
                            len++;
                        }
                    }
                    if (len > maxLength) {
                        return false;
                    } else {
                        imgIconArray.push(f);
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var html = "<div class='upload__img-box_icon'><div style='background-image: url(" + e.target.result + ")' data-number='" + $(".upload__img-close_icon").length + "' data-file='" + f.name + "' class='img-bg'><div class='upload__img-close_icon'></div></div></div>";
                            imgWrap.append(html);
                            iterator++;
                        }
                        reader.readAsDataURL(f);
                    }
                }
            });
        });
    });

    $('body').on('click', ".upload__img-close_icon", function (e) {
        var file = $(this).parent().data("file");
        for (var i = 0; i < imgIconArray.length; i++) {
            if (imgIconArray[i].name === file) {
                imgIconArray.splice(i, 1);
                break;
            }
        }
        $(this).parent().parent().remove();
    });
}
var imgIconOldHave = false;


var imgIconArrayEdit = [];
function editIconClose(prodImgId) {
    // var file = $(".upload_edit_img-close");
    for (var i = 0; i < imgIconArrayEdit.length; i++) {
        if (imgIconArrayEdit[i].prodImgId === prodImgId) {
            imgIconArrayEdit.splice(i, 1);
            break;
        }
    }
    // console.log(imgArrayEdit);
    // $(".upload_edit_img-close").parent().parent().remove();
}

function EditIconUpload() {
    var editImgWrap = "";
    var stopFlag = false;
    document.getElementById('upload_edit_inputfile_icon').value = "";
    $('.upload_edit_inputfile_icon').each(function () {
        if (stopFlag) {
            return false;
        }
        else {
            // console.log($(this));
            debugger;
            $(this).on('change', function (e) {
                editImgWrap = $(this).closest('.upload_edit_box_icon').find('.upload_edit_img-wrap_icon');
                var maxLength = $(this).attr('data-max_length_icon');
                // console.log(editImgWrap);
                var files = e.target.files;
                // console.log(files);
                var filesArr = Array.prototype.slice.call(files);
                var iterator = 0;
                filesArr.forEach(function (f, index) {
                    if (!f.type.match('image.*')) {
                        return;
                    }
                    // console.log(f);
                    if (imgIconArrayEdit.length > maxLength) {
                        return false
                    } else {
                        var len = 0;
                        for (var i = 0; i < imgIconArrayEdit.length; i++) {
                            if (imgIconArrayEdit[i] !== undefined) {
                                len++;
                            }
                        }
                        if (len > maxLength) {
                            return false;
                        } else {
                            if (imgIconOldHave) {
                                Swal.fire({
                                    title: "ไม่สามารถเพิ่ม icon ได้",
                                    text: "กรุณาลบ icon เก่าก่อน",
                                    icon: 'error'
                                });
                                return false;
                            }
                            else {
                                imgIconArrayEdit.push(f);
                                // formData.append('productImages', f);
                                var reader = new FileReader();
                                reader.onload = function (e) {
                                    var html = "<div class='upload_edit_img-box_icon'><div style='background-image: url(" + e.target.result + ")' data-number='" + $(".upload_edit_img-close_icon").length + "' data-file='" + f.name + "' class='img-bg'><div class='upload_edit_img-close_icon'></div></div></div>";
                                    editImgWrap.append(html);
                                    iterator++;
                                }
                                reader.readAsDataURL(f);
                                document.getElementById('upload_edit_inputfile_icon').value = "";
                                stopFlag = true;
                            }
                        }
                    }
                });
            });
        }
    });

    $('body').on('click', ".upload_edit_img-close_icon", function (e) {
        var file = $(this).parent().data("file");
        if (file.includes('oldicon-')) {
            imgIconOldHave = false;
        }
        for (var i = 0; i < imgIconArrayEdit.length; i++) {
            if (imgIconArrayEdit[i].name === file) {
                imgIconArrayEdit.splice(i, 1);
                break;
            }
        }
        $(this).parent().parent().remove();
    });
}