fetch('/getCookie').then(response => response.json()).then((json) => {
    if (json.data) {
        var btnLogout = document.getElementById('btnLogout');
        var btnLogin = document.getElementById('btnLogin');
        var btnRegister = document.getElementById('btnRegister');
        btnLogout.style.display = "block";
        btnLogin.style.display = "none";
        btnRegister.style.display = "none";
        console.log('cookie');
    }
});

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    console.log(decodedCookie);
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}