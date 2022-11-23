import axios from 'axios';
import { useState } from "react";
import sha256 from 'crypto-js/sha256';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import './Login.css'
import config from '../../config';
import MAlert from '../MAlert/MAlert';


function Login() {
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');

    var [msg, setMsg] = useState('');
    var [status, setStatus] = useState('success');
    var [shouldShow, setShouldShow] = useState(false);

    const didTapSubmit = () => {
        if (!(email && password)) {
            setMsg('Please enter an Email and Password');
            setStatus('danger');
            setShouldShow(true);
            return;
        }

        const hashedPassword = sha256(password).toString();
        password = undefined;
    
        // Verify user exists and is authenticated
        axios.post(config.backend_url + 'user/exists', { email, hashedPassword })
        .then((val) => {
            const result = val.data;
            console.log(result);
            if (result.exists) {
                // User logged in successfully
                setMsg('Logged In!');
                setStatus('success');
            } else {
                setMsg('User does not exist.');
                setStatus('danger');
            }
        }).catch(err => {
            setMsg(err.response.data.error);
            setStatus('danger');
        });
        setShouldShow(true);
    }

    return (
        <div align='center' className='login app-sub-component'>
            <h1>Login</h1>
            <Form onClick={ () => setShouldShow(false) } onChange={ () => setMsg('') } onKeyDown={(e) => {
                if (e.key == 'Enter') didTapSubmit();
            }}>
                <Form.Control onChange={(e) => setEmail(e.target.value)} className='email-field login-field' placeholder='Email' type='email' />
                <Form.Control onChange={(e) => setPassword(e.target.value)} className='password-field login-field' placeholder='Password' type='password' />
                <Button onClick={() => didTapSubmit()} >Login</Button>
            </Form>
            <br />{ shouldShow && <MAlert variant={ status } onClose={() => setShouldShow(false)} text={ msg } /> }
        </div>
    );
}




export default Login;
