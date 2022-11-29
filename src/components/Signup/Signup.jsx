import axios from 'axios';
import { useState } from "react";
import sha256 from 'crypto-js/sha256';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import emailValidator from 'email-validator';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
// import Button from "react-bootstrap/Button";

import './Signup.css';
import config from '../../config';
import MAlert from '../MAlert/MAlert';


const Item = styled(Paper)(({theme}) => ({
    color: theme.palette.text.secondary,
    padding: '20px',
    opacity: '1',
    zIndex: '1 !important'
}));
const darkTheme = createTheme({ palette: { mode: 'dark' } });

function Signup() {
    var [firstName, setFirstName] = useState('');
    var [lastName, setLastName] = useState('');
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    var [retypedPassword, setRetypedPassword] = useState('');
    var [congregation, setCongregation] = useState('');
    var [userType, setUserType] = useState('');

    var [msg, setMsg] = useState('');
    var [status, setStatus] = useState('success');
    var [shouldShow, setShouldShow] = useState(false);

    const isInvalid = () =>{
        let messages = [];

        // Validate params
        if (password != retypedPassword) {
            messages.push("Both passwords must be the same!");
        }

        // Check all fields are filled out
        if (!(email && password && retypedPassword && congregation && userType && firstName && lastName)) {
            messages.push("Please fill out all fields!");
        }

        // Check if email
        const isValid = emailValidator.validate(email);
        if (!isValid) {
            messages.push("Invalid email!");
        }

        if(messages.length > 0){
            setStatus("danger");
            setShouldShow(true);
            setMsg(messages[0]);
            return true;
        }
        return false;
    }

    const didTapSubmit = () => {
        // Scroll to the top so user can see the alert
        window.scrollTo(window.scrollX, 0);
        if(isInvalid()) return;

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
            if (val.status == 200) {
                setStatus('success');
                setMsg(val.data.data);

                setTimeout(() => {
                    window.location = '/login';
                }, 700);
            }
        }).catch((val) => {
            setStatus('danger');
            setMsg(val.response.data.error);
        });
        setShouldShow(true);
    }

    return (
        <div align='center' className='signup app-sub-component'>
            <ThemeProvider theme={darkTheme}>
            <Item className='paper-item' elevation={15} >
            <div className='signup-form' onKeyDown={(e) => {
                if (e.key == 'Enter') didTapSubmit(email, password);
            }} onChange={() => setShouldShow(false)}>
                <h1>Sign Up</h1>
                <Grid container direction={'column'} spacing={2}>
                    <br />
                    {shouldShow && <MAlert onClose={ () => setShouldShow(false) } variant={ status } text={ msg } />}

                    <Grid item><TextField onChange={(e) => setFirstName(e.target.value.trim())} className='firstname-field signup-field' variant='outlined' label='First Name' /></Grid>
                    <Grid item><TextField onChange={(e) => setLastName(e.target.value.trim())} className='lastname-field signup-field' label='Last Name' /></Grid>
                    <Grid item><TextField onChange={(e) => setEmail(e.target.value.trim())} className='email-field signup-field' label='Email' type='email' /></Grid>
                    <Grid item><TextField onChange={(e) => setPassword(e.target.value)} className='password-field signup-field' label='Password' type='password' /></Grid>
                    <Grid item><TextField onChange={(e) => setRetypedPassword(e.target.value)} className='retyped-password-field signup-field' label='Re-type password' type='password' /></Grid>
                    <Grid item><TextField onChange={(e) => setCongregation(e.target.value.trim())} className='congregation-field signup-field' label='Congregation' /></Grid>

                    <Grid item>
                        <TextField select label='User Type' className="signup-field" input onChange={(e) => setUserType(e.target.value)} value={userType} variant='standard'>
                            <MenuItem value="publisher">Publisher</MenuItem>
                            <MenuItem value="congAdmin">Congregation Admin</MenuItem>
                        </TextField >
                    </Grid>
                <Grid item><Button variant='contained' onClick={ () => didTapSubmit()}>Submit</Button></Grid>
                </Grid>
            </div>
            </Item>
            </ThemeProvider>
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
