let div=document.querySelector("#incorrect");
function LogIn(login, password) {
    $.ajax({
        url: "api/login",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            login: login,
            password: password
        }),
        success: function (res) {
            console.log(res);
            if(res){
                window.location="/shop";
            }
            else{
                div.innerHTML=`Неверный логин или пароль`;
            }
        }
    })
}


$("#registration_button").click(function (e) {
    e.preventDefault();
    window.location="/Registration";
});
$("#customer_enter").click(function () {
    window.location="/CustomerEnter";
});

$("#submit_button").click(function (e) {
    $('input[required]').addClass('req');
    e.preventDefault();
    let login = document.querySelector("#login").value;
    let password = document.querySelector("#password").value;
    console.log("Login password: "+login+" "+password);
    if(login&&password){
    LogIn(login, password);
    }
});