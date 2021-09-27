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



export default class BtaStaffAssigner extends React.Component  {
    constructor(props) {
        super(props);
        this.state = {
            selectionModel: [],
            people: []
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectionModel !== this.props.selectionModel) {
        }
    }

    componentDidMount() {
        apiRequestor.getWhosoffStaff().then(resp => {
            let data = resp.data['Data']
            console.log(data)
            let people = data.map((person, index) => {
                return {
                    id: index,
                    fullName: person['First_Name'] + ' ' + person['Last_Name'],
                    email: person['Email_Address']
                }
            })
            this.setState({people: people})
        })

    }

    onAddedAppointmentChange(appointment) {
    }

    setSelectionModel = (newOne) => {
        console.log(newOne)
        this.setState({selectionModel: newOne})
    }

    render() {
        let {selectionModel, people} = this.state

        const columns = [
            { field: 'id', headerName: 'ID', width: 70 },
            { field: 'email', headerName: 'E-mail', width: 130 },
            {
                field: 'fullName',
                headerName: 'Full name',
                sortable: false,
                width: 300,
            },
        ];



        return (
            <React.Fragment>
                <div style={{ marginTop: '10px', height: 400, width: '100%' }}>
                    <DataGrid
                        rows={people}
                        columns={columns}
                        pageSize={10}
                        rowsPerPageOptions={[10]}
                        onSelectionModelChange={(newSelectionModel) => {
                            this.setSelectionModel(newSelectionModel);
                        }}
                        selectionModel={selectionModel}
                    />
                </div>
            </React.Fragment>
        );
    }
}
