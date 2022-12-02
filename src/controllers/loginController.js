import axios from 'axios';
import sha256 from 'crypto-js/sha256.js';

import config from '../config.js';


function transport(info, callbackFn, catchFn, next) {
    let { email, password } = info;

    // SHA-2 hash for transport
    const hashedPassword = sha256(password).toString();
    password = undefined;

    // Verify user exists and is authenticated
    axios.post(config.backend_url + 'user/exists', { email, hashedPassword })
    .then((val) => callbackFn(val.data.exists))
    .catch((err) => catchFn(err))  // A status of 400 should hopefully throw an error
    .then(() => next());
}

export default transport;
