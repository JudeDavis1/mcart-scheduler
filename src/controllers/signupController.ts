import axios from 'axios';
import sha256 from 'crypto-js/sha256.js';
import emailValidator from 'email-validator';
import { UserType } from '../backend/models/userModel.js';
import { toTitleCase } from '../utils/strUtils';

import config from '../config.js';


interface UserInfoSignup {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    retypedPassword: string;
    userType: UserType;
    congregation: string;
}

function transport(
    info: UserInfoSignup,
    setShouldSpin: Function,
    setShouldShow: Function,
    setStatus: Function,
    setMsg: Function
) {
    let { firstName, lastName, email, password, userType, congregation } = info;

    // Scroll to the top so user can see the alert
    window.scrollTo(window.scrollX, 0);
    if(isInvalid(info, setStatus, setShouldShow, setMsg)) {
        setShouldSpin(false);
        return;
    }

    // Prepare data for transport
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

function isInvalid(
    info: UserInfoSignup,
    setStatus: Function,
    setShouldShow: Function,
    setMsg: Function
) {
    let messages = [];

    // Validate params
    if (info.password != info.retypedPassword)
        messages.push("Both passwords must be the same!");

    // Check all fields are filled out
    if (!Object.values(info).every((val) => val))
        messages.push("Please fill out all fields!");

    // Check if email
    const isValid = emailValidator.validate(info.email);
    if (!isValid) messages.push("Invalid email!");

    // Check if there were any errors
    if(messages.length > 0){
        setStatus("danger");
        setShouldShow(true);
        setMsg(messages[0]);
        return true;
    }
    return false;
}

export default transport;
