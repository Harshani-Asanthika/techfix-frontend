import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // <-- Add Link here
import apiClient from '../../api/axiosConfig'; // Your configured Axios instance

function EditComponentForm() {
    const { id } = useParams(); // Get the ID from the URL (e.g., /inventory/edit/123)
    const navigate = useNavigate(); // For redirection after update

    // State to hold the component data (initially null or empty)
    const [component, setComponent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(''); // For success/error messages after submission
    const [isError, setIsError] = useState(false);

    // useEffect to fetch component data when the component mounts or ID changes
    useEffect(() => {
        const fetchComponent = async () => {
            try {
                // Fetch the existing component data using its ID
                const url = `https://localhost:7250/api/Components/${id}`; // <-- Use your correct InventoryService port (7250)
                const response = await apiClient.get(url);
                setComponent(response.data); // Set the fetched data to state to pre-fill the form
                setLoading(false);
            } catch (err) {
                console.error(`Failed to fetch component with ID ${id} for editing:`, err);
                if (err.response && err.response.status === 404) {
                    setError("Component not found for editing.");
                } else {
                    setError(`Failed to load component for editing: ${err.message}`);
                }
                setLoading(false);
            }
        };

        fetchComponent();
    }, [id]); // Re-run effect if the ID in the URL changes

    // Handle input changes in the form
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setComponent(prevComponent => ({
            ...prevComponent,
            [name]: type === 'number' ? parseFloat(value) : value // Parse numbers
        }));
    };

    // Handle form submission (PUT request)
    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage(''); // Clear previous messages
        setIsError(false);

        if (!component) {
            setMessage('No component data to save.');
            setIsError(true);
            return;
        }

        try {
            // Send a PUT request to update the component
            // The URL includes the ID, and the request body is the updated component object
            const url = `https://localhost:7250/api/Components/${id}`; // <-- Use your correct InventoryService port (7250)
            const response = await apiClient.put(url, component);

            if (response.status === 204) { // 204 No Content is typical for successful PUT (update)
                setMessage('Component updated successfully!');
                setIsError(false);
                setTimeout(() => navigate('/inventory'), 1500); // Redirect to inventory list after 1.5s
            } else {
                setMessage('Failed to update component. Status: ' + response.status);
                setIsError(true);
            }
        } catch (err) {
            console.error("Error updating component:", err);
            setMessage('Error updating component: ' + (err.response?.data?.title || err.message));
            setIsError(true);
        }
    };

    // Conditional rendering for loading, error, or form
    if (loading) {
        return <div style={infoMessageStyle}>Loading component for editing...</div>;
    }

    if (error) {
        return <div style={errorMessageStyle}>{error} <Link to="/inventory" style={linkStyle}>Go back to list</Link></div>;
    }

    if (!component) {
        return <div style={infoMessageStyle}>Component data not found. <Link to="/inventory" style={linkStyle}>Go back to list</Link></div>;
    }

    // Render the form pre-filled with component data
    return (
        <div style={formContainerStyle}>
            <h2>Edit Component (ID: {component.id})</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="name" style={labelStyle}>Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={component.name || ''} // Use || '' to handle null/undefined safely
                        onChange={handleChange}
                        required
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label htmlFor="description" style={labelStyle}>Description:</label>
                    <textarea
                        id="description"
                        name="description"
                        value={component.description || ''}
                        onChange={handleChange}
                        style={{ ...inputStyle, minHeight: '60px' }}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="price" style={labelStyle}>Price:</label>
                    <input
                        type="number"
                        id="price"
                        name="unitPrice"
                        value={component.unitPrice}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        style={inputStyle}
                    />
                </div>
                <div>
                    <label htmlFor="quantity" style={labelStyle}>Quantity:</label>
                    <input
                        type="number"
                        id="quantity"
                        name="quantity"
                        value={component.availableStock}
                        onChange={handleChange}
                        required
                        min="0"
                        style={inputStyle}
                    />
                </div>
                <button type="submit" style={buttonStyle}>Update Component</button>
                <Link to="/inventory" style={cancelButtonStyle}>Cancel</Link>
            </form>

            {/* Display messages */}
            {message && (
                <p style={{ ...messageStyle, backgroundColor: isError ? '#ffe6e6' : '#e6ffe6', color: isError ? 'red' : 'green', border: `1px solid ${isError ? 'red' : 'green'}` }}>
                    {message}
                </p>
            )}
        </div>
    );
}

// --- Inline Styles (consider moving to CSS) ---
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

buttonStyle[':hover'] = {
    backgroundColor: '#0056b3',
};

const cancelButtonStyle = {
    ...buttonStyle, // Inherit button styles
    backgroundColor: '#6c757d', // Different color for cancel
    textDecoration: 'none', // Remove underline for Link
    textAlign: 'center',
    display: 'block', // Make it a block element
};
cancelButtonStyle[':hover'] = { backgroundColor: '#5a6268' }; // Placeholder for hover

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

export default EditComponentForm;