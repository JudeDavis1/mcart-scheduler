import axios from 'axios';
import sha256 from 'crypto-js/sha256.js';
import emailValidator from 'email-validator';
import { toTitleCase } from '../utils/strUtils';
import config from '../config.js';
function transport(info, setShouldSpin, setShouldShow, setStatus, setMsg) {
    let { firstName, lastName, email, password, userType, congregation } = info;
    window.scrollTo(window.scrollX, 0);
    if (isInvalid(info, setStatus, setShouldShow, setMsg)) {
        setShouldSpin(false);
        return;
    }
    const name = toTitleCase(firstName + ' ' + lastName);
    const hashedPassword = sha256(password).toString();
    password = '';
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
                window.location.href = '/login';
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
function isInvalid(info, setStatus, setShouldShow, setMsg) {
    let messages = [];
    if (info.password != info.retypedPassword)
        messages.push("Both passwords must be the same!");
    if (!Object.values(info).every((val) => val))
        messages.push("Please fill out all fields!");
    const isValid = emailValidator.validate(info.email);
    if (!isValid)
        messages.push("Invalid email!");
    if (messages.length > 0) {
        setStatus("danger");
        setShouldShow(true);
        setMsg(messages[0]);
        return true;
    }
    return false;
}
export default transport;
