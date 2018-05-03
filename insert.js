var oracledb = require('oracledb');
var dbConfig = require('./dbconfig.js');

//const truncateSql = "TRUNCATE TABLE em_tab";
const insertSql = "INSERT INTO em_tab values (:a, :b)";

const binds = [
    { a: 1, b: "Test 1 (One)" },
    { a: 2, b: "Test 2 (Two)" },
    { a: 3, b: "Test 3 (Three)" },
    { a: 4 },
    { a: 6, b: "Test 5 (lol)" }
];

// bindDefs is optional for IN binds but it is generally recommended.
// Without it the data must be scanned to find sizes and types.
const options = {
    autoCommit: true,
    bindDefs: {
        a: { type: oracledb.NUMBER },
        b: { type: oracledb.STRING, maxSize: 15 }
    }
};

async function run() {
    let conn;
    let result;

    try {
        conn = await oracledb.getConnection(dbConfig);

        //await conn.execute(truncateSql);

        result = await conn.executeMany(insertSql, binds, options);

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

run();
console.log("Ахахахха,я первее");