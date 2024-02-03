let base64String = "";
const outputFormat = 'jpg'
function imageUploaded() {
    var file = document.getElementById("productImage").files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var img = document.createElement("img");
        var imgReduce = document.createElement("imgReduce");
        img.onload = function (event) {
            // resizeFile(img, imgReSize)
            base64String = compressFile(img, imgReduce).replace("data:", "").replace(/^.+,/, "");
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
}

function resizeFile(loadedData, preview) {
    console.log('Image resizing:')
    console.log(`Resolution: ${loadedData.width}x${loadedData.height}`)
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(loadedData.width / 2)
    canvas.height = Math.round(loadedData.height / 2)

    preview.appendChild(canvas)
    // document.body.appendChild(canvas)

    const ctx = canvas.getContext('2d')
    ctx.drawImage(loadedData, 0, 0, canvas.width, canvas.height)
    console.log(`New resolution: ${canvas.width}x${canvas.height}`)
    console.log('---')
}

function compressFile(loadedData, preview) {
    // console.log('Image compressing:')
    // console.log(`width: ${loadedData.width} | height: ${loadedData.height}`)

    const quality = parseInt(30)
    // console.log(`Quality >> ${quality}`)

    const timeStart = performance.now()
    // console.log('process started...')

    const mimeType = typeof outputFormat !== 'undefined' && outputFormat === 'png' ? 'image/png' : 'image/jpeg'

    const canvas = document.createElement('canvas')
    canvas.width = Math.round(loadedData.width / 2)
    canvas.height = Math.round(loadedData.height / 2)

    const ctx = canvas.getContext('2d').drawImage(loadedData, 0, 0, canvas.width, canvas.height)
    const newImageData = canvas.toDataURL(mimeType, quality / 100)
    const img = new Image()
    img.src = newImageData
    preview.src = img.src
    preview.onload = () => { }
    return newImageData
}

function editImageUploaded() {
    var file = document.getElementById("editProductImage").files[0];
    var reader = new FileReader();
    reader.onload = function (e) {
        var img = document.createElement("img");
        var imgReduce = document.createElement("imgReduce");
        img.onload = function (event) {
            // resizeFile(img, imgReSize)
            base64String = compressFile(img, imgReduce).replace("data:", "").replace(/^.+,/, "");
            // console.log(base64String);
        }
        img.src = e.target.result;
    }
    reader.readAsDataURL(file);
}




/// new 
// let stopFlag = false;
function createProduct() {
    var productName = document.getElementById("productName").value;
    var productDetail = document.getElementById("productDetail").value;
    var productPrice = document.getElementById("productPrice").value;
    var categoryId = document.getElementById("category").value;
    var productQty = document.getElementById("productQty").value;
    var productUnit = document.getElementById("productUnit").value;
    var isNumeric = !isNaN(parseFloat(productPrice)) && isFinite(productPrice);

    if (productName === "") {
        Swal.fire(
            'ProductName',
            'ProductName cannot be empty',
            'error'
        );
        return
    }
    if (productPrice === "") {
        Swal.fire(
            'ProductPrice',
            'ProductPrice cannot be empty',
            'error'
        );
        return
    }
    if (!isNumeric) {
        Swal.fire(
            'ProductPrice',
            'The value is numeric.',
            'error'
        );
        return
    }
    if (productQty === "") {
        Swal.fire(
            'Product Qty',
            'productQty cannot be empty',
            'error'
        );
        return
    }
    if (categoryId === "เลือกประเภท") {
        Swal.fire(
            'Category',
            'Please Select Category',
            'error'
        );
        return
    }


    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    // var userId = getCookie('userId');
    // console.log(imgArray);

    var formData = new FormData();
    for (var i = 0; i < imgArray.length; i++) {
        formData.append("productImages", imgArray[i]);
    }
    formData.append("productName", productName);
    formData.append("productDetail", productDetail);
    formData.append("price", productPrice);
    formData.append("categoryId", categoryId);
    formData.append("createDate", today);
    formData.append("qty", productQty);
    formData.append("unit", productUnit);
    var requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow'
    };
    fetch("/api/createProduct", requestOptions).then(response => response.json()).then((json) => {
        if (json.success) {
            Swal.fire({
                title: 'เพิ่มรายสินค้าเรียบร้อย',
                icon: 'success',
                showconfirmbutton: true,
                allowoutsideclick: false,
                allowescapekey: false
            }).then(function () {
                //console.log(json.data);
                window.location.href = "/productmanage";
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

function createCategory() {
    var categoryName = document.getElementById("categoryName").value;
    var seqno = document.getElementById("seqno").value;
    var date = new Date();
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear();
    if (month < 10) month = "0" + month;
    if (day < 10) day = "0" + day;
    var today = year + "-" + month + "-" + day;
    // var userId = getCookie('userId');

    var formData = new FormData();
    for (var i = 0; i < imgIconArray.length; i++) {
        formData.append("categoryIcon", imgIconArray[i]);
    }
    formData.append("categoryName", categoryName);
    formData.append("createDate", today);
    // formData.append("createBy", userId);
    formData.append("seqno", seqno);
    var requestOptions = {
        method: 'POST',
        body: formData,
        redirect: 'follow'
    };

    // var json = JSON.stringify({
    //     "categoryName": categoryName,
    //     "createDate": today,
    //     // "createBy": userId
    // });
    fetch("/api/createCategory", requestOptions).then(response => response.json()).then((json) => {
        if (json.success) {
            Swal.fire({
                title: 'เพิ่มประเภทสินค้าเรียบร้อย',
                icon: 'success',
                showconfirmbutton: true,
                allowoutsideclick: false,
                allowescapekey: false
            }).then(function () {
                //console.log(json.data);
                window.location.href = "/productmanage";
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


function delCategory(categoryId) {
    var url = '/api/delCategory?categoryId=' + categoryId;
    Swal.fire({
        title: 'ต้องการลบประเภทสินค้า ?',
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
                        title: 'ลบเรียบร้อย',
                        icon: 'success',
                        showconfirmbutton: true,
                        allowoutsideclick: false,
                        allowescapekey: false
                    }).then(function () {
                        //console.log(json.data);
                        window.location.href = "/productmanage";
                    });
                }
                else {
                    Swal.fire(
                        'ลบสินค้าไม่สำเร็จ',
                        '',
                        'error'
                    );
                }
            });
        }
    })
}


jQuery(document).ready(function () {
    ImgUpload();
    ImgIconUpload();
});
var imgArray = [];
var imgArrayEdit = [];
var imgIconArray = [];
var imgIconArrayEdit = [];
function ImgUpload() {
    var imgWrap = "";
    $('.upload__inputfile').each(function () {
        $(this).on('change', function (e) {
            imgWrap = $(this).closest('.upload__box').find('.upload__img-wrap');
            var maxLength = $(this).attr('data-max_length');

            var files = e.target.files;
            var filesArr = Array.prototype.slice.call(files);
            var iterator = 0;
            filesArr.forEach(function (f, index) {
                if (!f.type.match('image.*')) {
                    return;
                }

                if (imgArray.length > maxLength) {
                    return false
                } else {
                    var len = 0;
                    for (var i = 0; i < imgArray.length; i++) {
                        if (imgArray[i] !== undefined) {
                            len++;
                        }
                    }
                    if (len > maxLength) {
                        return false;
                    } else {
                        imgArray.push(f);
                        // console.log(f)
                        // formData.append('productImages', f);
                        var reader = new FileReader();
                        reader.onload = function (e) {
                            var html = "<div class='upload__img-box'><div style='background-image: url(" + e.target.result + ")' data-number='" + $(".upload__img-close").length + "' data-file='" + f.name + "' class='img-bg'><div class='upload__img-close'></div></div></div>";
                            imgWrap.append(html);
                            iterator++;
                        }
                        reader.readAsDataURL(f);
                    }
                }
            });
        });
    });

    $('body').on('click', ".upload__img-close", function (e) {
        var file = $(this).parent().data("file");
        for (var i = 0; i < imgArray.length; i++) {
            if (imgArray[i].name === file) {
                imgArray.splice(i, 1);
                break;
            }
        }
        $(this).parent().parent().remove();
    });
}

function getProduct(productId) {
    EditImgUpload();
    var url = '/api/getProduct?productId=' + productId;
    fetch(url).then(response => response.json()).then((json) => {
        if (json.success) {
            document.getElementById("editCategory").value = json.data.categoryId;
            document.getElementById("editProductName").value = json.data.productName;
            document.getElementById("editProductPrice").value = json.data.price;
            document.getElementById("editProductDetail").value = json.data.productDetail;
            document.getElementById("editProductQty").value = json.data.qty;
            document.getElementById("editProductUnit").value = json.data.unit;
            // document.getElementById("showProductImage").src = 'data:image/png;base64,' + json.data.imageBase64;
            loadEditImages(json.data.images);
            document.getElementById("btnEditProduct").setAttribute('onclick', 'editProduct(' + productId + ')');
            $("#editProductModal").modal("show");
        }
        else {
            Swal.fire(
                'ไม่พบสินค้า',
                '',
                'error'
            );
        }
    });
}

function loadEditImages(imagesfile) {
    const images = imagesfile;
    imgArrayEdit = [];
    var imgWraps = document.querySelectorAll('.upload_edit_img-wrap');
    imgWraps.forEach(imgWrap => {
        imgWrap.innerHTML = '';
    });
    images.forEach(image => {
        imgArrayEdit.push(image);
        var html = "<div class='upload_edit_img-box'><div style='background-image: url(" + image.base64Image + ")' onclick='editImageClose(" + image.prodImgId + ")' data-number='" + $(".upload_edit_img-close").length + "' data-file='" + image.prodImgId + "' class='img-bg'><div class='upload_edit_img-close'></div></div></div>";
        imgWraps.forEach(imgWrap => {
            imgWrap.innerHTML += html;
        });
        // fetch('/images/' + image.imagePath).then(response => response.blob())
        //     .then(blob => {
        //         var reader = new FileReader();
        //         reader.readAsDataURL(blob);
        //         reader.onloadend = function () {

        //         }
        //     });
    });
}
function editImageClose(prodImgId) {
    // var file = $(".upload_edit_img-close");
    for (var i = 0; i < imgArrayEdit.length; i++) {
        if (imgArrayEdit[i].prodImgId === prodImgId) {
            imgArrayEdit.splice(i, 1);
            break;
        }
    }
    // console.log(imgArrayEdit);
    // $(".upload_edit_img-close").parent().parent().remove();
}

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
function EditImgUpload() {
    var editImgWrap = "";
    var stopFlag = false;
    document.getElementById('upload_edit_inputfile').value = "";
    $('.upload_edit_inputfile').each(function () {
        if (stopFlag) {
            return false;
        }
        else {
            // console.log($(this));
            $(this).on('change', function (e) {
                editImgWrap = $(this).closest('.upload_edit_box').find('.upload_edit_img-wrap');
                var maxLength = $(this).attr('data-max_length');
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
                    if (imgArrayEdit.length > maxLength) {
                        return false
                    } else {
                        var len = 0;
                        for (var i = 0; i < imgArrayEdit.length; i++) {
                            if (imgArrayEdit[i] !== undefined) {
                                len++;
                            }
                        }
                        if (len > maxLength) {
                            return false;
                        } else {
                            imgArrayEdit.push(f);
                            console.log(imgArrayEdit);
                            // formData.append('productImages', f);
                            var reader = new FileReader();

                            reader.onload = function (e) {
                                var html = "<div class='upload_edit_img-box'><div style='background-image: url(" + e.target.result + ")' data-number='" + $(".upload_edit_img-close").length + "' data-file='" + f.name + "' class='img-bg'><div class='upload_edit_img-close'></div></div></div>";
                                editImgWrap.append(html);
                                iterator++;
                            }
                            reader.readAsDataURL(f);
                            document.getElementById('upload_edit_inputfile').value = "";
                            stopFlag = true;
                        }
                    }
                });
            });
        }
    });

    $('body').on('click', ".upload_edit_img-close", function (e) {
        var file = $(this).parent().data("file");
        for (var i = 0; i < imgArrayEdit.length; i++) {
            if (imgArrayEdit[i].name === file) {
                imgArrayEdit.splice(i, 1);
                break;
            }
        }
        $(this).parent().parent().remove();
    });
}


function editProduct(productId) {
    var url = '/api/editProduct';
    // var date = new Date();
    // var day = date.getDate();
    // var month = date.getMonth() + 1;
    // var year = date.getFullYear();
    // if (month < 10) month = "0" + month;
    // if (day < 10) day = "0" + day;
    // var today = year + "-" + month + "-" + day;
    var productName = document.getElementById("editProductName").value;
    var productDetail = document.getElementById("editProductDetail").value;
    var productPrice = document.getElementById("editProductPrice").value;
    var categoryId = document.getElementById("editCategory").value;
    var productQty = document.getElementById("editProductQty").value;
    var productUnit = document.getElementById("editProductUnit").value;
    var formDataEdit = new FormData();
    var editImages = [];
    for (var i = 0; i < imgArrayEdit.length; i++) {
        if (typeof imgArrayEdit[i] === 'object' && !(imgArrayEdit[i] instanceof File)) {
            editImages.push(imgArrayEdit[i]);
        } else if (imgArrayEdit[i] instanceof File) {
            formDataEdit.append("productImages", imgArrayEdit[i]);
        } else {
            console.log("Other:", imgArrayEdit[i]);
        }
    }
    formDataEdit.append("editImages", JSON.stringify(editImages));
    formDataEdit.append("productName", productName);
    formDataEdit.append("productDetail", productDetail);
    formDataEdit.append("price", productPrice);
    formDataEdit.append("categoryId", categoryId);
    // formDataEdit.append("createDate", today);
    formDataEdit.append("qty", productQty);
    formDataEdit.append("unit", productUnit);
    formDataEdit.append("productId", productId);

    var requestOptions = {
        method: 'PUT',
        body: formDataEdit,
        redirect: 'follow'
    };

    fetch(url, requestOptions).then(response => response.json()).then((json) => {
        if (json.success) {
            Swal.fire({
                title: 'แก้ไขรายสินค้ารียบร้อย',
                icon: 'success',
                showconfirmbutton: true,
                allowoutsideclick: false,
                allowescapekey: false
            }).then(function () {
                window.location.href = "/productmanage";
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


function delProduct(productId) {
    var url = '/api/delProduct?productId=' + productId;
    Swal.fire({
        title: 'ต้องการลบสินค้า ?',
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
                        title: 'ลบสินค้าเรียบร้อย',
                        icon: 'success',
                        showconfirmbutton: true,
                        allowoutsideclick: false,
                        allowescapekey: false
                    }).then(function () {
                        //console.log(json.data);
                        window.location.href = "/productmanage";
                    });
                }
                else {
                    Swal.fire(
                        'ลบสินค้าไม่สำเร็จ',
                        '',
                        'error'
                    );
                }
            });
        }
    })
}


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
                        // console.log(f)
                        // formData.append('productImages', f);
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

function getCategory(categoryId) {
    EditIconUpload()
    var url = '/api/getCategoryId?categoryId=' + categoryId;
    fetch(url).then(response => response.json()).then((data) => {
        debugger;
        if (data.success) {
            document.getElementById("editSeqno").value = data.data.seqno;
            document.getElementById("editCategoryName").value = data.data.categoryName;
            // document.getElementById("showProductImage").src = 'data:image/png;base64,' + json.data.imageBase64;
            var imgWraps = document.querySelectorAll('.upload_edit_img-wrap_icon');
            imgWraps.forEach(imgWrap => {
                imgWrap.innerHTML = '';
            });
            if (data.data.thumbnail != null) {
                var html = "<div class='upload_edit_img-box_icon'><div style='background-image: url(data:image/png;base64," + data.data.thumbnail + ")' onclick='editIconClose(" + data.data.categoryId + ")' data-number='" + $(".upload_edit_img-close_icon").length + "' data-file='oldicon-" + categoryId + "' class='img-bg'><div class='upload_edit_img-close_icon'></div></div></div>";
                imgWraps.forEach(imgWrap => {
                    imgWrap.innerHTML += html;
                });
                imgIconOldHave = true;
            }
            else {
                imgIconOldHave = false;
            }

            document.getElementById("btnEditCategory").setAttribute('onclick', 'editCategory(' + categoryId + ')');
            $("#editCategory").modal("show");
        }
        else {
            Swal.fire(
                'ไม่พบรายการ',
                '',
                'error'
            );
        }
    })
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

function editCategory(categoryId) {
    var url = "/api/editCategory";
    var categoryName = document.getElementById("editCategoryName").value;
    var seqno = document.getElementById("editSeqno").value;
    debugger;
    var formData = new FormData();
    for (var i = 0; i < imgIconArrayEdit.length; i++) {
        formData.append("categoryIcon", imgIconArrayEdit[i]);
    }
    formData.append("categoryId", categoryId);
    formData.append("categoryName", categoryName);
    formData.append("seqno", seqno);
    var requestOptions = {
        method: 'PUT',
        body: formData,
        redirect: 'follow'
    };
    fetch(url, requestOptions).then(response => response.json()).then((json) => {
        if (json.success) {
            Swal.fire({
                title: 'แก้ไขประเภทสินค้าเรียบร้อย',
                icon: 'success',
                showconfirmbutton: true,
                allowoutsideclick: false,
                allowescapekey: false
            }).then(function () {
                //console.log(json.data);
                window.location.href = "/productmanage";
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