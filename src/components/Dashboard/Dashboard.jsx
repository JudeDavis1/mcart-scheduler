import Card from "react-bootstrap/Card";
import { Add, Delete } from "@mui/icons-material";
import Button from "react-bootstrap/Button";
import { useState, useEffect } from "react";
import Popover from "react-bootstrap/Popover";
import { DateTimePicker } from '@mui/x-date-pickers/';
import { Grid, MenuItem, TextField } from "@mui/material";
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import Spinner from "react-bootstrap/Spinner";

import "./Dashboard.css";
import { getUserInfo, didTapCreateAppointment, loadSessions, deleteSessionItem } from "../../controllers/dashboardController";


function Dashboard() {
  const initialBtnState = (
    <>Appointment {<Add />}</>
  );

  const [nPublishers, setNPublishers] = useState(0);
  const [members, setMembers] = useState({});
  const [info, setInfo] = useState({});
  const [appointmentText, setAppointmentText] = useState(initialBtnState);
  const [place, setPlace] = useState('');
  const [currentSessions, setCurrentSessions] = useState([{}]);
  const [time, setTime] = useState((() => {
    const date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    
    return date.getTime();
  })());
  const [sessionsLoaded, setSessionsLoaded] = useState(false);

  // Load user data and fill 'info'
  useEffect(() => {
    (async function load() {
      const userData = await getUserInfo();
      setInfo(userData);
    }());
  }, []);

  useEffect(() => {
    (async function () {
      const sessionObjects = await loadSessions(info);
      setCurrentSessions(sessionObjects);
      setSessionsLoaded(true);
    }());
  }, [info]);
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
        {!sessionsLoaded && <Spinner animation="border" color="#FFFFFF" />}
        {sessionsLoaded &&
          currentSessions.map((session, sessionIdx) => {
            const time = new Date(session.time);
            const months = ["Jan", "Feb", "March", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
            return (
              <Card className="dashboard-session-card" id={`session-card-${sessionIdx}`}>
                <Delete onClick={() =>deleteSessionItem(currentSessions[sessionIdx]._id)} />
                <Card.Body>
                  <Card.Subtitle>{`${time.getDate()} ${months[time.getMonth()]} ${time.getFullYear()}`}</Card.Subtitle>
                  <Card.Text>{session.place}</Card.Text>
                  {session.members.map((user) => <Card.Text>{user.name}</Card.Text>)}
                </Card.Body>
              </Card>
            );
          })}
      </div>
    </div>
  );
}

const AppointmentCreationPopover = (data, hooks, didSubmit) => {
  return (
    <Popover>
      <Popover.Header>Create Appointment</Popover.Header>
      <Popover.Body style={{padding: "10px"}}>
        <Grid container spacing={2}>
          <Grid item><TextField label="Location" onChange={(e) => hooks.setPlace(e.target.value)} /></Grid>
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
          {publisherNameFields(data, hooks)}
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

const publisherNameFields = (data, hooks) => {
  let publishers = [];
  for (let i = 1; i < data.nPublishers; i++) {
    publishers.push(
      <Grid item>
        <TextField
          id={`publisher-name${i}`}
          onBlur={(event) => onOutOfFocus(event, data, hooks)}
          className="publisher-name"
          label={`Person ${i + 1}'s name`} />
      </Grid>
    );
  }
  return publishers;
};

// When the user leaves the text field
const onOutOfFocus = (event, data, hooks) => {
  // ID of the text field that maps to it's value
  const newObj = data.members;
  // If the text field doesn't contain a value, delete it's id
  if (!event.target.value) {
    delete newObj[event.target.id];
    return;
  }
  newObj[event.target.id] = event.target.value;

  event.target.value = newObj[event.target.id];
  // Concat new values whilst removing duplicates
  hooks.setMembers(newObj);
}


export default Dashboard;
