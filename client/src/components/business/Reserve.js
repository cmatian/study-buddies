import React from "react";
import DatePicker from "react-datepicker";
import DatePickerButton from "../layouts/form/DatePickerButton";
import { subDays, setHours, setMinutes, getDay } from "date-fns";
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
            duration: "60", // Default 60
            location: this.props.data.formatted_address,
            locationName: this.props.data.name,
            locationPlaceId: this.props.data.place_id,
            meeting_date_time: "",
            initialTime: {
                closed_days: [],
                open: { hours: 0, minutes: 0 }, // 12:00 am
                close: { hours: 23, minutes: 59 }, // 11:00 pm},
            },
            isTimeInitialized: false,
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

    indexTimePeriods = (array, key) => {
        const initialObj = {};
        return array.reduce((obj, item) => {
            return {
                ...obj,
                [item[Object.keys(item)[0]][key]]: item,
            };
        }, initialObj);
    };

    convertStringToInt = array => {
        if (parseInt(isNaN(parseInt(array[0]))) || array.length < 1) {
            return [];
        }
        return array.reduce((acc, item) => {
            return [...acc, parseInt(item)];
        }, []);
    };

    filterOpenDays = (array, periods_idx) => {
        // periods_idx will help test for locations that are open 24/7
        // if .close is omitted per Google docs, it means the location is open every day.
        if (array.length < 1 || !periods_idx[0].close) {
            return [];
        }
        return [0, 1, 2, 3, 4, 5, 6].filter(item => {
            return !array.includes(item);
        });
    };

    setOperationHours = (date, req = false) => {
        const { periods } = this.props.data.opening_hours;
        let { initialTime } = this.state;

        // Generate a key value pair from the periods array that google provides us.
        const periods_idx = this.indexTimePeriods(periods, "day");

        // Convert periods_idx keys to an integer array for use (so we can set the open days)
        const openDays = this.convertStringToInt(Object.keys(periods_idx));

        const closedDays = this.filterOpenDays(openDays, periods_idx);

        // 1. User selects a day of the week which is filtered into a numeric value representing the day [0-6]
        let day = date.getDay();

        // 2. Match the selected day to the periods_idx where the key is the day value.
        //    Update the initialTime to the new values.
        if (periods_idx[day]) {
            initialTime = {
                closed_days: closedDays,
                open: {
                    hours: periods_idx[day].open.hours,
                    minutes: periods_idx[day].open.minutes,
                },
                close: {
                    hours: !periods_idx[day].close ? 23 : periods_idx[day].close.hours,
                    minutes: !periods_idx[day].close ? 59 : periods_idx[day].close.minutes,
                },
            };
        }

        if (req === true) {
            return {
                closedDays,
                initialTime,
            };
        }
        // 3. setState with either original value or updated value
        this.setState({
            initialTime,
        });
    };

    initDateTime = () => {
        let date = new Date();
        // Returning an object containing the initialTime obj and the closed_days array.
        // We need to spread both results into the state.initialTime object.
        let obj = this.setOperationHours(date, true);
        console.log(obj);
        if (this.state.isTimeInitialized === false) {
            this.setState({
                initialTime: {
                    ...obj.initialTime,
                    closed_days: obj.closedDays,
                },
                isTimeInitialized: true,
            });
        }
    };

    getClosedDays = date => {
        const { closed_days } = this.state.initialTime;
        console.log(closed_days);
        if (closed_days.length < 1) {
            return true;
        }
        let day = getDay(date);
        return closed_days.every(element => {
            return element !== day;
        });
    };

    isToday = (date) => {
        const today = new Date();
        let dateNew = date;
        if (!dateNew) {
            dateNew = today;
        }
        return today.getDate() === dateNew.getDate() &&
            today.getMonth() === dateNew.getMonth() &&
            today.getFullYear() === dateNew.getFullYear();
    };

    compareDate = (date) => {
        const { initialTime } = this.state;
        const today = new Date();
        if (this.isToday(date)) {
            return today.getHours() < initialTime.open.hours ? initialTime.open.hours : today.getHours();
        }
        return initialTime.open.hours;
    };

    // Form Submit Event Handler
    handleSubmit = event => {
        event.preventDefault();
        console.log("Form Submitted");
        console.log(this.meetingNameRef.current.value);
        console.log(this.groupSizeRef.current.value);
        console.log(this.meetingLocationRef.current.value);

        // Call the backend to save the reservation
        var auth2 = window.gapi.auth2.getAuthInstance();
        var googleUser = auth2.currentUser.get();
        var idToken = googleUser.getAuthResponse().id_token;
        var data = {
            places_id: this.state.locationPlaceId || "ChIJN1t_tDeuEmsRUsoyG83frY4",
            group_size: this.groupSizeRef.current.value,
            duration_minutes: 60,
            date: this.state.meeting_date_time.toISOString().split('T')[0],
            time: this.state.meeting_date_time.toISOString().split('T')[1],
            name: this.meetingNameRef.current.value,
        };
        console.log(data);
        // console.log("reservation: " + JSON.stringify(data));
        // fetch("/backend/users/reservations", {
        //     method: "POST",
        //     body: JSON.stringify(data),
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: "Bearer " + idToken,
        //     },
        // })
        //     .then(response => {
        //         console.log("Success:", response.json());
        //     })
        //     .catch(error => {
        //         console.error("Error", error);
        //     });
    };

    // Determines the state of the form submission button
    canSubmit = () => {
        const { meeting_name, meeting_date_time } = this.state;
        return meeting_name.length > 0 && typeof meeting_date_time === "object";
    };

    render() {
        const { data } = this.props;
        const { errors, initialTime } = this.state;
        const disabled = this.canSubmit();
        console.log(initialTime);
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
                        <label htmlFor="group_size">Group Size (1 to 8)</label>
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
                        Location details are READONLY. Data is set based on the data property passed in from the encapsulating component state.
                    */}
                    <div className="input_group">
                        <label htmlFor="locationName">Location Name</label>
                        <input
                            id="locationName"
                            type="text"
                            name="locationName"
                            value={data.name}
                            onChange={this.handleChange}
                            readOnly
                        />
                    </div>
                    <div className="input_group">
                        <label htmlFor="location">Location Address</label>
                        <input
                            ref={this.meetingLocationRef}
                            id="location"
                            type="text"
                            name="location"
                            value={data.formatted_address}
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
                            onCalendarOpen={this.initDateTime}
                            filterDate={date => this.getClosedDays(date)}
                            minDate={subDays(new Date(), 0)}
                            minTime={setHours(setMinutes(
                                // Validate the current minute
                                new Date(), initialTime.open.minutes), (
                                // Validate the current hour against the open hours
                                initialTime.open.hours
                            ))}
                            maxTime={setHours(setMinutes(new Date(), initialTime.close.minutes), initialTime.close.hours)}
                            showTimeSelect
                            withPortal
                            timeIntervals={30}
                            dateFormat="MMM d, yyyy - h:mm aa"
                            customInput={<DatePickerButton />}
                        />
                    </div>
                    <div className="duration_notice">
                        <span>
                            Meeting durations default to 60 minutes. You may change the duration after submission in your reservations page.
                        </span>
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
