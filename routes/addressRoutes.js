const express = require('express');
const router = express.Router();
const pool = require('../db/connection');

router.get('/:email', async (req, res) => {
    const { email } = req.params;
    let conn;
    
    try {
        conn = await pool.getConnection();
        const result = await conn.query(
            'SELECT address FROM user_addresses WHERE email = ?', 
            [email]
        );
        
        if (result.length > 0) {
            res.json({ success: true, data: result[0] });
        } else {
            res.status(404).json({ success: false, message: 'Address not found' });
        }
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

router.post('/', async (req, res) => {
    const { email, address } = req.body;
    
    if (!email || !address) {
        return res.status(400).json({ success: false, message: 'Email and address are required' });
    }

    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query(`
            INSERT INTO user_addresses (email, address) 
            VALUES (?, ?) 
            ON DUPLICATE KEY UPDATE address = ?
        `, [email, address, address]);
        
        res.json({ success: true, message: 'Address saved successfully' });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    } finally {
        if (conn) conn.release();
    }
});

module.exports = router;