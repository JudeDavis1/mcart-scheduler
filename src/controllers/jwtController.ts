import axios from 'axios';

import config from '../config';


function hasJwt(next: Function) {
    let jwt: any;
    axios.get(
        config.backend_url + '/user/verify?' + document.cookie,
        config.withCookies
    )
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
        if (err) {
            console.log(err);
        }
    })
    .then(() => next ? next(jwt) : {});
}

async function getUser(): Promise<any> {
    const request = await axios.get(
        config.backend_url + '/user/verify?' + document.cookie,
        config.withCookies  // Just in case of cookie HTTPS errors
    );
    return request.data.user;
}

export {
    hasJwt,
    getUser
};