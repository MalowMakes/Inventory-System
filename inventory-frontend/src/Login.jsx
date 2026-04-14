import React, { useState } from 'react';
import './Login.css';
import api from './api';
import Swal from 'sweetalert2';

const mySwalTheme = {
    background: '#222324',
    color: '#ffffff',
    confirmButtonColor: '#53b890',
    buttonsStyling: true,
    customClass: {
        popup: 'my-swal-popup',
        confirmButton: 'my-swal-button'
    }
};

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
            Swal.fire({
                ...mySwalTheme,
                title: 'Success',
                text: 'Logged in successfully!',
                icon: 'success'
            });
        } catch (error) {
            Swal.fire({
                ...mySwalTheme,
                title: 'Error',
                text: 'Invalid credentials',
                icon: 'error'
            }
            );
        }
    };

    return (
        <div className="login-container">
            <div className="login-welcome">
                <h1>Malow's Equipment Manager</h1>
            </div>
            <div className="login-card">
                <h1>Login</h1>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        name="input-username"
                        autoComplete='username'
                        placeholder="Username"
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                    />
                    <input
                        type="password"
                        name="input-password"
                        autoComplete='current-password'
                        placeholder="Password"
                        onChange={(e) => setUser({ ...user, password: e.target.value })}
                    />
                    <button type="submit" style={{ fontSize: '24px' }}>Sign In</button>
                </form>
            </div>
            <div className="login-footer">
                <p><strong>Demo Access:</strong></p>
                <div className="demo-creds">
                    <span>Admin: <code>admin / imtheboss</code></span>
                    <span>User: <code>user / password321</code></span>
                    <span>User2: <code>user2 / password321</code></span>
                </div>
            </div>
        </div>
    );
};

export default Login;