import axios from 'axios';
import config from '../config';
function hasJwt(next = () => { }, redirect = true) {
    let jwt;
    axios.get(config.backend_url + '/user/verify?' + document.cookie, config.withCookies)
        .then((val) => {
        if (val.data.isValid) {
            jwt = val.data.user;
            if (redirect)
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
    hasJwt((jwt) => {
    }, false);
    const request = await axios.get(config.backend_url + '/user/verify?' + document.cookie, config.withCookies);
    return request.data.user;
}
async function updateUser() {
    const currentUser = await getUser();
    const request = await axios.post(config.backend_url + "/user/updateJwt", { userId: currentUser._id });
    document.cookie = "jwt=" + request.data.token;
}
function deleteJwt() {
    document.cookie = "jwt=; max-age=0";
}
export { hasJwt, getUser, updateUser, deleteJwt };
