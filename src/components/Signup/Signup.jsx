import axios from 'axios';
import { useState } from "react";
import sha256 from 'crypto-js/sha256';
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

import './Signup.css';
import config from '../../config';


function Signup() {
    var [firstName, setFirstName] = useState('');
    var [lastName, setLastName] = useState('');
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    var [retypedPassword, setRetypedPassword] = useState('');
    var [congregation, setCongregation] = useState('');
    var [userType, setUserType] = useState('');
    
    var [errMsg, setErrMsg] = useState('');
    var [successMsg, setSuccessMsg] = useState('');

    const didTapSubmit = () => {
        // Validate params
        if (password != retypedPassword) {
            setErrMsg("Both passwords must be the same!");
            return;
        }

        // Check all fields are filled out
        if (!(email && password && retypedPassword && congregation && userType && firstName && lastName)) {
            setErrMsg("Please fill out all fields!");
        }

        // Prepare data for transport
        const name = toTitleCase(firstName + ' ' + lastName);
        const hashedPassword = sha256(password).toString();
        password = undefined;
    
        axios.post(config.backend_url + 'user/create', {
            name,
            email,
            hashedPassword,
            userType,
            congregation: toTitleCase(congregation)
        }).then((val) => {
            if (val.status == 200) setSuccessMsg(val.data.data);
            else setErrMsg(val.data.error);
        }).catch((val) => {
            setErrMsg(val.response.data.error);
        });
    }

    return (
        <div align='center' className='signup app-sub-component'>
            <h1>Signup</h1>
            <Form onKeyDown={(e) => {
                if (e.key == 'Enter') didTapSubmit(email, password);
            }} onChange={() => setErrMsg("")}>
                <p className="error-message">{ errMsg }</p>
                <Form.Control onChange={(e) => setFirstName(e.target.value.trim())} className='firstname-field login-field' placeholder='First Name' />
                <Form.Control onChange={(e) => setLastName(e.target.value.trim())} className='lastname-field login-field' placeholder='Last Name' />
                <Form.Control onChange={(e) => setEmail(e.target.value.trim())} className='email-field login-field' placeholder='Email' type='email' />
                <Form.Control onChange={(e) => setPassword(e.target.value)} className='password-field login-field' placeholder='Password' type='password' />
                <Form.Control onChange={(e) => setRetypedPassword(e.target.value)} className='retyped-password-field login-field' placeholder='Re-type password' type='password' />
                <Form.Control onChange={(e) => setCongregation(e.target.value.trim())} className='congregation-field login-field' placeholder='Congregation' />
                <Form.Select className="login-field" onChange={(e) => setUserType(e.target.value)}>
                    <option value="">Select the type of user you are:</option>
                    <option value="publisher">Publisher</option>
                    <option value="congAdmin">Congregation Admin</option>
                </Form.Select>
                <Button onClick={ () => didTapSubmit()}>Submit</Button>
            </Form>
            <br />
            <h2 className="success-message">{ successMsg }</h2>
            <br />
        </div>
    );
}

// Convert to title case e.g.
// hello, world => Hello, World
function toTitleCase(string) {
    const arr = string.split(' ');
    var newStr = [];

    for (var i = 0; i < arr.length; i++) {
        newStr.push(arr[i][0].toUpperCase() + arr[i].substring(1, arr[i].length));
    }

    return newStr.join(' ');
}


export default Signup;
