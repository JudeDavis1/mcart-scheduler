import { useEffect, useState } from "react";
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Button from "@mui/material/Button";
import Spinner from 'react-bootstrap/Spinner';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import './Login.css';
import MAlert from '../MAlert/MAlert';
import { transport } from '../../controllers/loginController';
import { hasJwt } from "../../controllers/jwtController";
const Item = styled(Paper)(({ theme }) => ({
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
    useEffect(() => hasJwt(), []);
    const didTapSubmit = async () => {
        setShouldSpin(true);
        transport({ email, password }, setStatus, setMsg, setShouldShow, setShouldSpin);
    };
    return (<div align='center' className='login app-sub-component'>
			<ThemeProvider theme={darkTheme}>
			<Item className='Item' elevation={15}>
			<h1>Login</h1>
			<div className='login-form' onChange={() => setShouldShow(false)} onKeyDown={(e) => {
            if (e.key == 'Enter')
                didTapSubmit();
        }}>
				{shouldSpin && <Spinner animation="border"/>}
				<br />{shouldShow && <MAlert variant={status} onClose={() => setShouldShow(false)} text={msg}/>}
				<Grid container spacing={2} direction={'column'}>
					<Grid item><TextField onChange={(e) => setEmail(e.target.value)} className='email-field login-field' label='Email' type='email'/></Grid>
					<Grid item><TextField onChange={(e) => setPassword(e.target.value)} className='password-field login-field' label='Password' type='password'/></Grid>
					<Grid item>
						<Button variant='contained' style={{ padding: '10px', margin: "10px" }} onClick={() => {
            didTapSubmit();
        }}>Submit</Button>
					</Grid>
				</Grid>
			</div>
			</Item>
			</ThemeProvider>
		</div>);
}
export default Login;
