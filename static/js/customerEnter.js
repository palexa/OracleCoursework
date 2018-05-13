$("#submit_button").click(function () {
    let login=$("#login").val();
    let password=$("#password").val();
    $.ajax({
        url:"Employee",
        contentType:"application/json",
        type:"POST",
        data:JSON.stringify({
            login: login,
            password: password
        }),
        success:function (status) {
            if(status){window.location="/employee/cabinet"}
            else document.querySelector("#incorrect").innerHTML="Неверно";
        }

    })
});