const oracledb = require('oracledb');
require('dotenv').config();

try {
    oracledb.initOracleClient();
} catch (err) {
    console.error('Thick mode init failed:', err.message);
}
let pool;

const connectDB = async () => {
    try {
        pool = await oracledb.createPool({
    user:           process.env.DB_USER,
    password:       process.env.DB_PASSWORD,
    connectString:  process.env.DB_CONNECTION,
    poolMin:        0,
    poolMax:        4,
    poolIncrement:  1
});
        console.log('✅ Oracle DB connected successfully');
    } catch (err) {
        console.error('❌ Oracle DB connection failed:', err.message);
        process.exit(1);
    }
};

const getConnection = async () => {
    return await pool.getConnection();
};

module.exports = { connectDB, getConnection };