function delivered(deliveryId){
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