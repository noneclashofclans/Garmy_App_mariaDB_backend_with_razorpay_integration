require('dotenv').config();
const PORT = process.env.PORT
const express = require('express')
const cors = require('cors');
const app = express();

const addressRoutes = require('./routes/addressRoutes')
const razorpayUPI = require('./routes/razorpay')
const { paymentLimiter } = require('./rateLimiter')


app.use(express.json());
app.use(cors())
app.set('trust proxy', 1);

app.use('/api/upi_payment/create-order', paymentLimiter);


app.use('/api/addresses', addressRoutes)
app.use('/api/upi_payment', razorpayUPI)

app.get('/', (req, res) => {
    res.send('MariaDB backend is running')
})

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});