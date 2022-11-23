import React, { useState } from 'react';
import Alert from 'react-bootstrap/Alert';

import './MAlert.css';


function MAlert(props) {
    return (
        <div className='toBeCentered'>
            <Alert variant={props.variant ? props.variant : 'info'} onClose={props.onClose} className='PAAlert' dismissible>
                <Alert.Heading>{props.text}</Alert.Heading>
            </Alert>
        </div>
    );
}

export default MAlert;
