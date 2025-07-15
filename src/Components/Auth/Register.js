import React, { useState } from 'react';
// We will import axios later in Step 6

function Register() {
    // 1. State Variables for Form Inputs
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState(''); // To display registration success/failure messages

    // 2. Handle Input Changes (similar to Login.js)
    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    // 3. Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage('Registering...'); // Immediate feedback

        console.log('Attempting registration with:', { username, email, password });

        // IMPORTANT: The actual API call will go here in Step 6
        // For now, let's simulate a delay:
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Simulate a successful registration for testing UI
        if (username && email && password && password.length >= 6) { // Basic client-side validation
            setMessage('Registration successful! (Simulated)');
            setUsername(''); // Clear form
            setEmail('');    // Clear form
            setPassword(''); // Clear form
        } else {
            setMessage('Simulated Registration failed. Please fill all fields and ensure password is at least 6 characters.');
        }
    };

    // 4. JSX (UI) for the Registration Form
    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="reg-username" style={{ display: 'block', marginBottom: '5px' }}>Username:</label>
                    <input
                        type="text"
                        id="reg-username"
                        value={username}
                        onChange={handleUsernameChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="reg-email" style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email" // Use type="email" for email validation hints
                        id="reg-email"
                        value={email}
                        onChange={handleEmailChange}
                        required
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="reg-password" style={{ display: 'block', marginBottom: '5px' }}>Password:</label>
                    <input
                        type="password"
                        id="reg-password"
                        value={password}
                        onChange={handlePasswordChange}
                        required
                        minLength="6" // Basic HTML5 validation hint
                        style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ddd' }}
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white',
                        border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '16px'
                    }}
                >
                    Register
                </button>
            </form>
            {message && <p style={{ marginTop: '15px', color: message.includes('failed') ? 'red' : 'green' }}>{message}</p>}
        </div>
    );
}

export default Register; // Export the component