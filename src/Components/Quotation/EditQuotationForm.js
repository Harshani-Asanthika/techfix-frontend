import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import apiClient from '../../api/axiosConfig'; // Your configured Axios instance

function EditQuotationForm() {
    const { id } = useParams(); // Get the ID from the URL (e.g., /quotations/edit/123)
    const navigate = useNavigate(); // For redirection after update

    // State to hold the quotation data (initially null or empty)
    const [quotation, setQuotation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(''); // For success/error messages after submission
    const [isError, setIsError] = useState(false);

    // useEffect to fetch quotation data when the component mounts or ID changes
    useEffect(() => {
        const fetchQuotation = async () => {
            try {
                // Fetch the existing quotation data using its ID
                const url = `http://localhost:5072/api/Quotations/${id}`; // <-- UPDATED URL for GET
                const response = await apiClient.get(url);
                setQuotation(response.data); // Set the fetched data to state to pre-fill the form
                setLoading(false);
            } catch (err) {
                console.error(`Failed to fetch quotation with ID ${id} for editing:`, err);
                if (err.response && err.response.status === 404) {
                    setError("Quotation not found for editing.");
                } else {
                    setError(`Failed to load quotation for editing: ${err.message}`);
                }
                setLoading(false);
            }
        };

        fetchQuotation();
    }, [id]); // Re-run effect if the ID in the URL changes

    // Handle input changes in the form
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setQuotation(prevQuotation => ({
            ...prevQuotation,
            [name]: type === 'number' ? parseFloat(value) : value // Parse numbers
        }));
    };

    // Handle form submission (PUT request)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        setIsError(false);

        if (!quotation) {
            setMessage('No quotation data to save.');
            setIsError(true);
            return;
        }

        try {
            // Send a PUT request to update the quotation
            // The URL includes the ID, and the request body is the updated quotation object
            const url = `http://localhost:5072/api/Quotations/${id}`; // <-- UPDATED URL for PUT
            const response = await apiClient.put(url, quotation);

            if (response.status === 204) { // 204 No Content is typical for successful PUT (update)
                setMessage('Quotation updated successfully! 🎉');
                setIsError(false);
                setTimeout(() => navigate('/quotations'), 1500); // Redirect to quotations list after 1.5s
            } else {
                setMessage('Failed to update quotation. Status: ' + response.status);
                setIsError(true);
            }
        } catch (err) {
            console.error("Error updating quotation:", err);
            setMessage('Error updating quotation: ' + (err.response?.data?.title || err.message));
            setIsError(true);
        }
    };

    // Conditional rendering for loading, error, or form
    if (loading) {
        return <div style={infoMessageStyle}>Loading quotation for editing...</div>;
    }

    if (error) {
        return <div style={errorMessageStyle}>{error} <Link to="/quotations" style={linkStyle}>Go back to list</Link></div>;
    }

    if (!quotation) {
        return <div style={infoMessageStyle}>Quotation data not found. <Link to="/quotations" style={linkStyle}>Go back to list</Link></div>;
    }

    // Render the form pre-filled with quotation data
    return (
        <div style={formContainerStyle}>
            <h2>Edit Quotation (ID: {quotation.id})</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="customerName" style={labelStyle}>Customer Name:</label>
                    <input
                        type="text"
                        id="customerName"
                        name="customerName"
                        value={quotation.customerName || ''} // Use || '' to handle null/undefined safely
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label htmlFor="totalAmount" style={labelStyle}>Total Amount:</label>
                    <input
                        type="number"
                        id="totalAmount"
                        name="totalAmount"
                        value={quotation.totalAmount}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label htmlFor="status" style={labelStyle}>Status:</label>
                    <select
                        id="status"
                        name="status"
                        value={quotation.status || 'Draft'}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="Draft">Draft</option>
                        <option value="Sent">Sent</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
                <button type="submit" style={buttonStyle}>Update Quotation</button>
                <Link to="/quotations" style={cancelButtonStyle}>Cancel</Link>
            </form>

            {/* Display messages */}
            {message && (
                <p style={{ ...messageStyle, backgroundColor: isError ? '#ffe6e6' : '#e6ffe6', color: isError ? 'red' : 'green' }}>
                    {message}
                </p>
            )}
        </div>
    );
}

// --- Inline Styles (consider moving to a dedicated CSS file for larger projects) ---
const formContainerStyle = {
    maxWidth: '600px',
    margin: '50px auto',
    padding: '20px',
    border: '1px solid #eee',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
};

const labelStyle = {
    display: 'block',
    marginBottom: '5px',
    fontWeight: 'bold',
    color: '#555'
};

const inputStyle = {
    width: 'calc(100% - 22px)', // Account for padding and border
    padding: '10px',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '1em',
    boxSizing: 'border-box'
};

const buttonStyle = {
    padding: '12px 20px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1em',
    cursor: 'pointer',
    marginTop: '10px',
    transition: 'background-color 0.3s ease',
};
// Note: Inline styles don't directly support :hover. For hover effects, you'd use a CSS file.
// buttonStyle[':hover'] = { backgroundColor: '#0056b3' };

const cancelButtonStyle = {
    ...buttonStyle, // Inherit button styles
    backgroundColor: '#6c757d', // Different color for cancel
    textDecoration: 'none', // Remove underline for Link
    textAlign: 'center',
    display: 'block', // Make it a block element
};
// cancelButtonStyle[':hover'] = { backgroundColor: '#5a6268' };

const messageStyle = {
    padding: '10px',
    borderRadius: '4px',
    marginTop: '15px',
    textAlign: 'center'
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

const linkStyle = { // For links within messages
    color: '#007bff',
    textDecoration: 'underline',
};

export default EditQuotationForm;