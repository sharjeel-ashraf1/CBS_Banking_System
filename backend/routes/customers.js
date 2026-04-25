const express = require('express');
const router = express.Router();
const { getConnection } = require('../config/db');

// GET all customers
router.get('/', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(
            `SELECT * FROM Customer ORDER BY CustomerID`,
            [],
            { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
        );
        res.json({ success: true, data: result.rows });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// GET single customer
router.get('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        const result = await conn.execute(
            `SELECT * FROM Customer WHERE CustomerID = :id`,
            [req.params.id],
            { outFormat: require('oracledb').OUT_FORMAT_OBJECT }
        );
        if (result.rows.length === 0)
            return res.status(404).json({ success: false, message: 'Customer not found' });
        res.json({ success: true, data: result.rows[0] });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// POST add customer
router.post('/', async (req, res) => {
    let conn;
    const { name, cnic, contact, address, email } = req.body;
    try {
        conn = await getConnection();
        await conn.execute(
            `BEGIN sp_add_customer(:name, :cnic, :contact, :address, :email); END;`,
            { name, cnic, contact, address, email }
        );
        res.json({ success: true, message: 'Customer added successfully' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

// DELETE customer
router.delete('/:id', async (req, res) => {
    let conn;
    try {
        conn = await getConnection();
        await conn.execute(
            `DELETE FROM Customer WHERE CustomerID = :id`,
            [req.params.id],
            { autoCommit: true }
        );
        res.json({ success: true, message: 'Customer deleted' });
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    } finally {
        if (conn) await conn.close();
    }
});

module.exports = router;