import { useState } from 'react';
import { ethers } from 'ethers';
import { toast } from 'react-toastify';


// Componente funcional principal
const Transfer = () => {
  // Estados
  const [formData, setFormData] = useState({ to: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handler para cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para validar el formulario
  const validateForm = () => {
    if (!formData.to || !formData.amount) {
      throw new Error('Todos los campos son requeridos');
    }
    if (!ethers.isAddress(formData.to)) {
      throw new Error('Dirección de destino inválida');
    }
    if (isNaN(formData.amount) || parseFloat(formData.amount) <= 0) {
      throw new Error('Monto inválido');
    }
  };

  // Función para realizar la transferencia
  const executeTransfer = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = provider.getSigner();
    
    const tx = await signer.sendTransaction({
      to: formData.to,
      value: ethers.parseEther(formData.amount)
    });

    return tx;
  };

  // Handler para el submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      validateForm();
      const tx = await executeTransfer();
      
      console.log('Transaction hash:', tx.hash);
      setFormData({ to: '', amount: '' });
      toast.success('Transferencia exitosa!');

    } catch (error) {
      console.error(error);
      setError(error.message);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Transferir Tokens
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Dirección Destino
            </label>
            <input
              type="text"
              name="to"
              value={formData.to}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="0x..."
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Cantidad
            </label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="0.0"
              step="0.000000000000000001"
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-blue-500 text-white py-2 px-4 rounded-md 
              ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'}`}
          >
            {loading ? 'Procesando...' : 'Transferir'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transfer;