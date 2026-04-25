const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { connectDB } = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/customers',    require('./routes/customers'));
app.use('/api/accounts',     require('./routes/accounts'));
app.use('/api/transactions', require('./routes/transactions'));
app.use('/api/auditlog',     require('./routes/auditlog'));

// Health check
app.get('/', (req, res) => {
    res.json({ message: '🏦 CBS Banking API is running' });
});

const PORT = process.env.PORT || 5000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
});