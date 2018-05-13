// var http = require('http');
let express=require("express");
let oracledb = require('oracledb');
let bodyParser = require("body-parser");
let hbs=require("hbs");
let MD5=require("md5");
let dbConfig = require('./dbconfig.js');
let dbConfig_client = require('./dbconfig_client.js');

let jsonParser = bodyParser.json();
let app=express();
let userId=0;
let employeeId=0;
let logIn=false;
let adminLog=false;
app.use(express.static(__dirname + "/static"));
hbs.registerPartials(__dirname + "/views/partials");
app.set("view engine", "hbs");


async function SimpleExecute(insertSql,binds=[],options={},client=true) {
    let conn;
    let result;

    try {
        if(client){conn = await oracledb.getConnection(dbConfig_client);}
        else{conn = await oracledb.getConnection(dbConfig);}
        console.log("Соединение установленно");
        result = await conn.execute(insertSql, binds, options);

        //console.log("Result is:", result);
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
    if (logIn){
        response.render("profile.hbs");
}
else{
    response.render("Enter.hbs")
}
});
app.get("/orders",function (request,response) {
if(logIn){response.render("Orders.hbs");}
else{
    response.render("Enter.hbs")
}

});
app.get("/api/profileData",function (request,response) {
    let SQLselect='SELECT name,surname,login,phone FROM C##admin_user.client where Client_Id=(:userId)';
    let binds = { userId:userId };
    let options =  { maxRows: 1};
    SimpleExecute(SQLselect,binds,options,true)
        .then(function (result) {
            let res=result;
            //console.log(res.rows);
            response.send(res.rows);
        })
        .catch(function (error) {
            console.log(error);
        });
});
app.get("/api/computers",function (request,response) {
    console.log("Получение компьютеров");
    let SQLselect='SELECT model_id,name,processor,video,disk,RAM,price FROM C##admin_user.computer';
    SimpleExecute(SQLselect,[],{},true)
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
    let SQLselect='SELECT * FROM C##admin_user.monitor';
    SimpleExecute(SQLselect,[],{},true)
        .then(function (result) {
            let res=result;
            response.send(res.rows);
        })
        .catch(function (error) {
            console.log(error);
        });
});
app.get("/api/employees",function (request,response) {
    let SQLselect='SELECT * FROM C##admin_user.employee';
    SimpleExecute(SQLselect,[],{},false)
        .then(function (result) {
            let res=result;
            //console.log(res.rows[0][1]);
            response.send(res.rows);
        })
        .catch(function (error) {
            console.log(error);
        });
});
app.get("/api/manufactures",function (request,response) {
    let SQLselect='SELECT * FROM C##admin_user.manufacture';
    SimpleExecute(SQLselect,[],{},false)
        .then(function (result) {
            let res=result;
            //console.log(res.rows[0][1]);
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
    let insertSql = "INSERT INTO C##admin_user.\"Order\" (client_id,employe_id) values (:client_id, :employee_id)";
    let binds =
        { client_id: userId, employee_id: employeeId}
    ;

    SimpleExecute(insertSql,binds,options,false);
    response.send();
});
app.get("/CreateOrder",function (request,response) {
    if(logIn){
    response.render("CreateOrder.hbs");}

else{
    response.render("Enter.hbs")
}
});
app.get("/api/registration",function (request,response) {
    let login=request._parsedOriginalUrl.query;
    let loginExist=false;
    let SQLselect='SELECT login FROM C##admin_user.client';
    SimpleExecute(SQLselect,[],{},true)
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
app.get("/api/createComp",function (request,response) {
    let name=request._parsedOriginalUrl.query;
    let loginExist=false;
    let SQLselect='SELECT name FROM C##admin_user.computer';
    SimpleExecute(SQLselect,[],{},true)
        .then(function (result) {
            let res=result;
            return res.rows;
        })
        .then(function (rows) {
            for (let i=0;i<rows.length;i++){
                if(name==rows[i][0]){
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
    console.log("Запрос станицы");
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
app.get("/CustomerEnter",function (response,request) {
    request.render("CustomerEnter.hbs");
});
app.get("/api/currentOrder",function (request,response) {
    console.log("Получение текущего заказа");
    let SQLselect='SELECT order_id FROM C##admin_user.\"Order\" where client_id=(:userId) and employe_id=(:employeeId) order by order_id asc';
    let binds ={ userId:userId,employeeId:employeeId };
    let options =  {};
    SimpleExecute(SQLselect,binds,options,true)
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
app.get("/api/clientOrders",function (req,res) {
   let SQL=`select
   "Order".order_id ,computer.name,monitor.name from C##admin_user."Order" 
   right join C##admin_user."Set" on "Order".order_id="Set".ORDER_ID
   left join C##admin_user.computer on "Set".model_id=computer.model_id 
   left join C##admin_user.monitor on "Set".monitor_id=monitor.monitor_id
   where "Order".client_id=(:userId) order by "Order".order_id
   `;
   let binds={userId:userId};
   SimpleExecute(SQL,binds,{},true)
       .then(function (resource) {
           res.send(resource.rows);
       });
});
app.get("/employee/cabinet",function (request,response) {
    if(adminLog){
    response.render("employee.hbs");}
    else response.render("Enter.hbs")
});
app.post("/api/users", jsonParser, function (req, res) {
    //console.log(req.body);
    if(!req.body) return res.sendStatus(400);
    let login = req.body.login;
    let password = req.body.password;
    password=MD5(password);
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
    let insertSql = "INSERT INTO C##admin_user.CLIENT (name,surname,phone,login,password) values (:name, :surname ,:phone, :login , :password)";
    let binds =
        { name: name, surname: surname ,phone: number, login: login,password:password }
    ;

    SimpleExecute(insertSql,binds,options,true);
    res.send("кидаем в бд");
});
app.post("/employee/api/computers", jsonParser, function (req, res) {
    console.log(req.body);
    if(!req.body) return res.sendStatus(400);
    let name = req.body.name;
    let processor = req.body.processor;
    let video = req.body.video;
    let disk = req.body.disk;
    let ram = req.body.ram;
    let price = Number(req.body.price);
    let manufactureId = Number(req.body.manufactureId);

    let options = {
        autoCommit: true
    };
    let insertSql = `INSERT INTO C##admin_user.computer 
    (manufacture_code,processor,Disk,Video,RAM,Price,Name)
    values (:manufacture_code, :processor ,:Disk, :Video , :RAM, :Price, :Name)`;
    let binds = {
            manufacture_code: manufactureId, processor: processor ,Disk: disk, Video: video,RAM:ram,Price:price,Name:name
        };
    SimpleExecute(insertSql,binds,options,false);
    res.send("кидаем в бд");
});

app.post("/api/login",jsonParser,function (request,response) {
    //console.log(request.body);
    if(!request.body) return response.sendStatus(400);
    let login=request.body.login;
    let password = request.body.password;
    password=MD5(password);
    let SQLselect='SELECT password,name,surname,phone, Client_Id FROM C##admin_user.client WHERE login= :login';
    let options =  { maxRows: 1
    };
    let binds =
        [login]
    ;
    SimpleExecute(SQLselect,binds,options,true)
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
                response.send(false);
            }
        })
        .catch(function (error) {
            console.log(error);
        });
});
app.post("/Employee",jsonParser,function (request,response) {
    //console.log(request.body);
    if(!request.body) return response.sendStatus(400);
    let login=request.body.login;
    let password = request.body.password;
   if(password=="admin"&&login=="admin"){
       response.send(true);
       adminLog=true;
   }
   else response.send(false);
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
    let insertSql = "INSERT INTO C##admin_user.\"Set\" (Order_Id,Model_Id,Monitor_Id) values (:orderId, :computerId ,:monitorId)";
    let binds =
        { orderId: orderId[0],computerId:computerId,monitorId:monitorId}
    ;
    SimpleExecute(insertSql,binds,options,false);
    res.send("кидаем в бд");
});
app.delete("/api/orders/:id", function(req, res){
    let id = req.params.id;
    let SQL1=`delete from C##admin_user.\"Set\" where order_id=(:id)`;
    let binds={id:id};
    let options={
        autoCommit: true
    };
    let SQL2=`delete from C##admin_user.\"Order\" where order_id=(:id)`;
    SimpleExecute(SQL1,binds,options,false)
        .then(function(result){SimpleExecute(SQL2,binds,options,false)})
        .then(function(result)
        {console.log("Deleted");
        res.send(true);
        });
    //console.log("Номер заказа: "+id);
});

app.get("/api/createMonitor",function (request,response) {
    let name=request._parsedOriginalUrl.query;
    let loginExist=false;
    let SQLselect='SELECT name FROM C##admin_user.monitor';
    SimpleExecute(SQLselect,[],{},false)
        .then(function (result) {
            let res=result;
            return res.rows;
        })
        .then(function (rows) {
            for (let i=0;i<rows.length;i++){
                if(name==rows[i][0]){
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
app.post("/employee/api/monitors", jsonParser, function (req, res) {
    console.log(req.body);
    if(!req.body) return res.sendStatus(400);
    let name = req.body.name;
    let options = {
        autoCommit: true
    };
    let insertSql = `INSERT INTO C##admin_user.monitor (name)
    values (:Name)`;
    let binds = {
        Name:name
    };
    SimpleExecute(insertSql,binds,options,false);
    res.send("кидаем в бд");
});
app.post("/employee/api/employees", jsonParser, function (req, res) {
    console.log(req.body);
    if(!req.body) return res.sendStatus(400);
    let name_surname = req.body.name_surname;
    let chief_id = req.body.chief_id;
    let options = {
        autoCommit: true
    };
    let insertSql = `INSERT INTO C##admin_user.employee (name_surname,chief_id)
    values (:name_surname,:chief_id)`;
    let binds = {
        name_surname:name_surname,chief_id:chief_id
    };
    SimpleExecute(insertSql,binds,options,false);
    res.send("кидаем в бд");
});

process
    .on('SIGTERM', function() {
        console.log("\nTerminating");
        process.exit(0);
    })
    .on('SIGINT', function() {
        console.log("\nTerminating");
        process.exit(0);
    });

app.listen(3000,function(){
    console.log("server listening on port 3000");
});