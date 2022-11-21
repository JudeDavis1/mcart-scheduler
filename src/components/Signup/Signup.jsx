import axios from 'axios';
import { useState } from "react";
import sha256 from 'crypto-js/sha256';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import './Signup.css';
import config from '../../config';


function Signup() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [congregation, setCongregation] = useState('');
    const [userType, setUserType] = useState('');
    

    return (
        <div align='center' className='signup app-sub-component'>
            <h1>Login</h1>
            <Form onKeyDown={(e) => {
                if (e.key == 'Enter') didTapSubmit(email, password);
            }}>
                <Form.Control onChange={(e) => setEmail(e.target.value)} className='email-field login-field' placeholder='Email' type='email' />
                <Form.Control onChange={(e) => setPassword(e.target.value)} className='password-field login-field' placeholder='Password' type='password' />
                <Button onClick={ () => didTapSubmit({ email, password, congregation, userType })}>Submit</Button>
            </Form>
            <br />
        </div>
    );
}

const didTapSubmit = (userInfo) => {
    const hashedPassword = sha256(password).toString();
    password = undefined;

    axios.post(config.backend_url + 'user/create', {
        userInfo.email,
        hashedPassword,
        
    })
}


export default Signup;
