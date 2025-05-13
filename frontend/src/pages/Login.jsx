import { useState } from "react";
import { useLogin } from "../hooks/useLogin";
import { Link } from 'react-router-dom';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [visibility, setVisibility] = useState('visibility_off');
    const [type, setType] = useState('password');
    const { login, error, isLoading } = useLogin();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmail('');
        setPassword('');

        await login(email, password);
    }

    const handleVisibility = (e) => {
        if (e.target.innerText === 'visibility') {
            setVisibility('visibility_off')
            setType('password');
        } else {
            setVisibility("visibility");
            setType('text');
        }
    }

    return (
        <div className="login-container">
            <form className="login" onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        email
                    </span>
                    <input
                        autoComplete="email"
                        id="login-email"
                        type="text"
                        onChange={(e) => { setEmail(e.target.value) }}
                        value={email}
                        required
                        placeholder="Enter your email"
                    />
                </div>
                <div className="input-box">
                    <span className="material-symbols-outlined material-symbols-filled col-primary">
                        lock
                    </span>
                    <input
                        id="login-password"
                        type={type}
                        onChange={(e) => { setPassword(e.target.value) }}
                        value={password}
                        required
                        className="input-90-width"
                        placeholder="Enter your password"
                        autoComplete="current-password"
                    />
                    <span className="material-symbols-outlined col-primary" onClick={handleVisibility}>
                        {visibility}
                    </span>
                </div>
                <button disabled={isLoading} className={`primary-styled-button ${isLoading && 'loading-anim'}`}>Log in &nbsp; &rarr;</button>
                {error && <div className="error">{error}</div>}
                <span>
                    Not have an account? <Link to='/signup'>Register</Link>
                </span>
            </form>
        </div>
    )
}

export default Login;