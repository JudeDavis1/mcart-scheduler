import Card from "react-bootstrap/Card";
import { Add } from "@mui/icons-material";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Popover from "react-bootstrap/Popover";
import { DateTimePicker } from '@mui/x-date-pickers/';
import { Grid, MenuItem, TextField } from "@mui/material";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import "./Dashboard.css";
import { getUserInfo, didTapCreateAppointment } from "../../controllers/dashboardController";


const AppointmentCreationPopover = (data, hooks, didSubmit) => {
  return (
    <Popover>
      <Popover.Header>Create Appointment</Popover.Header>
      <Popover.Body style={{padding: "10px"}}>
        <Grid container spacing={2}>
          <Grid item><TextField label="place" onChange={(e) => hooks.setPlace(e.target.value)} /></Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                onChange={(value) => hooks.setTime(value.toDate().getTime())}
                label="Time"
                value={data.time}
                renderInput={(props) => <TextField {...props} />} />
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <TextField
              select
              defaultValue={2}
              style={{width: "250px"}}
              label="Number of publishers"
              onChange={(value) => {
                hooks.setNPublishers(value.target.value);
                // Clear the contents of the publisher name fields
                for (let i = 1; i < data.nPublishers; i++)
                {
                  const element = document.getElementById(`publisher-name${i}`);
                  element.value = '';
                }
              }}>
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
                return <MenuItem value={i}>{i}</MenuItem>
              })}
            </TextField>
          </Grid>
          {(() => {
            let publishers = [];
            for (let i = 1; i < data.nPublishers; i++) {
              publishers.push(
                <Grid item>
                  <TextField
                    id={`publisher-name${i}`}
                    onBlur={(e) => {
                      const newObj = data.members;
                      if (!e.target.value)
                        delete newObj[e.target.id];
                      newObj[e.target.id] = e.target.value;

                      e.target.value = newObj[e.target.id];
                      // Concat new values whilst removing duplicates
                      hooks.setMembers(newObj);
                    }}
                    className="publisher-name"
                    label={`Person ${i + 1}'s name`} />
                </Grid>
              );
            }
            return publishers;
          })()}
          <Grid item>
            <Button onClick={() => {
              const names = Object.values(data.members);
              didSubmit();
            }}>Create</Button>
          </Grid>
        </Grid>
      </Popover.Body>
    </Popover>
  );
};

function Dashboard() {
  const initialBtnState = (
    <>Appointment {<Add />}</>
  );

  const [nPublishers, setNPublishers] = useState(0);
  const [members, setMembers] = useState({});
  const [info, setInfo] = useState({});
  const [appointmentText, setAppointmentText] = useState(initialBtnState);
  const [place, setPlace] = useState('');
  const [time, setTime] = useState((() => {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    
    return date.getTime();
  })());

  // Load user data and fill 'info'
  useEffect(() => {
    async function load() {
      const userData = await getUserInfo();
      setInfo(userData);
    }
    load();
  }, []);
  useEffect(() => setMembers({}), [nPublishers]);

  return (
    <div className="Dashboard app-sub-component">
      <h1 align="center">{info.name}</h1><br />
      <OverlayTrigger
        trigger='click'
        overlay={AppointmentCreationPopover(
          {place, time, members, nPublishers},
          {setPlace, setTime, setMembers, setNPublishers},
          () => didTapCreateAppointment({place, members: Object.values(members), time}))
        }
        placement='bottom'
        onEnter={() => setAppointmentText('Cancel')}
        onExit={() => setAppointmentText(initialBtnState)}>
        <Button
          className="create-appointment-btn" onClick={() => setNPublishers(2)}>
          {appointmentText}
        </Button>
      </OverlayTrigger>

      <div className="dashboard-session-card-container">
        {info.sessions &&
          info.sessions.map((sessions) => {
            return (
              <Card className="dashboard-session-card">
                <Card.Body>
                  <Card.Title>Hello</Card.Title>
                  <Card.Text>Hello again</Card.Text>
                </Card.Body>
              </Card>
            );
          })}
      </div>
    </div>
  );
}

export default Dashboard;
