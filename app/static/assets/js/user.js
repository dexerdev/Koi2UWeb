function getProfile(userId){
    var url = '/api/getUserProfile?userId=' + userId;
    fetch(url).then(response => response.json()).then((json) => {
        if (json.success) {
            document.getElementById("userFirstName").value = json.data.firstName;
            document.getElementById("userLastName").value = json.data.lastName;
            document.getElementById("userTelNo").value = json.data.telNo;
            document.getElementById("userEmail").value = json.data.email;
            var table = document.getElementById("tableAddressProfile");
            var tbody = table.getElementsByTagName("tbody")[0];
            tbody.innerHTML = '';
            for (var i = 0; i < json.data.addressLs.length; i++) {
                var address = json.data.addressLs[i];
                var row = tbody.insertRow(i);
                row.id = 'address-' + address.addressId;
                var seqCell = row.insertCell(0);
                seqCell.className = "text-center";
                seqCell.innerHTML = address.addressSeq;
                var contactNameCell = row.insertCell(1);
                contactNameCell.className = "text-center";
                // contactNameCell.style.whiteSpace = "nowrap";
                contactNameCell.innerHTML = address.contactName;
                var addressCell = row.insertCell(2);
                addressCell.className = "text-center";
                // addressCell.style.whiteSpace = "nowrap";
                addressCell.innerHTML = address.addressText + " " + address.subDistrict + " " + address.district + " " + address.province + " " + address.zipcode;
                var telContactCell = row.insertCell(3);
                telContactCell.className = "text-center";
                // telContactCell.style.whiteSpace = "nowrap";
                telContactCell.innerHTML = address.telNo;
                var defautlFlagCell = row.insertCell(4);
                defautlFlagCell.className = "text-center";
                defautlFlagCell.innerHTML = "<i class=' fas fa-check' style='color:green'></i>";
            }
            // table.style.overflow = "auto";
            $("#Edituser").modal("show");
        }
        else {
            Swal.fire(
                'ไม่พบ user profile',
                '',
                'error'
            );
        }
    });
    
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