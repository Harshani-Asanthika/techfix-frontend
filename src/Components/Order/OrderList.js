import React, { useEffect, useState } from 'react';
import apiClient from '../../api/axiosConfig';
import { Link } from 'react-router-dom';

function OrderList() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState('');

    const fetchOrders = async () => {
        try {
            // CHANGE THIS LINE: Update the URL to use https://localhost:7230
            const response = await apiClient.get('https://localhost:7230/api/Orders'); // <-- UPDATED URL
            setOrders(response.data);
            setLoading(false);
            setMessage('');
        } catch (err) {
            console.error("Failed to fetch orders:", err);
            setError("Failed to load orders. " + (err.response?.data?.title || err.message));
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this order? This action cannot be undone.")) {
            try {
                // CHANGE THIS LINE: Update the URL to use https://localhost:7230
                const url = `https://localhost:7230/api/Orders/${id}`; // <-- UPDATED URL
                const response = await apiClient.delete(url);

                if (response.status === 204) {
                    setMessage('Order deleted successfully! ✅');
                    setOrders(orders.filter(order => order.id !== id));
                } else {
                    setMessage('Failed to delete order. Status: ' + response.status);
                }
            } catch (err) {
                console.error(`Error deleting order with ID ${id}:`, err);
                setMessage('Error deleting order: ' + (err.response?.data?.title || err.message));
            }
            setTimeout(() => setMessage(''), 3000);
        }
    };


    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#007bff' }}>
                <p>Loading orders...</p>
                <div style={{ border: '4px solid rgba(0, 0, 0, 0.1)', borderTop: '4px solid #007bff', borderRadius: '50%', width: '30px', height: '30px', animation: 'spin 1s linear infinite', margin: '10px auto' }}></div>
                <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); }}`}</style>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: 'red', border: '1px solid red', borderRadius: '8px', backgroundColor: '#ffe6e6' }}>
                <p>Error loading orders:</p>
                <p>{error}</p>
                <p>Please ensure the Order Service backend is running and accessible.</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div style={{ padding: '20px', textAlign: 'center', color: '#555' }}>
                <p>No orders found.</p>
                <p>You can add new orders later.</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '1000px', margin: '50px auto', padding: '20px', border: '1px solid #eee', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
            <h2>Order List</h2>
            {message && (
                <p style={{ ...messageStyle, backgroundColor: message.includes('Error') ? '#ffe6e6' : '#e6ffe6', color: message.includes('Error') ? 'red' : 'green' }}>
                    {message}
                </p>
            )}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={tableHeaderStyle}>ID</th>
                        <th style={tableHeaderStyle}>Customer ID</th>
                        <th style={tableHeaderStyle}>Order Date</th>
                        <th style={tableHeaderStyle}>Total Amount</th>
                        <th style={tableHeaderStyle}>Status</th>
                        <th style={tableHeaderStyle}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {orders.map(order => (
                        <tr key={order.id} style={{ borderBottom: '1px solid #ddd' }}>
                            <td style={tableCellStyle}>{order.id}</td>
                            <td style={tableCellStyle}>{order.customerId || 'N/A'}</td>
                            <td style={tableCellStyle}>{new Date(order.orderDate).toLocaleDateString() || 'N/A'}</td>
                            <td style={tableCellStyle}>${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}</td>
                            <td style={tableCellStyle}>{order.status || 'Pending'}</td>
                            <td style={tableCellStyle}>
                                <Link to={`/orders/${order.id}`} style={viewLinkStyle}>View</Link>
                                {' '}
                                <Link to={`/orders/edit/${order.id}`} style={editLinkStyle}>Edit</Link>
                                {' '}
                                <button onClick={() => handleDelete(order.id)} style={deleteButtonStyle}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

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

const viewLinkStyle = {
    display: 'inline-block',
    padding: '5px 10px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '4px',
    fontSize: '0.85em',
    transition: 'background-color 0.2s ease',
    marginRight: '5px',
};
viewLinkStyle[':hover'] = { backgroundColor: '#0056b3' };

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

export default OrderList;