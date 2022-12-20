import axios from 'axios';
import config from '../config';
function hasJwt(next) {
    let jwt;
    axios.get(config.backend_url + '/user/verify?' + document.cookie, config.withCookies)
        .then((val) => {
        console.log('ISVALID');
        console.log(val.data.isValid);
        if (val.data.isValid) {
            jwt = val.data.user;
            window.location.href = '/dashboard';
        }
    })
        .catch((err) => {
        if (err) {
            console.log(err);
        }
    })
        .then(() => next ? next(jwt) : {});
}
async function getUser() {
    const data = await axios.get(config.backend_url + '/user/verify?' + document.cookie, config.withCookies);
    return data.data.user;
}
export { hasJwt, getUser };
