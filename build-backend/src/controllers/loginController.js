import axios from 'axios';
import sha256 from 'crypto-js/sha256.js';
import config from '../config.js';
const withCookies = { withCredentials: true, credentials: 'include' };
function hasJwt() {
    axios.get(config.backend_url + '/user/verify', withCookies)
        .then((val) => {
        if (val.data.isValid) {
            console.log("User IS VALID");
            window.location = '/dashboard';
        }
    })
        .catch((err) => {
        if (err)
            console.log(err);
    });
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
    password = undefined;
    axios.post(config.backend_url + 'user/exists', { email, hashedPassword }, withCookies)
        .then((val) => {
        if (val.data.exists) {
            setStatus('success');
            setMsg('Logged In!');
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
