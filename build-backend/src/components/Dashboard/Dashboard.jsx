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
import { getUserInfo, didTapCreateAppointment, loadSessions, deleteSessionItem, logout } from "../../controllers/dashboardController";
import MAlert from "../MAlert/MAlert";
function Dashboard() {
    const initialBtnState = (<>Appointment {<Add />}</>);
    const globalMsgConfig = { text: "", shouldShow: false, status: "info" };
    const [info, setInfo] = useState({});
    const [place, setPlace] = useState('');
    const [members, setMembers] = useState({});
    const [nPublishers, setNPublishers] = useState(2);
    const [sessionsLoaded, setSessionsLoaded] = useState(false);
    const [currentSessions, setCurrentSessions] = useState([{}]);
    const [popoverMsg, setPopoverMsg] = useState(globalMsgConfig);
    const [reloadAll, setReloadAll] = useState(crypto.randomUUID());
    const [dashboardMsg, setDashboardMsg] = useState(globalMsgConfig);
    const [appointmentText, setAppointmentText] = useState(initialBtnState);
    const [showPopover, setShowPopover] = useState(false);
    const [time, setTime] = useState((() => {
        const date = new Date();
        date.setHours(12);
        date.setMinutes(0);
        return date.getTime();
    })());
    useEffect(() => {
        (async function () {
            const userData = await getUserInfo();
            setInfo(userData);
        }());
    }, [reloadAll]);
    useEffect(() => {
        (async function () {
            const sessionObjects = await loadSessions(info);
            setCurrentSessions(sessionObjects);
            setSessionsLoaded(true);
        }());
    }, [info, reloadAll]);
    useEffect(() => setMembers({}), [nPublishers]);
    return (<div className="Dashboard app-sub-component">
      <span align="right" className="logout-button"><Button onClick={(e) => logout()} variant="danger">Logout</Button></span>
      <h1 align="center">{info.name}</h1><br />
      {dashboardMsg.shouldShow &&
            <MAlert variant={dashboardMsg.status} onClose={() => setDashboardMsg({ ...dashboardMsg, shouldShow: false })} text={dashboardMsg.text}/>}
      <OverlayTrigger trigger='click' overlay={AppointmentCreationPopover({ place, time, members, nPublishers, popoverMsg }, { setPlace, setTime, setMembers, setNPublishers, setPopoverMsg }, () => {
            didTapCreateAppointment({ place, members: Object.values(members), time }, popoverMsg, setPopoverMsg, () => {
                setReloadAll(crypto.randomUUID());
                setShowPopover(false);
            });
        })} placement='bottom' show={showPopover} onEnter={() => setAppointmentText('Cancel')} onExit={() => {
            setAppointmentText(initialBtnState);
            setPopoverMsg({ shouldShow: false });
        }}>
        <Button onClick={() => setShowPopover(!showPopover)} className="create-appointment-btn">
          {appointmentText}
        </Button>
      </OverlayTrigger>

      <div className="dashboard-session-card-container">
        {!sessionsLoaded && <Spinner animation="border"/>}
        {sessionsLoaded &&
            currentSessions.map((session, sessionIdx) => {
                const time = new Date(session.time);
                const months = ["Jan", "Feb", "March", "Apr", "May", "Jun", "July", "Aug", "Sep", "Oct", "Nov", "Dec"];
                return (<Card className="dashboard-session-card" id={`session-card-${sessionIdx}`}>
                <Delete onClick={() => {
                        deleteSessionItem(currentSessions[sessionIdx]._id, setReloadAll);
                        setDashboardMsg({ text: "Deleted session", shouldShow: true, status: "success" });
                    }}/>
                <Card.Body>
                  <Card.Title>{formatTime(time.getHours(), time.getMinutes())}</Card.Title>
                  <Card.Subtitle>{`${time.getDate()} ${months[time.getMonth()]} ${time.getFullYear()}`}</Card.Subtitle>
                  <Card.Text>{session.place}</Card.Text>
                </Card.Body>
                <Card.Footer>
                  {session.members.map((user) => <><a href={`/viewuser?id=` + user._id} className="dashboard-user-link">{user.name}</a><br /></>)}
                </Card.Footer>
              </Card>);
            })}
      </div>
    </div>);
}
const AppointmentCreationPopover = (data, hooks, didSubmit) => {
    return (<Popover>
      <Popover.Header>Create Appointment</Popover.Header>
      <Popover.Body style={{ padding: "10px" }}>
        <Grid container spacing={2}>
          
            {data.popoverMsg.shouldShow &&
            <Grid item>
            <MAlert variant={data.popoverMsg.status} onClose={() => hooks.setPopoverMsg({ ...data.popoverMsg, shouldShow: false })} text={data.popoverMsg.text}/>
            </Grid>}
          <Grid item><TextField label="Location" onChange={(e) => hooks.setPlace(e.target.value)}/></Grid>
          <Grid item>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker onChange={(value) => hooks.setTime(value.toDate().getTime())} label="Time" value={data.time} renderInput={(props) => <TextField {...props}/>}/>
            </LocalizationProvider>
          </Grid>
          <Grid item>
            <TextField select defaultValue={2} style={{ width: "250px" }} label="Number of publishers" onChange={(value) => {
            hooks.setNPublishers(value.target.value);
            for (let i = 1; i < data.nPublishers; i++) {
                const element = document.getElementById(`publisher-name${i}`);
                element.value = '';
            }
        }}>
              {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => {
            return <MenuItem value={i}>{i}</MenuItem>;
        })}
            </TextField>
          </Grid>
          {publisherNameFields(data, hooks)}
          <Grid item>
            <Button id="okok" onClick={() => didSubmit()}>Create</Button>
          </Grid>
        </Grid>
      </Popover.Body>
    </Popover>);
};
const publisherNameFields = (data, hooks) => {
    let publishers = [];
    for (let i = 1; i < data.nPublishers; i++) {
        publishers.push(<Grid item>
        <TextField id={`publisher-name${i}`} onBlur={(event) => onExitFocus(event, data, hooks)} className="publisher-name" label={`Person ${i + 1}'s name`}/>
      </Grid>);
    }
    return publishers;
};
const onExitFocus = (event, data, hooks) => {
    const newObj = data.members;
    if (!event.target.value) {
        delete newObj[event.target.id];
        return;
    }
    newObj[event.target.id] = event.target.value;
    event.target.value = newObj[event.target.id];
    hooks.setMembers(newObj);
};
function formatTime(hours, minutes) {
    const leadingZero = (string) => (parseInt(string) < 10 ? "0" : "") + string;
    return `${leadingZero(hours)}:${leadingZero(minutes)}`;
}
export default Dashboard;
