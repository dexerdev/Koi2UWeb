function delivered(deliveryId) {
    var url = '/api/delivered';
    var json = JSON.stringify({
        "deliveryId": deliveryId
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
                title: 'จัดส่งเรียบร้อย',
                icon: 'success',
                showconfirmbutton: true,
                allowoutsideclick: false,
                allowescapekey: false
            }).then(function () {
                //console.log(json.data);
                window.location.href = "/deliverymanage";
            });
        }
        else {
            Swal.fire(
                'จัดส่งไม่สำเร็จ',
                '',
                'error'
            );
        }
    });
}

function backwardDeliver(deliveryId) {
    var url = '/api/backwardDeliver';

    var json = JSON.stringify({
        "deliveryId": deliveryId
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
                title: 'ย้อนกลับการจัดส่งเรียบร้อย',
                icon: 'success',
                showconfirmbutton: true,
                allowoutsideclick: false,
                allowescapekey: false
            }).then(function () {
                //console.log(json.data);
                window.location.href = "/deliverymanage";
            });
        }
        else {
            Swal.fire(
                'ย้อนกลับการจัดส่งไม่สำเร็จ',
                '',
                'error'
            );
        }
    });
}


function getTracking(deliveryId) {
    var url = "/api/getDeliveryId?deliveryId=" + deliveryId
    fetch(url).then(response => response.json()).then((json) => {
        if (json.success) {
            document.getElementById('TrackingNo').value = json.data.trackingNo;
            document.getElementById('TrackComp').value = json.data.trackComp;
            document.getElementById('TrackURL').value = json.data.trackURL;
            document.getElementById('btnUpdateTrack').setAttribute('onclick', "createTracking("+ deliveryId +")")
            $("#addTracking").modal("show");
        }
        else {
            Swal.fire(
                'เรียกข้อมูลไม่สำเร็จ',
                '',
                'error'
            );
        }
    });
}
function createTracking(deliveryId){
    var url = '/api/updateTracking';
    var trackingNo = document.getElementById('TrackingNo').value ;
    var trackComp = document.getElementById('TrackComp').value ;
    var trackURL = document.getElementById('TrackURL').value ;
    var json = JSON.stringify({
        "deliveryId": deliveryId,
        "trackingNo":trackingNo,
        "trackComp":trackComp,
        "trackURL":trackURL
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
                title: 'อัปเดทเลขพัสดุเรียบร้อย',
                icon: 'success',
                showconfirmbutton: true,
                allowoutsideclick: false,
                allowescapekey: false
            }).then(function () {
                //console.log(json.data);
                window.location.href = "/deliverymanage";
            });
        }
        else {
            Swal.fire(
                'อัปเดทเลขพัสดุไม่สำเร็จ',
                '',
                'error'
            );
        }
    });
}