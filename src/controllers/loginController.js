import axios from 'axios';
import sha256 from 'crypto-js/sha256.js';

import config from '../config.js';


const withCookies = { withCredentials: true, credentials: 'include' };

function hasJwt() {
    axios.get(config.backend_url + '/user/verify', withCookies)
    .then((val) => {
        // User MAY have an account
        if (val.data.isValid) {
            // User DOES have an account
            // TODO:
            console.log("User IS VALID");
            window.location = '/dashboard'
        }
    })
    .catch((err) => {
        // User definitely does not have an account
        if (err) console.log(err);
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

    // SHA-2 hash for transport
    const hashedPassword = sha256(password).toString();
    password = undefined;  // If memory is dumped, password will not show xD

    // Verify user exists and is authenticated
    axios.post(config.backend_url + 'user/exists', { email, hashedPassword }, withCookies)
    .then((val) => {
        if (val.data.exists) {
            // User logged in successfully
            setStatus('success');
            setMsg('Logged In!');
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
