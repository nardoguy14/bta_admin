import axios from "axios";
// import TokenService from "./tokenService";

let host = process.env.REACT_APP_API_HOST

export function postSchedule(adminId, date, startTime, endTime) {
    return axios.post(`${host}/admins/schedule`, {
        admin_id: adminId,
        date: date,
        start_time: startTime,
        end_time: endTime
    })
}

export function getSchedules() {
    return axios.get(`${host}/admins/schedules`)
}

export function getWhosoffSchedules(startDate, endDate) {
    return axios.get(`${host}/admins/whosoff/schedules`,
        { params: { start_date: startDate, end_date: endDate }})
}

export function getWhosoffStaff() {
    return axios.get(`${host}/admins/whosoff/staff`)
}
