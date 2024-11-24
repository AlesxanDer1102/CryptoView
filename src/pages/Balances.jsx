import { useState } from 'react';
import axios from 'axios';

const Balances = () => {
    const [address, setAddress] = useState('');
    const [balance, setBalance] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        
        try {
            const response = await axios.get(`http://localhost:5000/api/balance/${address}`);
            setBalance(response.data.data);
        } catch (err) {
            setError(err.response?.data?.error || 'Error al consultar el balance');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto bg-white p-8 rounded-lg shadow">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Consulta de Balance Ethereum
                </h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <div className="flex gap-4">
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => setAddress(e.target.value)}
                                placeholder="Ingresa dirección ETH"
                                className="flex-1 min-w-0 block w-full px-3 py-2 rounded-md border border-gray-300 
                                         focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <button 
                                type="submit" 
                                disabled={loading}
                                className={`inline-flex justify-center py-2 px-4 border border-transparent 
                                          rounded-md shadow-sm text-sm font-medium text-white 
                                          ${loading 
                                            ? 'bg-gray-400 cursor-not-allowed' 
                                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500'
                                          }`}
                            >
                                {loading ? 'Consultando...' : 'Consultar Balance'}
                            </button>
                        </div>
                    </div>
                </form>

                {error && (
                    <div className="mt-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                        {error}
                    </div>
                )}
                
                {balance && (
                    <div className="mt-6 bg-gray-50 border border-gray-200 rounded-md p-4">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                            Resultados:
                        </h3>
                        <div className="space-y-2">
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Dirección:</span> {balance.address}
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Balance:</span> {balance.balance} ETH
                            </p>
                            <p className="text-sm text-gray-600">
                                <span className="font-medium">Última actualización:</span>{' '}
                                {new Date(balance.lastUpdated).toLocaleString()}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Balances;