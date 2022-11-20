
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import './Login.css'


function Login(props) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    return (
        <div align='center' className='login app-sub-component'>
            <h1>Login</h1>
            <Form onKeyDown={(e) => {
                if (e.key == 'Enter') didTapSubmit(email, password);
            }}>
                <Form.Control onChange={(e) => setEmail(e.target.value)} className='email-field login-field' placeholder='Email' />
                <Form.Control onChange={(e) => setPassword(e.target.value)} className='password-field login-field' placeholder='Password' />
                <Button onClick={ () => didTapSubmit(email, password) }>Submit</Button>
            </Form>
        </div>
    );
}

const didTapSubmit = (email, password) => {
    console.log(email, password);
}


export default Login;
