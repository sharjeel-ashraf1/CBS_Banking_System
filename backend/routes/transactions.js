const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

// GET all transactions
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(
            `SELECT * FROM Transaction_Tbl ORDER BY DateTime DESC`,
            [],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// GET transactions by account
router.get('/account/:accountId', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(
            `SELECT * FROM Transaction_Tbl 
             WHERE FromAccount = :id OR ToAccount = :id 
             ORDER BY DateTime DESC`,
            [req.params.accountId, req.params.accountId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// POST deposit
router.post('/deposit', async (req, res) => {
    let conn;
    const { accountId, amount } = req.body;
    try {
        conn = await getConnection();
        await conn.execute(
            `BEGIN sp_deposit(:accountId, :amount); END;`,
            { accountId, amount }
        );
        res.json({ success: true, message: `Deposited ${amount} successfully` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// POST withdraw
router.post('/withdraw', async (req, res) => {
    let conn;
    const { accountId, amount } = req.body;
    try {
        conn = await getConnection();
        await conn.execute(
            `BEGIN sp_withdraw(:accountId, :amount); END;`,
            { accountId, amount }
        );
        res.json({ success: true, message: `Withdrawn ${amount} successfully` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// POST transfer
router.post('/transfer', async (req, res) => {
    let conn;
    const { fromAccount, toAccount, amount } = req.body;
    try {
        conn = await getConnection();
        await conn.execute(
            `BEGIN sp_transfer(:fromAccount, :toAccount, :amount); END;`,
            { fromAccount, toAccount, amount }
        );
        res.json({ success: true, message: `Transferred ${amount} successfully` });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

module.exports = router;