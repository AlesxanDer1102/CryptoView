const Web3 = require('web3').default;
const Balance = require('../models/balanceModel');
const process = require('process');


const web3 = new Web3(process.env.MAINNET_RPC_URL);

const getAddressBalance = async (req, res) => {

    try {
        const { address } = req.params;

        // Validar formato de dirección Ethereum
        if (!web3.utils.isAddress(address)) {
            return res.status(400).json({
                success: false,
                error: 'Dirección Ethereum inválida'
            });
        }

        // Obtener balance desde la blockchain
        const balanceWei = await web3.eth.getBalance(address);
        const balanceEth = web3.utils.fromWei(balanceWei, 'ether');
        console.log("Balance en Wei:", balanceEth);
        // Guardar o actualizar en la base de datos
      
    // const balanceRecord = await Balance.findOneAndUpdate(
    //     { address }, // condición de búsqueda
    //     { 
    //         address, 
    //         balance: parseFloat(balanceEth)
    //     },
    //     {
    //         upsert: true, // crear si no existe
    //         new: true, // devolver el documento actualizado
    //         setDefaultsOnInsert: true
    //     }
    // );

        return res.status(200).json({
            success: true,
            data: {
                address,
                balance: balanceEth
                // lastUpdated: balanceRecord.lastTransaction
            }
        });

    } catch (error) {
        console.error('Error al obtener balance:', error);
        return res.status(500).json({
            success: false,
            error: 'Error al obtener el balance'
        });
    }
};

module.exports = {
    getAddressBalance
};