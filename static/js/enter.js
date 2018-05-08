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

$("form").submit(function (e) {
    e.preventDefault();
    let login = this.elements["login"].value;
    let password = this.elements["password"].value;
    LogIn(login, password);
});