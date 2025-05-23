const axios = require('axios');
const asyncHandler = require('express-async-handler');

// Utility function to get exchange rate
const getExchangeRate = async () => {
    const response = await axios.get(`https://open.er-api.com/v6/latest/CLP`);
    if (!response.data || !response.data.rates || !response.data.rates.USD) {
        throw new Error('No se pudo obtener la tasa de cambio');
    }
    return {
        rate: response.data.rates.USD,
        timestamp: response.data.time_last_update_utc
    };
};

// Utility function to convert CLP to USD
const convertCLPtoUSDAmount = (clpAmount, rate) => {
    return Number((clpAmount * rate).toFixed(2));
};

// Utility function to convert USD to CLP
const convertUSDtoCLPAmount = (usdAmount, rate) => {
    return Math.round(usdAmount / rate);
};

// @desc    Convert CLP to USD
// @route   GET /api/currency/convert
// @access  Public
const convertCLPtoUSD = asyncHandler(async (req, res) => {
    try {
        const amount = req.query.amount;
        
        if (!amount || isNaN(amount)) {
            res.status(400);
            throw new Error('Por favor proporciona una cantidad válida');
        }

        const { rate, timestamp } = await getExchangeRate();
        const convertedAmount = convertCLPtoUSDAmount(amount, rate);

        res.json({
            success: true,
            data: {
                from: 'CLP',
                to: 'USD',
                amount: Number(amount),
                convertedAmount,
                rate,
                timestamp
            }
        });

    } catch (error) {
        res.status(error.response?.status || 500);
        throw new Error(error.message || 'Error en la conversión de moneda');
    }
});

// @desc    Add USD prices to articles
// @route   Internal function
// @access  Private
const addUSDPricesToArticles = async (articles) => {
    try {
        const { rate, timestamp } = await getExchangeRate();
        
        return articles.map(article => ({
            ...article,
            precio_usd: convertCLPtoUSDAmount(article.precio, rate),
            exchange_rate: {
                CLP_USD: rate,
                timestamp
            }
        }));
    } catch (error) {
        console.error('Error adding USD prices:', error);
        throw error;
    }
};

module.exports = {
    convertCLPtoUSD,
    addUSDPricesToArticles,
    getExchangeRate,
    convertCLPtoUSDAmount,
    convertUSDtoCLPAmount
}; 