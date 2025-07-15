import React, { useState } from 'react';
import apiClient from '../../api/axiosConfig'; // Your configured Axios instance
import { useNavigate } from 'react-router-dom'; // To redirect after successful submission

function AddOrderForm() {
    // State to hold the form data for a new order
    const [order, setOrder] = useState({
        customerId: '', // Assuming a simple string ID for customer
        totalAmount: 0,
        status: 'Pending', // Default status
        // orderDate will likely be set on the backend
        // orderItems will be more complex to add here directly
    });
    const [message, setMessage] = useState(''); // For success or error messages
    const [isError, setIsError] = useState(false); // To style messages
    const navigate = useNavigate(); // Hook to programmatically navigate

    // Handle input changes and update the state
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setOrder(prevOrder => ({
            ...prevOrder,
            [name]: type === 'number' ? parseFloat(value) : value // Parse numbers if input type is 'number'
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior (page reload)
        setMessage(''); // Clear previous messages
        setIsError(false);

        try {
            // IMPORTANT: Ensure this URL matches your OrderService's POST endpoint
            // It should be https://localhost:7230/api/Orders
            const response = await apiClient.post('https://localhost:7230/api/Orders', order);

            if (response.status === 201 || response.status === 200) { // 201 Created is typical for POST
                setMessage('Order added successfully! 🎉');
                setIsError(false);
                // Optionally clear the form or redirect to the orders list
                setOrder({ customerId: '', totalAmount: 0, status: 'Pending' }); // Clear form
                setTimeout(() => navigate('/orders'), 1500); // Redirect to orders list after 1.5 seconds
            } else {
                // This block might not be hit if Axios throws an error for non-2xx status codes
                setMessage('Failed to add order. Status: ' + response.status);
                setIsError(true);
            }
        } catch (err) {
            console.error("Error adding order:", err);
            setMessage('Error adding order: ' + (err.response?.data?.title || err.message));
            setIsError(true);
        }
    };

    return (
        <div style={formContainerStyle}>
            <h2>Add New Order</h2>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                    <label htmlFor="customerId" style={labelStyle}>Customer ID:</label>
                    <input
                        type="text"
                        id="customerId"
                        name="customerId"
                        value={order.customerId}
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
                        value={order.totalAmount}
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
                        value={order.status}
                        onChange={handleChange}
                        style={inputStyle}
                    >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Completed">Completed</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
                {/*
          For adding order items (e.g., linking to inventory components),
          you would add more complex input fields or a sub-component here.
        */}
                <button type="submit" style={buttonStyle}>Add Order</button>
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

// --- Inline Styles (copy from AddComponentForm or AddQuotationForm, or use your CSS) ---
const formContainerStyle = {
    maxWidth: '600px', margin: '50px auto', padding: '20px',
    border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
    backgroundColor: '#fff',
};
const labelStyle = { display: 'block', marginBottom: '5px', fontWeight: 'bold', color: '#555' };
const inputStyle = {
    width: 'calc(100% - 22px)', padding: '10px', border: '1px solid #ccc',
    borderRadius: '4px', fontSize: '1em', boxSizing: 'border-box'
};
const buttonStyle = {
    padding: '12px 20px', backgroundColor: '#007bff', color: 'white', border: 'none',
    borderRadius: '5px', fontSize: '1em', cursor: 'pointer', marginTop: '10px',
    transition: 'background-color 0.3s ease',
};
buttonStyle[':hover'] = { backgroundColor: '#0056b3' };
const messageStyle = { padding: '10px', borderRadius: '4px', marginTop: '15px', textAlign: 'center' };

export default AddOrderForm;