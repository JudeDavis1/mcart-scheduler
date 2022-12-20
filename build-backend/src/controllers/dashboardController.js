import { getUser } from "./jwtController";
async function getUserInfo() {
    const user = await getUser();
    console.log(user);
    return user;
}
async function didTapCreateAppointment() {
    console.log('SUBMIT');
}
export { getUserInfo, didTapCreateAppointment };
