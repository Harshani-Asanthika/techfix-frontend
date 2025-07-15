import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig'; // Your configured Axios instance

function QuotationDetail() {
    const { id } = useParams(); // Get the 'id' from the URL parameters
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                // API call to fetch a single quotation by ID
                const url = `http://localhost:5072/api/Quotations/${id}`; // <-- UPDATED URL
                const response = await apiClient.get(url);
                setQuotation(response.data);
                setLoading(false);
            } catch (err) {
                console.error(`Failed to fetch quotation with ID ${id}:`, err);
                if (err.response && err.response.status === 404) {
                    setError("Quotation not found.");
                } else {
                    setError(`Failed to load quotation: ${err.message}`);
                }
                setLoading(false);
            }
        };

        fetchQuotation();
    }, [id]); // Re-run effect if the ID in the URL changes

    if (loading) {
        return <div style={infoMessageStyle}>Loading quotation details...</div>;
    }

    if (error) {
        return <div style={errorMessageStyle}>{error} <Link to="/quotations" style={linkStyle}>Go back to list</Link></div>;
    }

    if (!quotation) {
        return <div style={infoMessageStyle}>No quotation data available. <Link to="/quotations" style={linkStyle}>Go back to list</Link></div>;
    }

    // Render the quotation details
    return (
        <div style={detailContainerStyle}>
            <h2>Quotation Details (ID: {quotation.id})</h2>
            <div style={detailRowStyle}>
                <strong>Customer Name:</strong> {quotation.customerName}
            </div>
            <div style={detailRowStyle}>
                <strong>Total Amount:</strong> ${quotation.totalAmount ? quotation.totalAmount.toFixed(2) : '0.00'}
            </div>
            <div style={detailRowStyle}>
                <strong>Status:</strong> {quotation.status}
            </div>
            {/*
        You would typically display quotation items here if your model includes them.
        Example if quotation.items is an array of objects with id, productName, quantity, price:
        <div style={detailRowStyle}>
          <strong>Items:</strong>
          <ul>
            {quotation.items && quotation.items.map(item => (
              <li key={item.id}>{item.productName} - Qty: {item.quantity} - Price: ${item.price.toFixed(2)}</li>
            ))}
          </ul>
        </div>
      */}

            <div style={{ marginTop: '20px' }}>
                <Link to="/quotations" style={backLinkStyle}>Back to Quotations List</Link>
                {/* You could add Edit/Delete buttons here if you prefer them on the detail page */}
            </div>
        </div>
    );
}

// --- Inline Styles (consider moving to a dedicated CSS file for larger projects) ---
const detailContainerStyle = {
    maxWidth: '600px',
    margin: '30px auto',
    padding: '30px',
    border: '1px solid #ddd',
    borderRadius: '8px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
    backgroundColor: '#fff',
};

const detailRowStyle = {
    marginBottom: '15px',
    paddingBottom: '10px',
    borderBottom: '1px solid #eee',
};

const infoMessageStyle = {
    padding: '20px',
    textAlign: 'center',
    color: '#007bff',
    backgroundColor: '#eaf6ff',
    borderRadius: '8px',
};

const errorMessageStyle = {
    padding: '20px',
    textAlign: 'center',
    color: 'red',
    backgroundColor: '#ffe6e6',
    borderRadius: '8px',
    border: '1px solid red',
};

const backLinkStyle = {
    display: 'inline-block',
    padding: '10px 15px',
    backgroundColor: '#6c757d',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.2s ease',
};
// Note: Inline styles don't directly support :hover. For hover effects, you'd use a CSS file.
// backLinkStyle[':hover'] = { backgroundColor: '#5a6268' };

const linkStyle = { // For links within messages (e.g., "Go back to list")
    color: '#007bff',
    textDecoration: 'underline',
};

export default QuotationDetail;