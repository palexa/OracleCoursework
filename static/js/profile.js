function GetUsers() {
    $.ajax({
        url: "/api/profileData",
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
    for(let i=1;i<computer.length;i++){
        data+="<td>" + computer[i] + "</td>";
    }
    return data;
}

GetUsers();