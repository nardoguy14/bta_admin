import * as React from 'react';
import Paper from '@material-ui/core/Paper';
import { makeStyles } from '@material-ui/core/styles';
import {ViewState, EditingState, IntegratedEditing} from '@devexpress/dx-react-scheduler';
import {
    Scheduler,
    WeekView,
    Appointments,
    AppointmentForm,
    AppointmentTooltip,
    DragDropProvider,
    AllDayPanel
} from '@devexpress/dx-react-scheduler-material-ui';
import * as apiRequestor from '../lib/apirequestor';
import moment from 'moment';
import { groupBy } from 'underscore'
import { DataGrid } from '@mui/x-data-grid';



const useStyles = makeStyles(theme => ({
    container: {
        margin: theme.spacing(2),
        padding: theme.spacing(2),
    },
    text: theme.typography.h6,
    formControlLabel: {
        ...theme.typography.caption,
        fontSize: '1rem',
    },
}));

const currentDate = '2021-01-10';

export default class BtaScheduler extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            data: [],
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.backgroundUrl !== this.props.backgroundUrl) {
        }
    }

    componentDidMount() {
        // apiRequestor.getSchedules().then(resp => {
        //
        //     let dates = resp.data
        //     console.log(dates)
        //     let convertedDates = dates.map(date => {
        //         var extra = ""
        //         if(date.start_time.length === 7){
        //             extra = "0"
        //         }
        //         let startDate = Date.parse(date.date + "T" + extra + date.start_time)
        //
        //         extra = ""
        //         if(date.end_time.length === 7){
        //             extra = "0"
        //         }
        //         let endDate = Date.parse(date.date + "T" + extra + date.end_time)
        //
        //         return {
        //             title: 'test',
        //             startDate: startDate,
        //             endDate: endDate
        //         }
        //     })
        //     console.log(convertedDates)
        //     this.setState({data: convertedDates})
        // })

        var people = []

        apiRequestor.getWhosoffSchedules('2021-01-01', '2021-01-31').then(resp =>{
            let dates = resp.data['Data']
            console.log(dates)
            // let x = groupBy(dates, function(date){ return date['Staff_Email'] })
            // console.log(x)
            let convertedDates = dates.map(date => {

                let startDate = Date.parse(date['Start_Date'])

                let endDate = Date.parse(date['End_Date'])

                if(new Date(endDate).getHours() === 23 && new Date(endDate).getMinutes() === 59){
                    endDate = moment(endDate).add(1, 'm').valueOf()
                    // alert(endDate)
                    // alert(startDate +" "+ endDate)
                }

                return {
                    title: date['First_Name'] + " " + date['Last_Name'],
                    startDate: startDate,
                    endDate: endDate
                }
            })
            this.setState({data: convertedDates})
        })
    }

    onAddedAppointmentChange(appointment) {
    }

    onCommitChanges = ( {added, changed, deleted} ) => {
        console.log("nardo", added, changed, deleted)
        let {data} = this.state

        if (added) {
            console.log("added", added)
            const startingAddedId = data.length > 0 ? data[data.length - 1].id + 1 : 0;
            this.setState({data: [...data, { id: startingAddedId, ...added }] })
            let date = moment(added.startDate).format('YYYY-MM-DD')
            let startTime = moment(added.startDate).format('HH:mm:ss')
            let endTime = moment(added.endDate).format('HH:mm:ss')
            apiRequestor.postSchedule(1, date, startTime, endTime)
        }
        if (changed) {
            this.setState({ data:
                data.map(appointment => {
                    console.log("in there", changed[appointment.id])
                    console.log({ ...appointment, ...changed[appointment.id] })
                    console.log(appointment)
                    return (changed[appointment.id] ? { ...appointment, ...changed[appointment.id] } : appointment)
                })
            })
        }
        if (deleted !== undefined) {
            this.setState({data: data.filter(appointment => appointment.id !== deleted)})
        }

        console.log("added:", added, "changed:", changed, "deleted:", deleted, "data:", data)
    }


    render() {
        let {data} = this.state

        return (
            <React.Fragment>
                <Paper>
                    <Scheduler
                        data={data}
                        height={600}
                    >
                        <ViewState
                            currentDate={currentDate}
                        />
                        <EditingState
                            onCommitChanges={this.onCommitChanges}
                            // addedAppointment={addedAppointment}
                            // onAddedAppointmentChange={onAddedAppointmentChange}
                        />

                        <IntegratedEditing />
                        <WeekView
                            startDayHour={0}
                            endDayHour={24}
                        />
                        <Appointments />
                        <AllDayPanel />

                        <AppointmentTooltip
                            showOpenButton
                            showDeleteButton={true}
                        />
                        <AppointmentForm
                            readOnly={true ? false : !true}
                        />
                        <DragDropProvider
                        />
                    </Scheduler>
                </Paper>
            </React.Fragment>
        );
    }
}
