function getSlip(payId) {
    var url = '/api/getSlipImg?paymentId=' + payId;
    fetch(url).then(response => response.json()).then((json) => {
        if (json.success) {
            document.getElementById("slipImage").src = 'data:image/png;base64,' + json.data.imgSlipBase64;
            if (json.data.status == "CHECKING") {
                document.getElementById("appovePayment").style.visibility = 'visible';
                document.getElementById("appovePayment").setAttribute('onclick', 'appovePayment(' + payId + ')');
            }
            else {
                document.getElementById("appovePayment").style.visibility = 'hidden';
            }
            $("#slip-img").modal("show");
        }
        else {
            Swal.fire(
                'ไม่พบพนักงาน',
                '',
                'error'
            );
        }
    });
}
function openOriginalImage() {
    var base64ImageData = document.getElementById('slipImage').src;
    var newWindow = window.open();
    newWindow.document.write('<img src="' + base64ImageData + '">');
}

function cancelPayment(payId) {
    var url = '/api/cancelPayment?paymentId=' + payId;
    Swal.fire({
        title: 'ต้องการยกเลิกชำระเงิน ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
    }).then((result) => {
        if (result.isConfirmed) {
            fetch(url, {
                method: 'PUT',
                headers: {
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then(response => response.json()).then((json) => {
                if (json.success) {
                    Swal.fire({
                        title: 'ยกเลิกชำระเงินเรียบร้อย',
                        icon: 'success',
                        showconfirmbutton: true,
                        allowoutsideclick: false,
                        allowescapekey: false
                    }).then(function () {
                        //console.log(json.data);
                        window.location.href = "/billmanage";
                    });
                }
                else {
                    Swal.fire(
                        'ยกเลิกชำระเงินไม่สำเร็จ',
                        json.message,
                        'error'
                    );
                }
            });
        }
    })
}


function appovePayment(payId) {
    var jsonData = JSON.stringify({
        "paymentId": payId,
    });
    var url = '/api/recievedPayment';
    fetch(url, {
        method: 'POST',
        body: jsonData,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(response => response.json()).then((json) => {
        if (json.success) {
            Swal.fire({
                title: 'อนุมัติชำระเงินเรียบร้อย',
                icon: 'success',
                showconfirmbutton: true,
                allowoutsideclick: false,
                allowescapekey: false
            }).then(function () {
                window.location.href = "/billmanage";
            });
        }
        else {
            Swal.fire(
                'อนุมัติชำระเงินผิดพลาด',
                json.message,
                'error'
            );
        }
    });
}