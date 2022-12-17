import React, { useState, useEffect } from "react";

import { getUserInfo } from "../../controllers/dashboardController";


function Dashboard() {
    const [info, setInfo] = useState({});
    // Load user data and fill 'info'
    useEffect(() => async () => {
        const userData = await getUserInfo();
        setInfo(userData);
    }, []);

    return (
        <div className="Dashboard app-sub-component">
            <h1 align="center">{info.name}</h1>
        </div>
    );
}


export default Dashboard;