import React, { useState } from 'react';
import apiClient from '../../api/axiosConfig'; // Your configured Axios instance
import { useNavigate } from 'react-router-dom';

function AddQuotationForm() {
  const [quotation, setQuotation] = useState({
    customerName: '',
    items: [], // Quotations often have items. We'll simplify for now.
    totalAmount: 0,
    status: 'Draft' // Default status
  });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setQuotation(prevQuotation => ({
      ...prevQuotation,
      [name]: type === 'number' ? parseFloat(value) : value // Parse numbers for numeric inputs
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(''); // Clear previous messages
    setIsError(false);

    try {
      // API call to add a new quotation
      const response = await apiClient.post('http://localhost:5072/api/Quotations', quotation);

      if (response.status === 201 || response.status === 200) {
        setMessage('Quotation added successfully! 🎉');
        setIsError(false);
        // Clear the form after successful submission
        setQuotation({ customerName: '', items: [], totalAmount: 0, status: 'Draft' });
        // Redirect to the quotations list after a short delay
        setTimeout(() => navigate('/quotations'), 1500);
      } else {
        setMessage('Failed to add quotation. Status: ' + response.status);
        setIsError(true);
      }
    } catch (err) {
      console.error("Error adding quotation:", err);
      setMessage('Error adding quotation: ' + (err.response?.data?.title || err.message));
      setIsError(true);
    }
  };

  return (
    <div style={formContainerStyle}>
      <h2>Add New Quotation</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <div>
          <label htmlFor="customerName" style={labelStyle}>Customer Name:</label>
          <input
            type="text"
            id="customerName"
            name="customerName"
            value={quotation.customerName}
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
            value={quotation.status}
            onChange={handleChange}
            style={inputStyle}
          >
            <option value="Draft">Draft</option>
            <option value="Sent">Sent</option>
            <option value="Accepted">Accepted</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>
        {/*
          You'd typically add fields for 'items' array here if your quotation model
          includes line items. This might involve selecting existing inventory components.
        */}
        <button type="submit" style={buttonStyle}>Add Quotation</button>
      </form>

      {/* Display success or error messages */}
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
  boxSizing: 'border-box' // Ensures padding/border are included in width
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

const messageStyle = {
  padding: '10px',
  borderRadius: '4px',
  marginTop: '15px',
  textAlign: 'center'
};

export default AddQuotationForm;