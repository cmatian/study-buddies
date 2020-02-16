import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // DatePicker CSS import
import "./Reserve.scss";

/*
    Makes use of react-datepicker: https://reactdatepicker.com/
    This is a relatively powerful date picker which supports time as well.
    Refer to the above link for full documentation and usage.
*/

class Reserve extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            meeting_name: "",
            group_size: "1",
            location: "",
            meeting_date: "",
            meeting_time: "",
        };
        this.meetingNameRef = React.createRef();
        this.groupSizeRef = React.createRef();
        this.meetingLocationRef = React.createRef();
        this.meetingDateRef = React.createRef();
        this.meetingTimeRef = React.createRef();
    }

    handleChange = event => {
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleGroupSize = event => {
        let size = event.target.value;

        /*
            Sanitize inputs where value is greater than 10.
            The edge case for this is if we have a value in the field and the user tries to change it. 
            If they don't highlight it and instead try to continue typing the function will see it as a two digit value and convert it to 8 which we don't want.
        */
        if (size >= 10) {
            // Convert briefly to string
            size.toString();
            // Set size = to second char and convert back to int
            size = parseInt(size[1]);
        }

        // If less than 1 set to 1
        if (size < 1) {
            size = 1;
        }
        // If greater than 8 set to 8
        if (size > 8) {
            size = 8;
        }
        this.setState({
            [event.target.name]: size,
        });
    };

    handleChangeDate = date => {
        this.setState({
            meeting_date: date, //date
        });
    };

    handleChangeTime = date => {
        // We need to convert the time to en-US format and then store the raw value as well.
        // The date arg is used exclusively by the DatePicker component so we can't alter it with formattedTime.
        this.setState({
            meeting_time: date, // time
        });
    };

    // Form Submissions
    handleSubmit = event => {
        event.preventDefault();
        console.log("Form Submitted");
        console.log(this.meetingNameRef.current.value);
        console.log(this.groupSizeRef.current.value);
        console.log(this.meetingLocationRef.current.value);
        // We then flush state for the form before redirecting away
        // Flush code here later

        // Call the backend to save the reservation
        var auth2 = window.gapi.auth2.getAuthInstance();
        var googleUser = auth2.currentUser.get();
        var idToken = googleUser.getAuthResponse().id_token;
        var data = {
            user_token: idToken,
            places_id: this.meetingLocationRef.current.value || "1234567890",
            group_size: this.groupSizeRef.current.value,
            duration_minutes: 60,
            date: "2019-02-18",
            time: "14:30:00",
            name: this.meetingNameRef.current.value
        }
        console.log("reservation: " + JSON.stringify(data));
        fetch('/backend/users/reservations', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        }).then((response) => {
            console.log('Success:', response.json());
        }).catch((error) => {
            console.error('Error', error);
        });
    };

    render() {
        return (
            <div className="make_reservation_wrapper">
                <form
                    method="post"
                    name="make_reservation_form"
                    className="make_reservation_form"
                    onSubmit={event => this.handleSubmit(event)}
                >
                    <h2>Make a Reservation</h2>
                    <div className="input_group">
                        <label htmlFor="meeting_name">Meeting Name</label>
                        <input
                            ref={this.meetingNameRef}
                            id="meeting_name"
                            type="text"
                            name="meeting_name"
                            value={this.state.meeting_name}
                            onChange={this.handleChange}
                        />
                    </div>
                    <div className="input_group">
                        <label htmlFor="group_size">Group Size (up to 8)</label>
                        <input
                            ref={this.groupSizeRef}
                            id="group_size"
                            type="number"
                            max="8"
                            name="group_size"
                            value={this.state.group_size}
                            onChange={this.handleGroupSize}
                        />
                    </div>
                    {/* 
                        Location is READONLY. The location info component should contain a button to trigger
                        the reserve component to appear. Location is then set based on that information.
                    */}
                    <div className="input_group">
                        <label htmlFor="location">Location</label>
                        <input
                            ref={this.meetingLocationRef}
                            id="location"
                            type="text"
                            name="location"
                            value={this.state.location}
                            onChange={this.handleChange}
                            readOnly
                        />
                    </div>
                    <div className="input_group">
                        <label htmlFor="meeting_date">Date</label>
                        <DatePicker
                            ref={this.meetingDateRef}
                            id="meeting_date"
                            name="meeting_date"
                            selected={this.state.meeting_date}
                            onChange={date => this.handleChangeDate(date)}
                        />
                    </div>
                    <div className="input_group">
                        <label htmlFor="meeting_time">Time</label>
                        <DatePicker
                            ref={this.meetingTimeRef}
                            id="meeting_time"
                            name="meeting_time"
                            selected={this.state.meeting_time}
                            onChange={date => this.handleChangeTime(date)}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={30}
                            timeCaption="Time"
                            dateFormat="h:mm aa"
                        />
                    </div>
                    <button type="submit">Confirm Reservation</button>
                </form>
            </div>
        );
    }
}

export default Reserve;
