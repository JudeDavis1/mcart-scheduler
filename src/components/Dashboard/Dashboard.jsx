import Card from "react-bootstrap/Card";
import React, { useState, useEffect } from "react";

import "./Dashboard.css";
import { getUserInfo } from "../../controllers/dashboardController";
import { useBootstrapPrefix } from "react-bootstrap/esm/ThemeProvider";


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
      <div className="dashboard-session-card-container">
        { info.sessions &&
          info.sessions.map((sessions) => {
            return (
              <Card className="dashboard-session-card">
                <Card.Body>
                  <Card.Title>Hello</Card.Title>
                  <Card.Text>Hello again</Card.Text>
                </Card.Body>
              </Card>
            );
          })
        }
      </div>
    </div>
  );
}


export default Dashboard;