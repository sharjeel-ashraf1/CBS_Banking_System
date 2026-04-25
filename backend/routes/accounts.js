const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');
const oracledb = require('oracledb');

// GET all accounts
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(
            `SELECT a.*, c.Name as CustomerName 
             FROM Account a 
             JOIN Customer c ON a.CustomerID = c.CustomerID
             ORDER BY a.AccountID`,
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

// GET accounts by customer
router.get('/customer/:customerId', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(
            `SELECT * FROM Account WHERE CustomerID = :id ORDER BY AccountID`,
            [req.params.customerId],
            { outFormat: oracledb.OUT_FORMAT_OBJECT }
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// POST open account
router.post('/', async (req, res) => {
    let conn;
    const { customerId, type, balance } = req.body;
    try {
        conn = await getConnection();
        await conn.execute(
            `BEGIN sp_open_account(:customerId, :type, :balance); END;`,
            { customerId, type, balance }
        );
        res.json({ success: true, message: 'Account opened successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// PATCH update account status
router.patch('/:id/status', async (req, res) => {
    let conn;
    const { status } = req.body;
    try {
        conn = await getConnection();
        await conn.execute(
            `UPDATE Account SET Status = :status WHERE AccountID = :id`,
            { status, id: req.params.id },
            { autoCommit: true }
        );
        res.json({ success: true, message: 'Account status updated' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

module.exports = router;