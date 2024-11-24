const Transfer = require('../models/transferModel');
const Web3 = require('web3').default;
const process = require("process");

const web3 = new Web3(process.env.SEPOLIA_RPC_URL);
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;
const CONTRACT_ADDRESS = process.env.CONTRACT_ADDRESS;

// Función para obtener el ABI
const getAbi = async (contractAddress) => {
    const url = `https://api-sepolia.etherscan.io/api?module=contract&action=getabi&address=${contractAddress}&apikey=${etherscanApiKey}`;
    
    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === '1') {
            console.log("ABI obtenido exitosamente");
            return JSON.parse(data.result);
        } else {
            throw new Error(`Error al obtener el ABI: ${data.result}`);
        }
    } catch (error) {
        console.error("Error en la solicitud:", error);
        throw error;
    }
};

// Inicializar contrato de forma asíncrona
let contract;
const initializeContract = async () => {
    try {
        const abi = await getAbi(CONTRACT_ADDRESS);
        contract = new web3.eth.Contract(abi, CONTRACT_ADDRESS);
        console.log("Contrato inicializado correctamente");
    } catch (error) {
        console.error("Error al inicializar el contrato:", error);
        throw error;
    }
};
const prepareTransfer = async (req, res) => {
    try {
        if (!contract) {
            await initializeContract();
        }

        const { from, to, amount } = req.body;

        if (!from || !to || !amount) {
            return res.status(400).json({ 
                error: 'Se requieren dirección origen, destino y monto' 
            });
        }

        if (!web3.utils.isAddress(from) || !web3.utils.isAddress(to)) {
            return res.status(400).json({ 
                error: 'Direcciones inválidas' 
            });
        }

        const balance = await contract.methods.balanceOf(from).call();
        if (balance < amount) {
            return res.status(400).json({ 
                error: 'Balance insuficiente' 
            });
        }

        const nonce = await web3.eth.getTransactionCount(from, 'latest');
        const gasPrice = await web3.eth.getGasPrice();
        const data = contract.methods.transfer(to, amount).encodeABI();
        const gasLimit = await contract.methods.transfer(to, amount)
            .estimateGas({ from });

        const transactionObject = {
            nonce: web3.utils.toHex(nonce),
            gasPrice: web3.utils.toHex(gasPrice),
            gasLimit: web3.utils.toHex(gasLimit),
            to: CONTRACT_ADDRESS,
            data: data,
            value: '0x0'
        };

        // Crear nuevo registro de transferencia
        const transfer = new Transfer({
            from: from.toLowerCase(),
            to: to.toLowerCase(),
            amount: amount,
            status: 'pending',
            txHash: '0x' // Se actualizará cuando se firme la transacción
        });

        // Guardar en la base de datos
        await transfer.save();

        return res.status(200).json({
            success: true,
            transaction: transactionObject,
            transferId: transfer._id
        });

    } catch (error) {
        console.error('Error al preparar la transacción:', error);
        return res.status(500).json({ 
            error: 'Error al preparar la transacción',
            details: error.message 
        });
    }
};
initializeContract().catch(console.error);

module.exports = {
    prepareTransfer
};