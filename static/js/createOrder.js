let CurrentOrderId;
let computerSelect = myForm.computer;
let monitorSelect = myForm.monitor;
let CurrentComputerId;
let CurrentMonitorId;
function GetCurrentOrder() {
    $.ajax({
        url: "/api/currentOrder",
        type: "GET",
        contentType: "application/json",
        success: function (currentOrder) {
            CurrentOrderId=currentOrder;
        }
    });
}
function GetComputers() {
    $.ajax({
        url: "/api/computers",
        type: "GET",
        contentType: "application/json",
        success: function (computers) {
            var rows = "";
            $.each(computers, function (index, user) {
                // добавляем полученные элементы в таблицу
                rows += options(user);
            })
            $("#computer").append(rows);
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
                rows += options(user);
            });
            $("#monitor").append(rows);
        }
    });
}
function CreateSet(OrderId,ComputerId,MonitorId,monitor,computer) {
    $.ajax({
        url: "api/createSet",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            order: OrderId,
            computer: ComputerId,
            monitor:MonitorId
        }),
        success: function (user) {

            //reset();
            $("table tbody").append(row(monitor,computer));
        }
    })
}
var row = function (monitor,computer) {
    let data="";
    data+="<tr><td>" + monitor + "</td>";
    data+="<td>" + computer + "</td></tr>";
    return data;
}
var options = function (employee) {
    let data="";
    data+="<option value='" + employee[0] + "'>" + employee[1] + "</option>";
    return data;
};
function changeComputer(){
    let computer = document.querySelector("#currentComp");
    let selectedOption = computerSelect.options[computerSelect.selectedIndex];
    computer.value = selectedOption.text;
    CurrentComputerId=selectedOption.value;
    if(document.querySelector("#currentMon").value!=""){
        $('#save').removeAttr('disabled');
    }
}
function changeMonitor(){
    let monitor = document.querySelector("#currentMon");
    let selectedOption = monitorSelect.options[monitorSelect.selectedIndex];
    monitor.value = selectedOption.text;
    CurrentMonitorId = selectedOption.value;
    if(document.querySelector("#currentComp").value!=""){
        $('#save').removeAttr('disabled');
    }
}
function DeleteOrder(id) {
    $.ajax({
        url: "api/orders/"+id,
        contentType: "application/json",
        method: "DELETE",
        success: function (user) {
            console.log(user);
            window.location="/shop";
        }
    })
}
computerSelect.addEventListener("change", changeComputer);
monitorSelect.addEventListener("change", changeMonitor);

$("#save").click(function () {
    CreateSet(CurrentOrderId,CurrentComputerId,CurrentMonitorId,
        monitorSelect.options[monitorSelect.selectedIndex].text,
        computerSelect.options[computerSelect.selectedIndex].text);
});

$("#create").click(function () {
    window.location="/shop";
});
$("#cancel").click(function () {
    DeleteOrder(CurrentOrderId);
});
// загрузка текущего заказа
GetCurrentOrder();
GetMonitors();
GetComputers();
