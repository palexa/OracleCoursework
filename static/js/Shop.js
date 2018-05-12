
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
                rows += options(user);
            });
            $("#language").append(rows);
        }
    });
}

function NewOrder(employeeId) {
    $.ajax({
        url: "/api/newOrder/?"+employeeId,
        type: "GET",
        contentType: "application/json",
        success: function () {
            window.location="/CreateOrder";
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
};

var options = function (employee) {
    let data="";
    data+="<option value='" + employee[0] + "'>" + employee[1] + "</option>";
    return data;
};

$("form").submit(function (e) {
    e.preventDefault();
});

$("#create").click(function () {
NewOrder(selectedId);
});

let languagesSelect = language;
let selectedId=0;
function changeOption(){
    let selection = document.getElementById("selection");
    let selectedOption = languagesSelect.options[languagesSelect.selectedIndex];
    selection.textContent = "Продавец: " + selectedOption.text;
    $('#create').removeAttr('disabled');
    selectedId=selectedOption.value;
}
languagesSelect.addEventListener("change", changeOption);

GetComputers();
GetMonitors();
GetEmployees();