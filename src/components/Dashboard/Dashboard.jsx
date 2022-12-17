import React, { useState } from "react";

import { getUserInfo } from "../../controllers/dashboardController";


function Dashboard() {
    const [name, setName] = useState('');
    getUserInfo().then((val) => setName(val.name));

    return (
        <div className="Dashboard app-sub-component">
            <h1 align="center">Dashboard for: {name}</h1>
        </div>
    );
}


export default Dashboard;