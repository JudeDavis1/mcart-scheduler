import axios from 'axios';
import { useState } from "react";
import sha256 from 'crypto-js/sha256';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import './Login.css';
import config from '../../config';
import MAlert from '../MAlert/MAlert';


function Login(props) {
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    
    var [msg, setMsg] = useState('');
    var [status, setStatus] = useState('success');
    var [shouldShow, setShouldShow] = useState(false);

    const didTapSubmit = () => {
        if (!(email && password)) {
            setStatus('danger');
            setMsg('Please enter an Email and Password');
            setShouldShow(true);
            return;
        }

        const hashedPassword = sha256(password).toString();
        password = undefined;
    
        // Verify user exists and is authenticated
        axios.post(config.backend_url + 'user/exists', { email, hashedPassword })
        .then((val) => {
            const result = val.data;
            if (result.exists) {
                // User logged in successfully
                setStatus('success');
                setMsg('Logged In!');
            } else {
                setStatus("danger");
                setMsg("The details seem incorrect. Please try again");
            }
        }).catch(err => {
            // A status of 400 should hopefully throw an error
            setStatus('danger');
            setMsg(err.response.data.error);
        });
        setShouldShow(true);
    };

    const closeAlert = () => {
        setShouldShow(false);
    };

    return (
        <div align='center' className='login app-sub-component'>
            <h1>Login</h1>
            <Form onChange={ () => closeAlert() } onKeyDown={(e) => {
                if (e.key == 'Enter') didTapSubmit();
            }}>
                <br />{ shouldShow && <MAlert variant={ status } onClose={() => closeAlert()} text={ msg } /> }
                <Form.Control onChange={(e) => setEmail(e.target.value)} className='email-field login-field' placeholder='Email' type='email' />
                <Form.Control onChange={(e) => setPassword(e.target.value)} className='password-field login-field' placeholder='Password' type='password' />
                <Button onClick={ () => {
                    didTapSubmit();
                }}>Submit</Button>
            </Form>
            
        </div>
    );
}




export default Login;
