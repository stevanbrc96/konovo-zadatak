import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function Login() {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError('');

        try {

            const response = await fetch('http://127.0.0.1:5000/api/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({username, password}),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('jwt', data.token);
                navigate('/products');
            } else {
                setError('Pogrešno korisničko ime ili lozinka.');
            }
        } catch (err) {
            setError('Došlo je do greške. Molimo pokušajte ponovo.');
            console.error('Greška pri prijavi:', err);
        }
    };

    return (
        <div style={{
            width: '300px',
            margin: '100px auto',
            padding: '2rem',
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
            borderRadius: '8px'
        }}>
            <form onSubmit={handleSubmit}>
                <h2 style={{textAlign: 'center'}}>Prijava</h2>

                <label htmlFor="username">Korisničko ime:</label>
                <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={{width: '100%', padding: '0.5rem', marginBottom: '1rem'}}
                />

                <label htmlFor="password">Lozinka:</label>
                <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={{width: '100%', padding: '0.5rem', marginBottom: '1rem'}}
                />

                <button type="submit" style={{width: '100%', padding: '0.7rem'}}>Prijavi se</button>

                {}
                {error && <p style={{color: 'red', textAlign: 'center', marginTop: '1rem'}}>{error}</p>}
            </form>
        </div>
    );
}

export default Login;