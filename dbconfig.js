
module.exports = {
    user          : process.env.NODE_ORACLEDB_USER || "system",
    password      : process.env.NODE_ORACLEDB_PASSWORD || "zZ239210",
    connectString : process.env.NODE_ORACLEDB_CONNECTIONSTRING || "localhost:1521/orcl.be.by",
    externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
};