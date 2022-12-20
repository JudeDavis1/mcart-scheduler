import axios from 'axios';
import sha256 from 'crypto-js/sha256.js';
import config from '../config.js';
function hasJwt(next) {
    let jwtValid = false;
    axios.get(config.backend_url + '/user/verify', config.withCookies)
        .then((val) => {
        if (val.data.isValid) {
            console.log("User IS VALID");
            window.location.href = '/dashboard';
        }
        jwtValid = val.data.isValid;
    })
        .catch((err) => {
        if (err)
            console.log(err);
    })
        .then(() => next ? next(jwtValid) : {});
}
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
        if (val.data.exists) {
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
export { transport, hasJwt };
