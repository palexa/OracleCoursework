document.querySelector(".Home").style.display="none";
document.querySelector(".Services").style.display="none";
let employeesSelect = employees;
let manufacturesSelect = manufactures;
let chiefId=0;
let manufactureId=0;
// Получение одного пользователя
function GetComputer(computer_name,processor,video,disk,ram,price) {
    $.ajax({
        url: "/api/createComp/?"+computer_name,
        type: "GET",
        contentType: "application/json",
        success: function (exist) {
            console.log(exist);
            if(exist){
                showMessage("existComputer","Такой компьютер уже есть");
            }
            else {CreateComputer(computer_name,processor,video,disk,ram,price)}
        }
    });
}
function GetMonitor(name) {
    $.ajax({
        url: "/api/createMonitor/?"+name,
        type: "GET",
        contentType: "application/json",
        success: function (exist) {
            console.log(exist);
            if(exist){
                showMessage("existComputer","Такой монитор уже есть");
            }
            else {CreateMonitor(name)}
        }
    });
}
// Добавление пользователя
function CreateComputer(computer_name,processor,video,disk,ram,price) {
    $.ajax({
        url: "api/computers",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            name: computer_name,
            processor: processor,
            video: video,
            disk:disk,
            ram:ram,
            price:price,
            manufactureId:manufactureId
        }),
        success: function () {
            showMessage("add","Компьютер добавлен");
        }
    })
}
function CreateMonitor(name) {
    $.ajax({
        url: "api/monitors",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            name: name
        }),
        success: function () {
            showMessage("add","Монитор добавлен");
        }
    })
}
function CreateEmployee(info) {

    $.ajax({
        url: "api/employees",
        contentType: "application/json",
        method: "POST",
        data: JSON.stringify({
            name_surname: info,
            chief_id:chiefId
        }),
        success: function () {
            showMessage("add","Работник добавлен");
        }
    })
}
function showMessage(id,message) {
    document.querySelector("#text").innerHTML=message;
    $("#mask").fadeIn(500,function () {
        $("#add").fadeIn(1000,function () {
            $("#add").fadeOut(3000,function () {
                $("#mask").fadeOut(250);
            });

        })
    });


}
//отправка формы
$("#button1").click(function (e) {
    $('#content1 input[required]').addClass('req');
    e.preventDefault();
    let computer_name = document.querySelector("#computer_name").value;
    let processor = document.querySelector("#processor").value;
    let video = document.querySelector("#video").value;
    let disk = document.querySelector("#disk").value;
    let ram = document.querySelector("#ram").value;
    let price = document.querySelector("#price").value;
    if(computer_name&&processor&&video&&disk&&ram&&price&&manufactureId){
        $('#content1 input[required]').removeClass('req');
        document.querySelector("#computer_name").value="";
        document.querySelector("#processor").value="";
        document.querySelector("#video").value="";
        document.querySelector("#disk").value="";
        document.querySelector("#ram").value="";
        document.querySelector("#price").value="";
        GetComputer(computer_name, processor,video,disk,ram,price);
    }
});
$("#button2").click(function (e) {
    $('#content2 input[required]').addClass('req');
    let name = document.querySelector("#monitor_name").value;
    if(name){
        $('#content2 input[required]').removeClass('req');
        document.querySelector("#monitor_name").value="";
        GetMonitor(name);
    }
});
$("#button3").click(function (e) {
    $('#content3 input[required]').addClass('req');
    e.preventDefault();
    let info = document.querySelector("#name_surname").value;
    if(info&&chiefId){
        $('#content3 input[required]').removeClass('req');
        $('#content3 input[required]').value="";
        CreateEmployee(info);
    }
});
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
            $("#employees").append(rows);
        }
    });
}
function GetManufactures() {
    $.ajax({
        url: "/api/manufactures",
        type: "GET",
        contentType: "application/json",
        success: function (employees) {
            var rows = "";
            $.each(employees, function (index, user) {
                // добавляем полученные элементы в таблицу
                rows += options(user);
            });
            $("#manufactures").append(rows);
        }
    });
}
let options = function (employee) {
    let data="";
    data+="<option value='" + employee[0] + "'>" + employee[1] + "</option>";
    return data;
};
function chiefOption(){
    let selection = document.getElementById("chief");
    let selectedOption = employeesSelect.options[employeesSelect.selectedIndex];
    selection.value = selectedOption.text;
    chiefId=selectedOption.value;
}
function manufactureOption(){
    let selection = document.getElementById("manufacture");
    let selectedOption = manufacturesSelect.options[manufacturesSelect.selectedIndex];
    selection.value = selectedOption.text;
    manufactureId=selectedOption.value;
}
employeesSelect.addEventListener("change", chiefOption);
manufacturesSelect.addEventListener("change", manufactureOption);
GetManufactures();
GetEmployees();