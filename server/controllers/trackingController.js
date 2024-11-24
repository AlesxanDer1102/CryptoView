// controllers/TrackingController.js
const axios = require("axios");
const dotenv = require("dotenv");
const Tracking = require('../models/trackingModel');
const process = require("process");

dotenv.config();

const fetchEtherscanTransactions = async (address) => {

    try {
        const response = await axios.get(`https://api.etherscan.io/api`, {
            params: {
                module: 'account',
                action: 'txlist',
                address,
                startblock: 0,
                endblock: 99999999,
                sort: 'desc',
                apikey: process.env.ETHERSCAN_API_KEY
            }
        });

        if (response.data.status !== '1') {
            throw new Error('Error en respuesta de Etherscan');
        }

        const ethTransactions = response.data.result.slice(0, 5);
        const formattedTransactions = ethTransactions.map(tx => ({
            address,
            hash: tx.hash,
            from: tx.from,
            to: tx.to,
            value: tx.value,
            timestamp: parseInt(tx.timeStamp),
            gasUsed: parseInt(tx.gasUsed),
            gasPrice: tx.gasPrice,
            status: parseInt(tx.txreceipt_status) || 0
        }));

        //await Tracking.insertMany(formattedTransactions);
        return formattedTransactions;

    } catch (error) {
        console.error('Error al obtener datos de Etherscan:', error);
        throw error;
    }
};

const getTransactions = async (req, res) => {
    try {
        const transactions = await fetchEtherscanTransactions(req.params.address);
        res.json({ success: true, data: transactions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

const queryTransactions = async (req, res) => {
    try {
        const { address, startDate, endDate } = req.query;
        const transactions = await fetchTransactionsByDate(address, startDate, endDate);
        res.json({ success: true, data: transactions });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = {
    getTransactions,
    queryTransactions
};
