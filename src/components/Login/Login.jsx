import axios from 'axios';
import { useState } from "react";
import sha256 from 'crypto-js/sha256';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import './Login.css'
import config from '../../config';


function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isValid, setIsValid] = useState(false);

    return (
        <div align='center' className='login app-sub-component'>
            <h1>Login</h1>
            <Form onKeyDown={(e) => {
                if (e.key == 'Enter') didTapSubmit(email, password);
            }}>
                <Form.Control onChange={(e) => setEmail(e.target.value)} className='email-field login-field' placeholder='Email' type='email' />
                <Form.Control onChange={(e) => setPassword(e.target.value)} className='password-field login-field' placeholder='Password' type='password' />
                <Button onClick={ () => {
                    setIsValid(didTapSubmit(email, password));
                }}>Submit</Button>
            </Form>
            <br /><h2>{isValid ? "logged in" : "not logged in"}</h2>
        </div>
    );
}

const didTapSubmit = (email, password) => {
    const hashedPassword = sha256(password).toString();
    password = undefined;

    // Verify user exists and is authenticated
    axios.post(config.backend_url + 'user/exists', { email, hashedPassword })
    .then((val) => {
        const result = val.data;
        console.log(val.status);
        console.log(result);
    }).catch(err => console.log(err));
}


export default Login;
