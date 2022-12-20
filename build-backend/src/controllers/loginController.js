import axios from 'axios';
import sha256 from 'crypto-js/sha256.js';
import config from '../config.js';
import { hasJwt } from './jwtController';
function transport(info, setStatus, setMsg, setShouldShow, setShouldSpin) {
    if (!(info.email && info.password)) {
        setStatus('danger');
        setMsg('Please enter an Email and Password');
        setShouldShow(true);
        setShouldSpin(false);
        return;
    }
    let { email, password } = info;
    const hashedPassword = sha256(password).toString();
    password = '';
    axios.post(config.backend_url + 'user/exists', { email, hashedPassword }, config.withCookies)
        .then((val) => {
        document.cookie = "jwt=" + val.data.token;
        if (val.data.exists) {
            console.log('setting');
            setStatus('success');
            setMsg('Logged In!');
            hasJwt(() => { });
        }
        else {
            setStatus("danger");
            setMsg("The details seem incorrect. Please try again");
        }
    })
        .catch((err) => {
        setStatus('danger');
        setMsg(err.response.data.error);
    })
        .then(() => {
        setShouldShow(true);
        setShouldSpin(false);
    });
}
export { transport };
