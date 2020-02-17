import React from "react";
import DatePicker from "react-datepicker";
import DatePickerButton from "../layouts/form/DatePickerButton";
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
            group_size: "1", // Default 1
            location: "", // Prepopulated when user selects a location to make a reservation
            meeting_date_time: "",
            errors: {},
        };
        this.meetingNameRef = React.createRef();
        this.groupSizeRef = React.createRef();
        this.meetingLocationRef = React.createRef();
        this.meetingDateRef = React.createRef();
        this.meetingTimeRef = React.createRef();
    }

    validateInput = event => {
        let result = event.target.value.length < 1;
        this.setState({
            errors: { [event.target.name]: result },
        });
    };

    handleChange = event => {
        this.validateInput(event);
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleBlur = event => {
        this.validateInput(event);
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

    handleChangeDateTime = date => {
        this.setState({
            meeting_date_time: date, //date
        });
    };

    // Form Submit Event Handler
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
        };
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

    // Determines the state of the form submission button
    canSubmit = () => {
        const { meeting_name, meeting_date_time } = this.state;
        return meeting_name.length > 0 && typeof meeting_date_time === "object";
    };

    render() {
        const { errors } = this.state;
        const disabled = this.canSubmit();
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
                        <label htmlFor="meeting_name">
                            Meeting Name <span className="required_ast">*</span>
                        </label>
                        <input
                            ref={this.meetingNameRef}
                            id="meeting_name"
                            type="text"
                            name="meeting_name"
                            value={this.state.meeting_name}
                            onChange={this.handleChange}
                            onBlur={this.handleBlur}
                            className={errors.meeting_name ? "error" : ""}
                            placeholder="CS 467 Study Session"
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
                    <div className="input_group date_time_group">
                        <label htmlFor="meeting_date_time">
                            Date & Time <span className="required_ast">*</span>
                        </label>
                        <DatePicker
                            ref={this.meetingDateTimeRef}
                            id="meeting_date_time"
                            name="meeting_date_time"
                            selected={this.state.meeting_date_time}
                            onChange={date => this.handleChangeDateTime(date)}
                            showTimeSelect
                            withPortal
                            timeIntervals={30}
                            dateFormat="MMM d, yyyy - h:mm aa"
                            customInput={<DatePickerButton />}
                        />
                    </div>
                    {/* Remove disabled if debugging */}
                    <button type="submit" disabled={!disabled}>
                        Confirm Reservation
                    </button>
                </form>
            </div>
        );
    }
}

export default Reserve;
