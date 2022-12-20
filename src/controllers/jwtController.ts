import axios from 'axios';

import config from '../config';


async function hasJwt(next: Function) {
    let jwt: any;
    axios.get(config.backend_url + '/user/verify', config.withCookies)
    .then((val) => {
        // User MAY have an account
        if (val.data.isValid) {
            // User DOES have an account
            // TODO:
            jwt = val.data.user;
            window.location.href = '/dashboard'
        }
    })
    .catch((err) => {
        // User definitely does not have an account
        if (err) console.log(err);
    })
    .then(() => next(jwt));
}

async function getUser(): Promise<any> {
    const data = await axios.get(config.backend_url + '/user/verify', config.withCookies);
    console.log(data.data.user);

    return data.data.user;
}

export {
    hasJwt,
    getUser
};