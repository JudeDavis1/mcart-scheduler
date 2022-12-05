import axios from 'axios';
import sha256 from 'crypto-js/sha256.js';
import emailValidator from 'email-validator';
import config from '../config.js';
function transport(info, setShouldSpin, setShouldShow, setStatus, setMsg) {
    let { firstName, lastName, email, password, userType, congregation } = info;
    window.scrollTo(window.scrollX, 0);
    if (isInvalid(setStatus, setShouldShow, setMsg)) {
        setShouldSpin(false);
        return;
    }
    const name = toTitleCase(firstName + ' ' + lastName);
    const hashedPassword = sha256(password).toString();
    password = undefined;
    axios.post(config.backend_url + 'user/create', {
        name,
        email,
        hashedPassword,
        userType,
        congregation: toTitleCase(congregation)
    }).then((val) => {
        if (val.status == 200) {
            setStatus('success');
            setMsg(val.data.data);
            setTimeout(() => {
                window.location = '/login';
            }, 700);
        }
    }).catch((val) => {
        setStatus('danger');
        setMsg(val.response.data.error);
    }).then(() => {
        setShouldSpin(false);
        setShouldShow(true);
    });
}
function isInvalid(setStatus, setShouldShow, setMsg) {
    let messages = [];
    if (password != retypedPassword) {
        messages.push("Both passwords must be the same!");
    }
    if (!(email && password && retypedPassword && congregation && userType && firstName && lastName)) {
        messages.push("Please fill out all fields!");
    }
    const isValid = emailValidator.validate(email);
    if (!isValid) {
        messages.push("Invalid email!");
    }
    if (messages.length > 0) {
        setStatus("danger");
        setShouldShow(true);
        setMsg(messages[0]);
        return true;
    }
    return false;
}
function toTitleCase(string) {
    const arr = string.split(' ');
    var newStr = [];
    for (var i = 0; i < arr.length; i++) {
        newStr.push(arr[i][0].toUpperCase() + arr[i].substring(1, arr[i].length));
    }
    return newStr.join(' ');
}
export default transport;
