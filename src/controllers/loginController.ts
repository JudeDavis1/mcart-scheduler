import axios from 'axios';
import sha256 from 'crypto-js/sha256.js';

import config from '../config.js';
import { hasJwt } from './jwtController';


interface UserInfoLogin {
    email: string,
    password: string
}

function transport(
    info: UserInfoLogin,
    setStatus: Function,
    setMsg: Function,
    setShouldShow: Function,
    setShouldSpin: Function
) {
    if (!(info.email && info.password)) {
        setStatus('danger');
        setMsg('Please enter an Email and Password');
        setShouldShow(true);
        setShouldSpin(false);
        return;
    }
    let { email, password } = info;

    // SHA-2 hash for transport
    const hashedPassword = sha256(password).toString();
    password = '';  // If memory is dumped, password will not show xD
    
    axios.post(config.backend_url + 'user/exists', { email, hashedPassword }, config.withCookies)
    .then((val) => {
        if (val.data.exists) {
            // User logged in successfully
            document.cookie = "jwt=" + val.data.token;
            setStatus('success');
            setMsg('Logged In!');
            hasJwt(() => {});
        } else {
            setStatus("danger");
            setMsg("The details seem incorrect. Please try again");
        }
    })

    .catch((err) => {
        // A status of 400 should hopefully throw an error
        setStatus('danger');
        setMsg(err.response.data.error);
    })

    .then(() => {
        // After all of the above are completed
        setShouldShow(true);
        setShouldSpin(false);
    });
}

export {
    transport
};
