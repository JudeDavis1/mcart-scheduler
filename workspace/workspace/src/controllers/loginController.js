import axios from 'axios';
import sha256 from 'crypto-js/sha256.js';
import config from '../config.js';
function transport(info, callbackFn, catchFn, next) {
    let { email, password } = info;
    const hashedPassword = sha256(password).toString();
    password = undefined;
    axios.post(config.backend_url + 'user/exists', { email, hashedPassword })
        .then((val) => callbackFn(val.data.exists))
        .catch(() => catchFn())
        .then(() => next());
}
export default transport;
