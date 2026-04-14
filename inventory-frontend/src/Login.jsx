import React, { useState } from 'react';
import api from './api';
import Swal from 'sweetalert2';

const Login = ({ setAuth, setFirstName }) => {
    const [user, setUser] = useState({ username: '', password: '' });

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/auth/login', {
                username: user.username,
                password: user.password
            });

            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', response.data.username);
            localStorage.setItem('firstName', response.data.firstName);
            localStorage.setItem('role', response.data.role);

            setFirstName(response.data.firstName);

            setAuth(true); // Tell the main App we are logged in
            Swal.fire('Success', 'Logged in successfully!', 'success');
        } catch (error) {
            Swal.fire('Error', 'Invalid credentials', 'error');
        }
    };

    return (
        <div className="login-container">
            <h1>Equipment Login</h1>
            <form onSubmit={handleLogin}>
                <input
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUser({ ...user, username: e.target.value })}
                />
                <input
                    type="password"
                    placeholder="Password"
                    onChange={(e) => setUser({ ...user, password: e.target.value })}
                />
                <button type="submit" style={{ fontSize: '24px' }}>Login</button>
            </form>
        </div>
    );
};

export default Login;