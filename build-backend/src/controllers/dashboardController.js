import { getUser } from "./jwtController";
async function getUserInfo() {
    const user = await getUser();
    return user;
}
async function didTapCreateAppointment() {
    console.log('SUBMIT');
}
export { getUserInfo, didTapCreateAppointment };
