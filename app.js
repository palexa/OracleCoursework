// var http = require('http');
let express=require("express");
let oracledb = require('oracledb');
let dbConfig = require('./dbconfig.js');
let bodyParser = require("body-parser");
let hbs=require("hbs");
let jsonParser = bodyParser.json();
let app=express();
let userId=0;
let employeeId=0;
let logIn=false;
app.use(express.static(__dirname + "/static"));
hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");


async function insert(insertSql,binds,options) {
    let conn;
    let result;

    try {
        conn = await oracledb.getConnection(dbConfig);
        console.log("Соединение установленно: "+conn);
        result = await conn.execute(insertSql, binds, options);

        console.log("Result is:", result);

    } catch (err) {
        console.error(err);
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
async function select(selectSql,binds,options) {
    let conn;
    let result;

    try {
        conn = await oracledb.getConnection(dbConfig);

        //await conn.execute(truncateSql);
        console.log("Has connect!");
        result = await conn.execute(selectSql, binds,options);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
async function selectAll(selectSql) {
    let conn;
    let result;

    try {
        conn = await oracledb.getConnection(dbConfig);

        //await conn.execute(truncateSql);
        console.log("Has connect!");
        result = await conn.execute(selectSql);
        return result;
    } catch (err) {
        console.error(err);
    } finally {
        if (conn) {
            try {
                await conn.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
}
app.get("/profile",function (request,response) {
    response.render("profile.hbs");
});
app.get("/orders",function (request,response) {
    response.render("Orders.hbs");
});
app.get("/api/profileData",function (request,response) {
    let SQLselect='SELECT name,surname,login,phone FROM client where Client_Id=(:userId)';
    let binds =
        { userId:userId }
    ;
    let options =  { maxRows: 1};
    select(SQLselect,binds,options)
        .then(function (result) {
            let res=result;
            console.log(res.rows);
            response.send(res.rows);
        })
        .catch(function (error) {
            console.log(error);
        });
});
app.get("/api/computers",function (request,response) {
    console.log("Получение компьютеров");
    let SQLselect='SELECT model_id,name,processor,video,disk,RAM,price FROM computer';
    selectAll(SQLselect)
        .then(function (result) {
            let res=result;
            response.send(res.rows);
        })
        .catch(function (error) {
            console.log(error);
        });
});
app.get("/api/monitors",function (request,response) {
    console.log("Получение мониторов");
    let SQLselect='SELECT * FROM monitor';
    selectAll(SQLselect)
        .then(function (result) {
            let res=result;
            response.send(res.rows);
        })
        .catch(function (error) {
            console.log(error);
        });
});
app.get("/api/employees",function (request,response) {
    let SQLselect='SELECT * FROM employee';
    selectAll(SQLselect)
        .then(function (result) {
            let res=result;
            console.log(res.rows[0][1]);
            response.send(res.rows);
        })
        .catch(function (error) {
            console.log(error);
        });
});
app.get("/api/newOrder",function (request,response) {
    let id=request._parsedOriginalUrl.query;
    employeeId=id;
    let options = {
        autoCommit: true,
        bindDefs: {
            client_id: { type: oracledb.DB_TYPE_NUMBER},
            employee_id: { type: oracledb.DB_TYPE_NUMBER }
        }
    };
    let insertSql = "INSERT INTO \"Order\" (client_id,employe_id) values (:client_id, :employee_id)";
    let binds =
        { client_id: userId, employee_id: employeeId}
    ;

    insert(insertSql,binds,options);
    response.send();
});
app.get("/CreateOrder",function (request,response) {
    response.render("CreateOrder.hbs");
});
app.get("/api/registration",function (request,response) {
    let login=request._parsedOriginalUrl.query;
    let loginExist=false;
    let SQLselect='SELECT login FROM client';
    selectAll(SQLselect)
        .then(function (result) {
            let res=result;
            return res.rows;
        })
        .then(function (rows) {
            for (let i=0;i<rows.length;i++){
                if(login==rows[i][0]){
                    console.log("Exist!!!");
                    loginExist=true;
                }
            }
        })
        .then(function () {
            if(loginExist){
                response.send(loginExist);
            }
            else{
                console.log("Не найден");
                response.send(loginExist)
            }
        })
        .then(function () {
            loginExist=false;
        })
        .catch(function (error) {
            console.log(error);
        });
});
app.get("/",function (request,response) {
    response.render("Enter.hbs");
});
app.get("/shop",function (request,response) {
    console.log("Запрос на Shop");
    if(logIn){
    response.render("Shop.hbs");
    }
    else{
        response.render("Enter.hbs")
    }
});
app.get("/Registration",function (response,request) {
    request.render("Registration.hbs");
});
app.get("/api/currentOrder",function (request,response) {
    console.log("Получение текущего заказа");
    let SQLselect='SELECT order_id FROM \"Order\" where client_id=(:userId) and employe_id=(:employeeId) '
    let binds ={ userId:userId,employeeId:employeeId };
    let options =  {};
    select(SQLselect,binds,options)
        .then(function (result) {
            let res=result;
            response.send(res.rows[res.rows.length-1]);
        })
        .catch(function (error) {
            console.log(error);
        });
});
app.get("/index",function (request,response) {
    response.render("crud.hbs")
});
app.get("/api/users/:login&:password",function (request,response) {
    console.log("hey");
var login=request.params.login;
console.log(login);
var password=request.params.password;
console.log(password);
let SQLselect='SELECT pass,name,surname,num FROM users WHERE login= :login';
    let options =  { maxRows: 1
        //, outFormat: oracledb.OBJECT  // query result format
        //, extendedMetaData: true      // get extra metadata
        //, fetchArraySize: 100         // internal buffer allocation size for tuning
    };
    let binds =
        [login]
    ;
select(SQLselect,binds,options)
    .then(function (result) {
       let res=result;
       //Проверка на наличие логина
       if(!(res.rows[0]===undefined)){
           let userPassword=res.rows[0][0];
           let userName=res.rows[0][1];
           let userSurname=res.rows[0][2];
           let userNum=res.rows[0][3];
            if(res.rows[0][0]==password){console.log("Верные данные");
                response.write("<style>" +
                    "body {background:#FFFFFF;color:#000000;font-family:Arial,sans-serif;margin:40px;padding:10px;font-size:12px;text-align:center;}" +
                    "h1 {margin:0px;margin-bottom:12px;background:#FF0000;text-align:center;color:#FFFFFF;font-size:28px;}" +
                    "table {border-collapse: collapse;   margin-left:auto; margin-right:auto;}" +
                    "td, th {padding:8px;border-style:solid}" +
                    "</style>\n");
                response.write("<table>");
                for(var i=1;i<res.rows[0].length;i++) {
                    response.write("<tr>");
                    response.write("<td>" +res.metaData[i]["name"]+ "</td>");
                    response.write("<td>" + res.rows[0][i] + "</td>");
                    response.write("</tr>");
                }
                response.write("</table>");

                response.end();
            }
            else console.log("Неверные данные");
        }
        else {
           console.log("Несуществующий логин");
           response.render("crud.hbs");
       }
    })
    .catch(function (error) {
        console.log(error);
    });
});
app.post("/api/users", jsonParser, function (req, res) {
    console.log(req.body);
    if(!req.body) return res.sendStatus(400);
    let login = req.body.login;
    let password = req.body.password;
    let name = req.body.name;
    let surname = req.body.surname;
    let number = req.body.num;

    let options = {
        autoCommit: true,
        bindDefs: {
            login: { type: oracledb.DB_TYPE_VARCHAR,maxSize: 20 },
            password: { type: oracledb.DB_TYPE_VARCHAR, maxSize: 20 },
            name: { type: oracledb.DB_TYPE_VARCHAR,maxSize: 20 },
            surname: { type: oracledb.DB_TYPE_VARCHAR, maxSize: 20 },
            num: { type: oracledb.DB_TYPE_VARCHAR,maxSize: 20 }
        }
    };
    let insertSql = "INSERT INTO CLIENT (name,surname,phone,login,password) values (:name, :surname ,:phone, :login , :password)";
    let binds =
        { name: name, surname: surname ,phone: number, login: login,password:password }
    ;

    insert(insertSql,binds,options);
    res.send("кидаем в бд");
});
app.post("/api/login",jsonParser,function (request,response) {
    console.log(request.body);
    if(!request.body) return response.sendStatus(400);
    let login=request.body.login;
    let password = request.body.password;
    let SQLselect='SELECT password,name,surname,phone, Client_Id FROM client WHERE login= :login';
    let options =  { maxRows: 1
        //, outFormat: oracledb.OBJECT  // query result format
        //, extendedMetaData: true      // get extra metadata
        //, fetchArraySize: 100         // internal buffer allocation size for tuning
    };
    let binds =
        [login]
    ;
    select(SQLselect,binds,options)
        .then(function (result) {
            let res=result;
            //Проверка на наличие логина
            if(!(res.rows[0]===undefined)){
                let userPassword=res.rows[0][0];
                let userName=res.rows[0][1];
                let userSurname=res.rows[0][2];
                let userNum=res.rows[0][3];
                userId=res.rows[0][4];
                if(res.rows[0][0]==password){
                    console.log("Верные данные");
                    logIn=true;
                    response.send(true);
                }
                else {
                    console.log("Неверные данные");
                    response.send(false)
                }
            }
            else {
                console.log("Несуществующий логин");
                //response.render("crud.hbs");
            }
        })
        .catch(function (error) {
            console.log(error);
        });
});
app.post("/api/createSet",jsonParser,function (req,res) {
    console.log("Создание комплекта");
    //if(!req.body) return res.sendStatus(400);
    let orderId = req.body.order;
    let computerId = req.body.computer;
    let monitorId = req.body.monitor;
    //console.log("Что прислали "+orderId+" "+computerId+" "+monitorId);
    let options = {
        autoCommit: true
    };
    let insertSql = "INSERT INTO \"Set\" (Order_Id,Model_Id,Monitor_Id) values (:orderId, :computerId ,:monitorId)";
    let binds =
        { orderId: orderId[0],computerId:computerId,monitorId:monitorId}
    ;
    insert(insertSql,binds,options);
    res.send("кидаем в бд");
});

// Report an error


// Display query results


// Prepare HTML header

// Prepare HTML foo
process
    .on('SIGTERM', function() {
        console.log("\nTerminating");
        process.exit(0);
    })
    .on('SIGINT', function() {
        console.log("\nTerminating");
        process.exit(0);
    });

function doRelease(connection) {
    connection.close(
        function(err) {
            if (err) {
                console.error(err.message);
            }
        });
}
app.listen(3000,function(){console.log("server listening...");});