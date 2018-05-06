let div=document.querySelector("#incorrect");
// Получение одного пользователя
function GetUser(login, password,name,surname,num) {
    $.ajax({
        url: "/api/registration/?"+login,
        type: "GET",
        contentType: "application/json",
        success: function (exist) {
            console.log(exist);
            if(exist){ div.innerHTML=`Логин уже используется`;}
            else {CreateUser(login, password,name,surname,num)}
        }
    });
}
// Добавление пользователя
function CreateUser(login,password,name,surname,num) {
    $.ajax({
        url: "api/users",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            login: login,
            password: password,
            name: name,
            surname:surname,
            num:num
        }),
        success: function (res) {
            window.location="/";
        }
    })
}

//отправка формы
$("#button").click(function (e) {
    $('input[required]').addClass('req');
    e.preventDefault();
    let login = document.querySelector("#login").value;
    let password = document.querySelector("#password").value;
    let name = document.querySelector("#name").value;
    let surname = document.querySelector("#surname").value;
    let num = document.querySelector("#num").value;
    if(login&&password&&name&&surname&&num){
        GetUser(login, password,name,surname,num);
    }
});