
function GetComputers() {
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
            $("#computers").append(rows);
        }
    });
}

function GetMonitors() {
    $.ajax({
        url: "/api/monitors",
        type: "GET",
        contentType: "application/json",
        success: function (monitors) {
            var rows = "";
            $.each(monitors, function (index, user) {
                // добавляем полученные элементы в таблицу
                rows += row(user);
            });
            $("#monitors").append(rows);
        }
    });
}
function GetEmployees() {
    $.ajax({
        url: "/api/employees",
        type: "GET",
        contentType: "application/json",
        success: function (employees) {
            var rows = "";
            $.each(employees, function (index, user) {
                // добавляем полученные элементы в таблицу
                rows += row2(user);
            });
            $("#language").append(rows);
        }
    });
}

var row = function (computer) {
    let data="";
    data+="<tr data-rowid='" + computer[0] + "'><td>" + computer[0] + "</td>";
    for(let i=1;i<computer.length;i++){
        data+="<td>" + computer[i] + "</td>";
    }
    return data;
}

var row2 = function (computer) {
    let data="";
    data+="<option value='" + computer[0] + "'>" + computer[1] + "</option>";
    return data;
}

$("form").submit(function (e) {
    e.preventDefault();
});
$("#profile_button").click(function () {
    console.log("Profile");
    window.location="profile";
});
GetComputers();
GetMonitors();
GetEmployees();