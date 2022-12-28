import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import './ViewUser.css';
import { getUserFromId } from '../../controllers/viewUserController';


function ViewUser(props) {
    const [userInfo, setUserInfo] = useState({});
    const [params, _] = useSearchParams();
    const id = params.get("id");

    useEffect(() => {
        (async function () {
            setUserInfo(await getUserFromId(id));
        })();
    }, []);

    return (
        <div className="ViewUser app-sub-component" align="center">
            <h1>{userInfo.name}</h1>
            <h3>{userInfo.userType}</h3>
        </div>
    );
}

export default ViewUser;
