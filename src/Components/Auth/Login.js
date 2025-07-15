import React, { useState } from 'react';
import axios from 'axios'; // <-- Add this import

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('Logging in...');

        try {
            // IMPORTANT: Replace 'https://localhost:7001' with the actual URL/port of YOUR running TechFix.AuthService
            // The endpoint should match what you defined in your AuthService's LoginController (e.g., /api/Auth/login or /api/Users/login)
            const response = await axios.post('https://localhost:7001/api/Auth/login', { // <-- Adjust this URL
                username,
                password
            });

            // Assuming your backend sends back a response with a 'token' field
            const token = response.data.token;
            if (token) {
                localStorage.setItem('jwtToken', token); // Store the token (for next step: Step 7)
                setMessage('Login successful!');
                // Optional: Clear form fields after successful login
                setUsername('');
                setPassword('');
                // Optional: Redirect user to a dashboard or home page
                // import { useNavigate } from 'react-router-dom';
                // const navigate = useNavigate();
                // navigate('/dashboard');
            } else {
                setMessage('Login successful, but no token received.');
            }

        } catch (error) {
            // Handle different types of errors
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx (e.g., 400, 401, 404, 500)
                console.error('Login error:', error.response.data);
                setMessage('Login failed: ' + (error.response.data.message || error.response.statusText || 'Unknown error'));
            } else if (error.request) {
                // The request was made but no response was received
                console.error('Login error: No response from server', error.request);
                setMessage('Login failed: No response from server. Check if backend is running.');
            } else {
                // Something else happened while setting up the request
                console.error('Login error:', error.message);
                setMessage('Login failed: ' + error.message);
            }
        }
    };

    // Rest of your component's JSX remains the same
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white',
                        border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px'
                    }}
                >
                    Login
                </button>
            </form>
            {message && <p style={{ marginTop: '15px', color: message.includes('failed') ? 'red' : 'green' }}>{message}</p>}
        </div>
    );
}

export default Login;