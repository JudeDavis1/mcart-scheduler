import axios from 'axios';

import config from '../config';
import { IUser } from '../backend/models/userModel';


function hasJwt(next: Function=() => {}, redirect: boolean=true) {
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
            if (redirect)
                window.location.href = '/dashboard';
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


async function getUser(): Promise<IUser> {
    hasJwt((jwt: string) => {

    }, false);
    const request = await axios.get(
        config.backend_url + '/user/verify?' + document.cookie,
        config.withCookies  // Just in case of cookie HTTPS errors
    );
    
    return request.data.user;
}

// Update JWT with new user data
// Can only be run if the current id in the jwt is valid
// Otherwise, issue a new one
async function updateUser() {
    const currentUser = await getUser();
    const request = await axios.post(
        config.backend_url + "/user/updateJwt",
        {userId: currentUser._id}
    );
    document.cookie = "jwt=" + request.data.token;
}

function deleteJwt() {
    document.cookie = "jwt=; max-age=0";
}


export {
    hasJwt,
    getUser,
    updateUser,
    deleteJwt
};