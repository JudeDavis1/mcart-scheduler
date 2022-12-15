import axios from 'axios';
import sha256 from 'crypto-js/sha256.js';

import config from '../config.js';




function hasJwt(next) {
    let jwtValid = false;
    axios.get(config.backend_url + '/user/verify', config.withCookies)
    .then((val) => {
        // User MAY have an account
        if (val.data.isValid) {
            // User DOES have an account
            // TODO:
            console.log("User IS VALID");
            window.location = '/dashboard'
        }
        jwtValid = val.data.isValid;
    })
    .catch((err) => {
        // User definitely does not have an account
        if (err) console.log(err);
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

    // SHA-2 hash for transport
    const hashedPassword = sha256(password).toString();
    password = undefined;  // If memory is dumped, password will not show xD
    
    axios.post(config.backend_url + 'user/exists', { email, hashedPassword }, config.withCookies)
    .then((val) => {
        if (val.data.exists) {
            // User logged in successfully
            setStatus('success');
            setMsg('Logged In!');
            hasJwt();
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
    transport,
    hasJwt
};
