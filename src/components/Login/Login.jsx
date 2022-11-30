import axios from 'axios';
import { useState } from "react";
import sha256 from 'crypto-js/sha256';
import Grid from '@mui/material/Grid';
import Button from "@mui/material/Button";
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Spinner from 'react-bootstrap/Spinner';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';

import './Login.css';
import config from '../../config';
import MAlert from '../MAlert/MAlert';


const Item = styled(Paper)(({theme}) => ({
    color: theme.palette.text.secondary,
    padding: '20px',
    opacity: '1',
    zIndex: 1
}));
const darkTheme = createTheme({ palette: { mode: 'dark' } });

function Login() {
    var [email, setEmail] = useState('');
    var [password, setPassword] = useState('');
    
    var [msg, setMsg] = useState('');
    var [status, setStatus] = useState('success');
    var [shouldShow, setShouldShow] = useState(false);
    var [shouldSpin, setShouldSpin] = useState(false);

    const didTapSubmit = () => {
        setShouldSpin(true);
        if (!(email && password)) {
            setStatus('danger');
            setMsg('Please enter an Email and Password');

            // Show alert
            setShouldShow(true);

            // Stop spinning
            setShouldSpin(false);
            return;
        }

        // SHA-2 hash for transport
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
        }).then(() => {
            setShouldSpin(false);
            setShouldShow(true);
        });
    };

    const closeAlert = () => {
        setShouldShow(false);
    };

    return (
        <div align='center' className='login app-sub-component'>
            <ThemeProvider theme={darkTheme}>
            <Item className='Item' elevation={15}>
            <h1>Login</h1>
            <div className='login-form' onChange={ () => closeAlert() } onKeyDown={(e) => {
                if (e.key == 'Enter') didTapSubmit();
            }}>
                {shouldSpin && <Spinner animation="border" />}
                <br />{ shouldShow && <MAlert variant={ status } onClose={() => closeAlert()} text={ msg } /> }
                <Grid container spacing={2} direction={'column'}>
                    <Grid item><TextField onChange={(e) => setEmail(e.target.value)} className='email-field login-field' label='Email' type='email' /></Grid>
                    <Grid item><TextField onChange={(e) => setPassword(e.target.value)} className='password-field login-field' label='Password' type='password' /></Grid>
                    <Grid item>
                        <Button variant='contained' style={{padding: '10px', margin: "10px"}} onClick={ () => {
                            didTapSubmit();
                        }}>Submit</Button>
                    </Grid>
                </Grid>
            </div>
            </Item>
            </ThemeProvider>
            
        </div>
    );
}



export default Login;
