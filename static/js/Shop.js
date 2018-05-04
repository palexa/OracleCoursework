
function GetUsers() {
    $.ajax({
        url: "/api/computers",
        type: "GET",
        contentType: "application/json",
        success: function (computers) {
            var rows = "";
            $.each(computers, function (index, user) {
                // добавляем полученные элементы в таблицу
                rows += row(user);
            })
            $("table tbody").append(rows);
        }
    });
}

var row = function (computer) {
    let data="";
    data+="<tr data-rowid='" + computer[0] + "'><td>" + computer[0] + "</td>";
    for(let i=1;i<computer.length-1;i++){
        data+="<td>" + computer[i] + "</td>";
    }
    data+="<td><a class='editLink' data-id='" + computer[0] + "'>Изменить</a> | " +
        "<a class='removeLink' data-id='" + computer[0] + "'>Удалить</a></td></tr>";
    return data;
}

$("form").submit(function (e) {
    e.preventDefault();
});
$("#profile_button").click(function () {
    console.log("Profile");
    window.location="profile";
});
GetUsers();