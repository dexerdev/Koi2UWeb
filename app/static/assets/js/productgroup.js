function addProductToTable(mode = "add") {
    // get reference to the tables
    var tableProductAll = document.getElementById("tableProductAll");
    if (mode == "add") {
        var tableProductGroupDetail = document.getElementById("tableProductGroupDetail");

    }
    else {
        var tableProductGroupDetail = document.getElementById("tableEditProductGroupDetail");
    }

    // get reference to the tbody of the second table
    var tbody = tableProductGroupDetail.getElementsByTagName("tbody")[0];

    // loop through the rows of the first table
    for (var i = 1; i < tableProductAll.rows.length; i++) {
        var row = tableProductAll.rows[i];
        // check if the checkbox is checked
        if (row.cells[0].querySelector('input[type="checkbox"]').checked) {

            // extract the data from the row
            var imgSrc = row.cells[1].querySelector('img').src;
            var productName = row.cells[2].innerText;
            var categoryName = row.cells[3].innerText;
            var price = row.cells[4].innerText;



            // create a new row in the second table
            // console.log(tableProductGroupDetail);
            var productId = row.cells[0].querySelector('input[type="checkbox"]').id;
            // var tbody = tableProductGroupDetail.querySelector('tbody');
            if (tbody.childElementCount === 0) {
                var newRow = tbody.insertRow();
                newRow.id = 'product-' + productId;
                // insert the data into the new row
                newRow.insertCell().innerHTML = '<img src="' + imgSrc + '" height="30px">';
                newRow.insertCell().innerText = productName;
                newRow.insertCell().innerText = categoryName;
                newRow.insertCell().innerText = price;
                newRow.insertCell().innerHTML = '<button class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>';
            }
            else {
                if (!tableProductGroupDetail.querySelector('#product-' + productId)) {
                    var newRow = tbody.insertRow();
                    newRow.id = 'product-' + productId;
                    // insert the data into the new row
                    newRow.insertCell().innerHTML = '<img src="' + imgSrc + '" height="30px">';
                    newRow.insertCell().innerText = productName;
                    newRow.insertCell().innerText = categoryName;
                    newRow.insertCell().innerText = price;
                    newRow.insertCell().innerHTML = '<button class="btn btn-danger btn-sm"><i class="fa fa-trash"></i></button>';
                }
            }


        }
    }
    $('#addproductAll').modal('hide');
}

$(document).on('click', '#tableProductGroupDetail .btn-danger', function () {
    // get the row that contains the button
    var row = $(this).closest('tr');

    // remove the row from the table
    row.remove();
});


$(document).on('click', '#tableEditProductGroupDetail .btn-danger', function () {
    // get the row that contains the button
    var row = $(this).closest('tr');

    // remove the row from the table
    row.remove();
});

