import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axiosConfig'; // Your configured Axios instance
import { Link } from 'react-router-dom';

function QuotationList() {
    const [quotations, setQuotations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(''); // For success/error messages

    const fetchQuotations = async () => {
        try {
            // IMPORTANT: Use the correct URL for your Quotation Service
            // Based on your previous update, it should be http://localhost:5072
            const response = await apiClient.get('https://localhost:7127/api/Quotations');
            setQuotations(response.data);
            setLoading(false);
            setMessage(''); // Clear message on new fetch
        } catch (err) {
            console.error("Failed to fetch quotations:", err);
            setError("Failed to load quotations. " + (err.response?.data?.title || err.message));
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchQuotations();
    }, []);

    // Handle delete operation
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this quotation? This action cannot be undone.")) {
            try {
                // IMPORTANT: Use the correct URL for your Quotation Service
                const url = `https://localhost:7127/api/Quotations/${id}`;
                const response = await apiClient.delete(url);

                if (response.status === 204) {
                    setMessage('Quotation deleted successfully! ✅');
                    // Remove the deleted quotation from the local state
                    setQuotations(quotations.filter(quotation => quotation.id !== id));
                } else {
                    setMessage('Failed to delete quotation. Status: ' + response.status);
                }
            } catch (err) {
                console.error(`Error deleting quotation with ID ${id}:`, err);
                setMessage('Error deleting quotation: ' + (err.response?.data?.title || err.message));
            }
            setTimeout(() => setMessage(''), 3000); // Clear message after 3 seconds
        }
    };


    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#007bff' }}>
                <p>Loading quotations...</p>
                <div style={{ border: '4px solid rgba(0, 0, 0, 0.1)', borderTop: '4px solid #007bff', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', margin: '10px auto' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red', border: '1px solid red', borderRadius: '8px', backgroundColor: '#ffe6e6' }}>
                <p>Error loading quotations:</p>
                <p>{error}</p>
                <p>Please ensure the Quotation Service backend is running and accessible.</p>
            </div>
        );
    }

    if (quotations.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#555' }}>
                <p>No quotations found.</p>
                <p>You can add new quotations using the "Add Quotation" link.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '900px', margin: '50px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2>Quotation List</h2>
            {message && (
                <p style={{ ...messageStyle, backgroundColor: message.includes('Error') ? '#ffe6e6' : '#e6ffe6', color: message.includes('Error') ? 'red' : 'green' }}>
                    {message}
                </p>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Customer Name</th>
                        <th style={tableHeaderStyle}>Total Amount</th>
                        <th style={tableHeaderStyle}>Status</th>
                        <th style={tableHeaderStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {quotations.map(quotation => (
                        <tr key={quotation.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={tableCellStyle}>{quotation.id}</td>
                            <td style={tableCellStyle}>
                                <Link to={`/quotations/${quotation.id}`} style={{ textDecoration: 'none', color: '#007bff', fontWeight: 'bold' }}>
                                    {quotation.customerName || 'N/A'}
                                </Link>
                            </td>
                            <td style={tableCellStyle}>${quotation.totalAmount ? quotation.totalAmount.toFixed(2) : '0.00'}</td>
                            <td style={tableCellStyle}>{quotation.status || 'Draft'}</td>
                            <td style={tableCellStyle}>
                                <Link to={`/quotations/edit/${quotation.id}`} style={editLinkStyle}>
                                    Edit
                                </Link>
                                {' '}
                                <button
                                    onClick={() => handleDelete(quotation.id)}
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

// --- Styles ---
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
    backgroundColor: '#ffc107',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.85em',
    transition: 'background-color 0.2s ease',
    marginRight: '5px',
};
editLinkStyle[':hover'] = { backgroundColor: '#e0a800' };

const deleteButtonStyle = {
    padding: '5px 10px',
    backgroundColor: '#dc3545',
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
    marginBottom: '15px',
    textAlign: 'center',
};

export default QuotationList;