let div=document.querySelector("#incorrect");
function CreateUser(login, password) {
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
                //console.log(res);
                //window.location="/";
                div.innerHTML=`Неверный логин или пароль`;
            }
        }
    })
}
function LogIn(login,password) {
    $.ajax({
        url: "api/login",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            login: login,
            password: password,
        }),
        success: function (res) {
            console.log(res);

        }
    })
}

$("form").submit(function (e) {
    e.preventDefault();
    let login = this.elements["login"].value;
    let password = this.elements["password"].value;
    CreateUser(login, password);
    //LogIn(login, password);
});