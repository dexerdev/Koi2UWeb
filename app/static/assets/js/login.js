function checkLogin(){
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    var data = JSON.stringify({
        "username": username,
        "password": password
    });
    fetch("/api/checkLogin", {
        method: 'POST',
        body: data,
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then(response => response.json()).then((json) => {
        if (json.success) {
            Swal.fire({
                title: 'ยินดีต้อนรับเข้าสู่ระบบ',
                icon: 'success',
                showconfirmbutton: true,
                allowoutsideclick: false,
                allowescapekey: false
            }).then(function () {
                document.cookie = "username=" + json.data.username;
                document.cookie = "firstname=" + json.data.firstname;
                document.cookie = "lastname=" + json.data.lastname;
                document.cookie = "roleCode=" + json.data.roleCode;
                document.cookie = "userId=" + json.data.userId;
                if (json.data.roleCode == "ADMIN"){
                    window.location.href = "/productmanage";
                }
                else{
                    window.location.href = "/";
                }
            });
        }
        else {
            Swal.fire(
                'เข้าสู้ระบบผิดพลาด',
                json.message,
                'error'
            );
        }
    });
}

