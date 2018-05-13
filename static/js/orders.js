function GetMyOrders() {
    $.ajax({
        url: "/api/clientOrders",
        type: "GET",
        contentType: "application/json",
        success: function (Orders) {
            let rows = "";
            $.each(Orders, function (index, order) {
                // добавляем полученные элементы в таблицу
                rows += OrderRow(order);
            });
            $("#orders").append(rows);
        }
    });
}

let OrderRow = function (order) {
    let data="";
    data+="<tr>"+"<td>" + order[0] + "</td>"
        +"<td>" + order[1] + "</td>"
        +"<td>" + order[2] + "</td>";

    return data;
};

GetMyOrders();