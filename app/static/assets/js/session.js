$(document).ready(function () {
    fetch('/checkSession').then(response => response.json()).then((json) => {
        if (!json.result){
            window.location.href = "/login";
        }
    });
});