const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());

// Function to fetch the KES to USDT conversion rate
const fetchConversionRate = async () => {
    try {
        const response = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=tether&vs_currencies=kes');
        return response.data.tether.kes;
    } catch (error) {
        console.error('Error fetching conversion rate:', error);
        throw new Error('Could not fetch conversion rate');
    }
};

// API endpoint to convert KES to USDT
app.get('/convert', async (req, res) => {
    const { amount } = req.query;

    if (!amount || isNaN(amount)) {
        return res.status(400).json({ error: 'Invalid amount provided' });
    }

    try {
        const conversionRate = await fetchConversionRate();
        const usdtAmount = (amount / conversionRate).toFixed(6); // Convert KES to USDT
        res.json({ usdtAmount });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
