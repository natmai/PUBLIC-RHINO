import React, { useState } from 'react';
import { signIn } from '../firebase'; // Only import signIn as signUp is no longer needed

const FirebaseSecurityPage = ({ onAuthenticated }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async () => {
        try {
            await signIn(email, password);
            onAuthenticated(); // Callback to parent component to update auth state
        } catch (error) {
            setError('Login Failed: ' + error.message);
        }
    };

    return (
        <div>
            <h1>Login</h1>
            <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
            />
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
            />
            <button onClick={handleLogin}>Login</button>
            {error && <p>{error}</p>}
        </div>
    );
};

export default FirebaseSecurityPage;
