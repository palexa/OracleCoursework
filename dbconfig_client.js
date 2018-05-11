
module.exports = {
    user          : process.env.NODE_ORACLEDB_USER || "C##CLIENT_USER",
    password      : process.env.NODE_ORACLEDB_PASSWORD || "qwerty",
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost:1521/orcl.be.by",
    externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
};