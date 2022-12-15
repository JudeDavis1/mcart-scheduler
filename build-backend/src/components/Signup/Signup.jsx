import { useState } from "react";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Spinner from 'react-bootstrap/Spinner';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import './Signup.css';
import MAlert from '../MAlert/MAlert';
import transport from '../../controllers/signupController.js';
const Item = styled(Paper)(({ theme }) => ({
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
    var [shouldSpin, setShouldSpin] = useState(false);
    const didTapSubmit = () => {
        setShouldSpin(true);
        transport({
            firstName,
            lastName,
            email,
            password,
            retypedPassword,
            congregation,
            userType
        }, setShouldSpin, setShouldShow, setStatus, setMsg);
    };
    return (<div align='center' className='signup app-sub-component'>
			<ThemeProvider theme={darkTheme}>
			<Item className='paper-item' elevation={15}>
			<div className='signup-form' onKeyDown={(e) => {
            if (e.key == 'Enter')
                didTapSubmit(email, password);
        }} onChange={() => setShouldShow(false)}>
				<h1>Sign Up</h1>
				<br />
				{shouldSpin && <Spinner animation="border"/>}
				{shouldShow && <MAlert onClose={() => setShouldShow(false)} variant={status} text={msg}/>}
				<Grid container direction={'column'} spacing={2}>
					<Grid item><TextField onChange={(e) => setFirstName(e.target.value.trim())} className='firstname-field signup-field' variant='outlined' label='First Name'/></Grid>
					<Grid item><TextField onChange={(e) => setLastName(e.target.value.trim())} className='lastname-field signup-field' label='Last Name'/></Grid>
					<Grid item><TextField onChange={(e) => setEmail(e.target.value.trim())} className='email-field signup-field' label='Email' type='email'/></Grid>
					<Grid item><TextField onChange={(e) => setPassword(e.target.value)} className='password-field signup-field' label='Password' type='password'/></Grid>
					<Grid item><TextField onChange={(e) => setRetypedPassword(e.target.value)} className='retyped-password-field signup-field' label='Re-type password' type='password'/></Grid>
					<Grid item><TextField onChange={(e) => setCongregation(e.target.value.trim())} className='congregation-field signup-field' label='Congregation'/></Grid>

					<Grid item>
						<TextField select label='User Type' className="signup-field" input onChange={(e) => setUserType(e.target.value)} value={userType} variant='standard'>
							<MenuItem value="publisher">Publisher</MenuItem>
							<MenuItem value="congAdmin">Congregation Admin</MenuItem>
						</TextField>
					</Grid>
				<Grid item><Button variant='contained' onClick={() => didTapSubmit()}>Submit</Button></Grid>
				</Grid>
			</div>
			</Item>
			</ThemeProvider>
		</div>);
}
export default Signup;
