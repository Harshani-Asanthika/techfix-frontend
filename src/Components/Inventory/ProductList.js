import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axiosConfig';
import { Link } from 'react-router-dom';

function ProductList() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(''); // For success/error messages after deletion

    // Function to fetch products (re-used after delete)
    const fetchProducts = async () => {
        try {
            const response = await apiClient.get('https://localhost:7250/api/Components');
            setProducts(response.data);
            setLoading(false);
            setMessage(''); // Clear any previous messages on successful load
        } catch (err) {
            console.error("Failed to fetch products:", err);
            setError("Failed to load products. " + (err.response?.data?.message || err.message));
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(); // Initial fetch when component mounts
    }, []);

    // Handle delete operation
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this component? This action cannot be undone.")) {
            try {
                const url = `https://localhost:7250/api/Components/${id}`; // Correct endpoint for DELETE
                const response = await apiClient.delete(url);

                if (response.status === 204) { // 204 No Content is typical for successful DELETE
                    setMessage('Component deleted successfully!');
                    // Update the state to remove the deleted product without re-fetching all products
                    setProducts(products.filter(product => product.id !== id));
                } else {
                    setMessage('Failed to delete component. Status: ' + response.status);
                }
            } catch (err) {
                console.error(`Error deleting component with ID ${id}:`, err);
                setMessage('Error deleting component: ' + (err.response?.data?.title || err.message));
            }
            // Clear message after a short delay
            setTimeout(() => setMessage(''), 3000);
        }
    };


    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#007bff' }}>
                <p>Loading inventory items...</p>
                <div style={{ border: '4px solid rgba(0, 0, 0, 0.1)', borderTop: '4px solid #007bff', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', margin: '10px auto' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red', border: '1px solid red', borderRadius: '8px', backgroundColor: '#ffe6e6' }}>
                <p>Error loading inventory:</p>
                <p>{error}</p>
                <p>Please ensure the Inventory Service backend is running and accessible.</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#555' }}>
                <p>No inventory items found.</p>
                <p>You can add new components from the "Add Component" link.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '20px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2>Inventory List</h2>
            {message && (
                <p style={{ ...messageStyle, backgroundColor: message.includes('Error') ? '#ffe6e6' : '#e6ffe6', color: message.includes('Error') ? 'red' : 'green' }}>
                    {message}
                </p>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Name</th>
                        <th style={tableHeaderStyle}>Description</th>
                        <th style={tableHeaderStyle}>Price</th>
                        <th style={tableHeaderStyle}>Quantity</th>
                        <th style={tableHeaderStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map(product => (
                        <tr key={product.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={tableCellStyle}>{product.id}</td>
                            <td style={tableCellStyle}>
                                <Link to={`/inventory/${product.id}`} style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                                    {product.name}
                                </Link>
                            </td>
                            <td style={tableCellStyle}>{product.description || 'N/A'}</td>
                            <td style={tableCellStyle}>${product.price ? product.price.toFixed(2) : '0.00'}</td>
                            <td style={tableCellStyle}>{product.availableStock}</td>
                            <td style={tableCellStyle}>
                                <Link to={`/inventory/edit/${product.id}`} style={editLinkStyle}>
                                    Edit
                                </Link>
                                {' '} {/* Add a small space */}
                                <button
                                    onClick={() => handleDelete(product.id)}
                                    style={deleteButtonStyle}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

// --- Styles (add these new styles) ---
const tableHeaderStyle = {
    padding: '12px 15px',
    textAlign: 'left',
    borderBottom: '2px solid #ddd',
    fontWeight: 'bold',
    color: '#333'
};

const tableCellStyle = {
    padding: '10px 15px',
    borderBottom: '1px solid #eee'
};

const editLinkStyle = {
    display: 'inline-block',
    padding: '5px 10px',
    backgroundColor: '#ffc107', // Yellow for edit
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.85em',
    transition: 'background-color 0.2s ease',
    marginRight: '5px', // Space between buttons
};
editLinkStyle[':hover'] = { backgroundColor: '#e0a800' };

const deleteButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#dc3545', // Red for delete
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '0.85em',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease',
};
deleteButtonStyle[':hover'] = { backgroundColor: '#c82333' };

const messageStyle = {
    padding: '10px',
    borderRadius: '4px',
    marginBottom: '15px', // Space below message
    textAlign: 'center',
};

export default ProductList;