/// new 
let stopFlag = false;
function createProductGroup() {
    debugger;
    var prodGrouptName = document.getElementById("productGroupName").value;
    var activeFlag = document.getElementById("activeFlag").value;
    var tableProductGroupDetail = document.getElementById("tableProductGroupDetail");
    if (activeFlag == "Active") {
        activeFlag = true
    }
    else {
        activeFlag = false
    }

    if (prodGrouptName === "") {
        Swal.fire(
            'Product group name',
            'Product group name cannot be empty',
            'error'
        );
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
    var createDate = today;
    var productIdList = []

    for (var i = 1; i < tableProductGroupDetail.rows.length; i++) {
        var row = tableProductGroupDetail.rows[i];
        var prodId = parseInt(row.id.split("-")[1]);

        productIdList.push(prodId);
    }

    var json = JSON.stringify({
        "prodGrouptName": prodGrouptName,
        "activeFlag": activeFlag,
        "productIdList": productIdList,
        "createDate": createDate
    });
    fetch("/api/createProductGroup", {
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
                window.location.href = "/productgroup";
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
function addProductAll() {
    var modal = document.getElementById("addproductAll"); // assuming your modal has id="myModal"
    modal.style.zIndex = "9999";
    var btnAddProd = document.getElementById("btnAddProductToTable")
    btnAddProd.setAttribute("onclick", "addProductToTable('edit')");
    $("#addproductAll").modal("show");
}
function addproductGroup() {
    var table = document.getElementById("tableProductGroupDetail");
    var tbody = table.getElementsByTagName("tbody")[0];
    // console.log(tbody)
    tbody.innerHTML = '';
    var btnAddProd = document.getElementById("btnAddProductToTable")
    btnAddProd.setAttribute("onclick", "addProductToTable('add')");
    // modal.style.zIndex = "9999"; 
    $("#addproductGroup").modal("show");
}
function getProductGroupId(prodGroupId) {
    var url = '/api/getProductGroupTopId?prodGroupId=' + prodGroupId;
    fetch(url).then(response => response.json()).then((json) => {
        if (json.success) {
            document.getElementById("editProductGroupName").value = json.data.prodGroupName;
            if (json.data.activeFlag) {
                document.getElementById("editActiveFlag").value = "Active";
            }
            else {
                document.getElementById("editActiveFlag").value = "InActive";
            }
            var table = document.getElementById("tableEditProductGroupDetail");
            var tbody = table.getElementsByTagName("tbody")[0];
            tbody.innerHTML = '';
            for (var i = 0; i < json.data.productList.length; i++) {
                var product = json.data.productList[i];
                var row = tbody.insertRow(i);
                row.id = 'product-' + product.productId;
                var imgCell = row.insertCell(0);
                imgCell.innerHTML = "<img src='" + product.base64Image + "' class='img-responsive' style='max-height: 30px;'>";
                var nameCell = row.insertCell(1);
                nameCell.innerHTML = product.productName;
                var categoryCell = row.insertCell(2);
                categoryCell.innerHTML = product.categoryName;
                var priceCell = row.insertCell(3);
                priceCell.innerHTML = product.price;
                var actionCell = row.insertCell(4);
                actionCell.innerHTML = "<button class='btn btn-danger btn-sm'>ลบ</button>";
                // actionCell.innerHTML = "<i class='fas fa-trash-alt text-danger'></i>";

            }
            document.getElementById("btnEditProductGroup").setAttribute('onclick', 'editProductGroup(' + json.data.prodGroupId + ')');
            $("#editProductGroupModal").modal("show");
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

function editProductGroup(prodGroupId) {
    var url = '/api/editProductGroup';

    var prodGrouptName = document.getElementById("editProductGroupName").value;
    var activeFlag = document.getElementById("editActiveFlag").value;
    var tableProductGroupDetail = document.getElementById("tableEditProductGroupDetail");
    if (activeFlag == "Active") {
        activeFlag = true
    }
    else {
        activeFlag = false
    }

    if (prodGrouptName === "") {
        Swal.fire(
            'Product group name',
            'Product group name cannot be empty',
            'error'
        );
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
    var updateDate = today;
    var productIdList = []

    for (var i = 1; i < tableProductGroupDetail.rows.length; i++) {
        var row = tableProductGroupDetail.rows[i];
        var prodId = parseInt(row.id.split("-")[1]);

        productIdList.push(prodId);
    }

    var json = JSON.stringify({
        "prodGroupId": prodGroupId,
        "prodGrouptName": prodGrouptName,
        "activeFlag": activeFlag,
        "productIdList": productIdList,
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
                window.location.href = "/productgroup";
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

function delProductGroupId(prodGroupId) {
    var url = '/api/delProductGroup?prodGroupId=' + prodGroupId;
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
                        title: 'ลบสินค้าเรียบร้อย',
                        icon: 'success',
                        showconfirmbutton: true,
                        allowoutsideclick: false,
                        allowescapekey: false
                    }).then(function () {
                        //console.log(json.data);
                        window.location.href = "/productgroup";
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