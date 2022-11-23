import axios from 'axios';
import { useState } from "react";
import sha256 from 'crypto-js/sha256';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import './Login.css'
import config from '../../config';
import MAlert from '../MAlert/MAlert';


function Login(props) {
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    var [errorMsg, setErrorMsg] = useState('');
    var [successMsg, setSuccessMsg] = useState('Not Logged On');

    const didTapSubmit = () => {
        const hashedPassword = sha256(password).toString();
        password = undefined;
    
        // Verify user exists and is authenticated
        axios.post(config.backend_url + 'user/exists', { email, hashedPassword })
        .then((val) => {
            const result = val.data;
            console.log(result);
            if (result.exists) {
                // User logged in successfully
                setSuccessMsg('Logged In!');
            } else {
                setErrorMsg('User does not exist.');
            }
        }).catch(err => setErrorMsg(err.response.data.error));
    }

    return (
        <div align='center' className='login app-sub-component'>
            <h1>Login</h1>
            <p className='error-message'>{ errorMsg }</p>
            <Form onClick={ () => setSuccessMsg('') } onChange={ () => setErrorMsg('') } onKeyDown={(e) => {
                if (e.key == 'Enter') didTapSubmit();
            }}>
                <Form.Control onChange={(e) => setEmail(e.target.value)} className='email-field login-field' placeholder='Email' type='email' />
                <Form.Control onChange={(e) => setPassword(e.target.value)} className='password-field login-field' placeholder='Password' type='password' />
                <Button onClick={ () => {
                    didTapSubmit();
                }}>Submit</Button>
            </Form>
            <br /><h2 className='loggedin-message'>{ successMsg }</h2>
        </div>
    );
}




export default Login;
