import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom'; // Import useParams and Link
import apiClient from '../../api/axiosConfig'; // Assuming axiosConfig.js is in src/api

function ComponentDetail() {
    const { id } = useParams(); // Get the 'id' from the URL parameters
    const [component, setComponent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchComponent = async () => {
            try {
                // Construct the URL using the ID from useParams
                const url = `https://localhost:7250/api/Components/${id}`; // <-- Use your correct port (7250)
                const response = await apiClient.get(url);
                setComponent(response.data);
                setLoading(false);
            } catch (err) {
                console.error(`Failed to fetch component with ID ${id}:`, err);
                if (err.response && err.response.status === 404) {
                    setError("Component not found.");
                } else {
                    setError(`Failed to load component: ${err.message}`);
                }
                setLoading(false);
            }
        };

        fetchComponent();
    }, [id]); // Re-run effect if the ID in the URL changes

    if (loading) {
        return <div style={infoMessageStyle}>Loading component details...</div>;
    }

    if (error) {
        return <div style={errorMessageStyle}>{error} <Link to="/inventory" style={linkStyle}>Go back to list</Link></div>;
    }

    if (!component) {
        return <div style={infoMessageStyle}>No component data available. <Link to="/inventory" style={linkStyle}>Go back to list</Link></div>;
    }

    // Render the component details
    return (
        <div style={detailContainerStyle}>
            <h2>Component Details</h2>
            <div style={detailRowStyle}>
                <strong>ID:</strong> {component.id}
            </div>
            <div style={detailRowStyle}>
                <strong>Name:</strong> {component.name}
            </div>
            <div style={detailRowStyle}>
                <strong>Description:</strong> {component.description || 'No description provided.'}
            </div>
            <div style={detailRowStyle}>
                <strong>Price:</strong> ${component.price ? component.price.toFixed(2) : '0.00'}
            </div>
            <div style={detailRowStyle}>
                <strong>Quantity:</strong> {component.quantity}
            </div>
            {/* Add more fields as per your Component model */}

            <div style={{ marginTop: '20px' }}>
                <Link to="/inventory" style={backLinkStyle}>Back to Inventory List</Link>
                {/* You could add Edit/Delete buttons here later */}
            </div>
        </div>
    );
}

// --- Inline Styles (consider moving to CSS) ---
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
backLinkStyle[':hover'] = { backgroundColor: '#5a6268' }; // Placeholder for hover

const linkStyle = { // For links within messages
    color: '#007bff',
    textDecoration: 'underline',
};

export default ComponentDetail;