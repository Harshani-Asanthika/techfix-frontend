import React, { useState } from 'react';
import apiClient from '../../api/axiosConfig'; // Assuming axiosConfig.js is in src/api
import { useNavigate } from 'react-router-dom'; // To redirect after successful submission

function AddComponentForm() {
    // State to hold the form data for a new component
    const [component, setComponent] = useState({
        name: '',
        description: '',
        price: 0,
        availableStock: 0
    });
    const [message, setMessage] = useState(''); // For success or error messages
    const [isError, setIsError] = useState(false); // To style messages
    const navigate = useNavigate(); // Hook to programmatically navigate

    // Handle input changes and update the state
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setComponent(prevComponent => ({
            ...prevComponent,
            [name]: type === 'number' ? parseFloat(value) : value // Parse numbers if input type is 'number'
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)
        setMessage(''); // Clear previous messages
        setIsError(false);

        try {
            // IMPORTANT: Ensure this URL matches your InventoryService's POST endpoint
            // Based on your ComponentsController, it's https://localhost:7250/api/Components
            const response = await apiClient.post('https://localhost:7250/api/Components', component);

            if (response.status === 201 || response.status === 200) { // 201 Created is typical for POST
                setMessage('Component added successfully!');
                setIsError(false);
                // Optionally clear the form or redirect to the inventory list
                setComponent({ name: '', description: '', price: 0, quantity: 0 }); // Clear form
                setTimeout(() => navigate('/inventory'), 1500); // Redirect to inventory list after 1.5 seconds
            } else {
                // This block might not be hit if Axios throws an error for non-2xx status codes
                setMessage('Failed to add component. Status: ' + response.status);
                setIsError(true);
            }
        } catch (err) {
            console.error("Error adding component:", err);
            setMessage('Error adding component: ' + (err.response?.data?.title || err.message));
            setIsError(true);
        }
    };

    return (
        <div style={{ maxWidth: '600px', margin: '50px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2>Add New Inventory Component</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="name" style={labelStyle}>Name:</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={component.name}
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
                        value={component.description}
                        onChange={handleChange}
                        style={{ ...inputStyle, minHeight: '60px' }}
                    ></textarea>
                </div>
                <div>
                    <label htmlFor="price" style={labelStyle}>Price:</label>
                    <input
                        type="number"
                        id="Price"
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
                    <label htmlFor="availableStock" style={labelStyle}>Quantity:</label>
                    <input
                        type="number"
                        id="availableStock"
                        name="availableStock"
                        value={component.availableStock}
                        onChange={handleChange}
                        required
                        min="0"
                        style={inputStyle}
                    />
                </div>
                <button type="submit" style={buttonStyle}>Add Component</button>
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

// Inline styles (you can move these to a CSS file later)
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

const messageStyle = {
    padding: '10px',
    borderRadius: '4px',
    marginTop: '15px',
    textAlign: 'center'
};

export default AddComponentForm;