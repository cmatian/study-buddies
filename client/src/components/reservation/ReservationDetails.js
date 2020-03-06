import React from "react";
import { withRouter } from "react-router-dom";
import DatePicker from "react-datepicker";
import { subDays, setHours, setMinutes, parseISO, getDay } from "date-fns";
import DatePickerButton from "../layouts/form/DatePickerButton";
import Loader from '../layouts/Loader';
import "react-datepicker/dist/react-datepicker.css"; // DatePicker CSS import
import "./ReservationDetails.scss";

const google = window.google;
class ReservationDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isEditing: false,
            details: {}, // Google Places Details
            oldindex: props.index,
            map: null,
            formData: {
                // This is a preserved copy of the reservation when it's loaded (from props)
                name: props.reservations[this.props.index].name,
                group_size: props.reservations[this.props.index].group_size,
                duration_minutes: props.reservations[this.props.index].duration_minutes,
                date_time: parseISO(props.reservations[this.props.index].date_time),
            },
            formErrors: {},
            meeting_name: props.reservations[this.props.index].name,
            meeting_group_size: props.reservations[this.props.index].group_size,
            meeting_duration: props.reservations[this.props.index].duration_minutes,
            meeting_date_time: parseISO(props.reservations[this.props.index].date_time),
            initialTime: {
                closed_days: [],
                open: { hours: 0, minutes: 0 }, // 12:00 am
                close: { hours: 23, minutes: 59 }, // 11:59 pm},
            },
            isLoading: true, // loading is always assumed to be true (we setState later to set as false)
            isTimeInitialized: false,
        };
    }

    initMap = async () => {
        let map = new Promise((resolve, reject) => {
            resolve(new google.maps.Map(document.createElement("div")));
        });
        await map
            .then(mapResponse => {
                this.getDetails(mapResponse);
            })
            .catch(error => {
                console.log(error, "There was an error initializing the Map object.");
            });
    };

    getDetails = async (response = this.state.map, idx = this.state.oldindex) => {
        let map = response;
        let item_place_id = this.props.reservations[this.props.index].location.places_id;
        let request = {
            placeId: item_place_id,
            fields: [
                "type",
                "name",
                "formatted_address",
                "rating",
                "user_ratings_total",
                "formatted_phone_number",
                "international_phone_number",
                "price_level",
                "website",
                "opening_hours",
                "photos",
            ],
        };
        let servicePromise = new Promise((resolve, reject) => {
            resolve(new google.maps.places.PlacesService(response));
        });
        await servicePromise.then(service => {
            service.getDetails(request, (results, status) => {
                if (status === google.maps.places.PlacesServiceStatus.OK) {
                    console.log(results);
                    this.setState({
                        details: results, // set the results of the getDetails request
                        oldindex: idx, // Update the old index to match the index of the current selection
                        isLoading: false, // No longer loading
                        map: map, // Set the map object so we can reference it directly.
                    });
                }
            });
        });
    };

    // Use this function to quickly convert the periods object in opening_hours to a key-value pair
    // representing the opening/closing hours associated with a day integer.
    // Returns an Object of key/value pairs.
    indexTimePeriods = (array, key) => {
        const initialObj = {};
        return array.reduce((obj, item) => {
            return {
                ...obj,
                [item[Object.keys(item)[0]][key]]: item,
            };
        }, initialObj);
    };

    // Converts an array of strings to integers. This is specifically used for converting
    // the keys (from indexTimePeriods) to an integer. Only use on keys you know are string
    // representations of an integer.
    // Returns an array of integers.
    convertStringToInt = array => {
        if (parseInt(isNaN(parseInt(array[0]))) || array.length < 1) {
            return [];
        }
        return array.reduce((acc, item) => {
            return [...acc, parseInt(item)];
        }, []);
    };

    filterOpenDays = (array, periods_idx) => {
        if (array.length < 1 || !periods_idx[0].close) {
            return [];
        }
        return [0, 1, 2, 3, 4, 5, 6].filter(item => {
            return !array.includes(item);
        });
    };

    /**
     * setOperationHours requires a date, and optionally a request boolean. When the request boolean is set, the
     * function will return the initialTime object rather than call setState directly.
     */
    setOperationHours = (date, req = false) => {
        if (!this.state.details.opening_hours) {
            return console.log("Opening hours were undefined.");
        }

        const { periods } = this.state.details.opening_hours;
        let { initialTime } = this.state;

        // Generate a key value pair from the periods array that google provides us.
        const periods_idx = this.indexTimePeriods(periods, "day");

        // Convert periods_idx keys to an integer array for use (so we can set the open days)
        const openDays = this.convertStringToInt(Object.keys(periods_idx));

        const closedDays = this.filterOpenDays(openDays, periods_idx);

        // 1. User selects a day of the week which is filtered into a numeric value representing the day [0-6]
        let day = date.getDay();
        // add the day by 1 to match google's day order
        day += 1;
        if (day > 6) {
            day = 0;
        }

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

    getClosedDays = date => {
        const { closed_days } = this.state.initialTime;
        if (closed_days.length < 1) {
            return true;
        }
        let day = getDay(date);
        return closed_days.every(element => {
            return element !== day;
        });
    };

    handleChangeDateTime = (date) => {
        this.setState({ meeting_date_time: date });
    };

    // Need to initialize the selected date when the user opens the date box.
    // This will only occur once when the user opens the calendar for the first time.
    initDateTime = () => {
        let date = parseISO(this.props.reservations[this.props.index].date_time);
        // Returning an object containing the initialTime obj and the closed_days array.
        // We need to spread both results into the state.initialTime object.
        let obj = this.setOperationHours(date, true);
        if (this.state.isTimeInitialized === false && this.state.details.opening_hours) {
            this.setState({
                initialTime: {
                    ...obj.initialTime,
                    closed_days: obj.closedDays,
                },
                isTimeInitialized: true,
            });
        } else {
            this.setState({
                isTimeInitialized: true,
            });
        }
    };

    calculateRating = rating => {
        if (!rating) {
            return "N/A";
        }

        let sentiment = [
            "sentiment_very_satisfied",
            "sentiment_satisfied",
            "sentiment_dissatisfied",
            "sentiment_very_dissatisfied",
        ];
        let className = ["very_high", "high", "low", "very_low"];
        let selected = "";
        let face = "";

        if (rating >= 4) {
            selected = className[0];
            face = sentiment[0];
        } else if (rating >= 3) {
            selected = className[1];
            face = sentiment[1];
        } else if (rating >= 2) {
            selected = className[2];
            face = sentiment[2];
        } else {
            selected = className[3];
            face = sentiment[3];
        }

        return (
            <>
                <i className={"material-icons " + selected}>{face}</i>
                <span className={selected}>{rating}</span>
            </>
        );
    };

    calculatePricing = pricing => {
        if (!pricing) {
            return <span className="no_price">Pricing for this location is not available.</span>;
        }
        const price = ["$", "$", "$$", "$$$", "$$$$"];
        const price_text = ["Cheap", "Inexpensive", "Moderate", "Expensive", "Very Expensive"];
        const price_class = ["cheap", "inexpensive", "moderate", "expensive", "very_expensive"];

        return (
            <>
                <span className={price_class[pricing]}>{price[pricing]}</span>
                <span className={price_class[pricing]}>{price_text[pricing]}</span>
            </>
        );
    };

    // Form Editing Handlers - editMeeting, editCancel, editSubmit
    validateInput = event => {
        let result = event.target.value.trim().length < 1;
        this.setState({
            formErrors: { [event.target.name]: result },
        });
    };

    handleInputChange = event => {
        this.validateInput(event);
        this.setState({
            [event.target.name]: event.target.value,
        });
    };

    handleGroupSize = event => {
        let size = event.target.value;

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

    handleDurationChange = event => {
        this.setState({ meeting_duration: event.target.value });
    };

    // Toggles the form state to show the edit buttons and the cancel/submit buttons
    editMeeting = event => {
        this.setState({
            isEditing: true,
        });
    };

    // Flushes the changes and resets them to original values
    editCancel = event => {
        const { formData } = this.state;
        // Reset to the formData values
        this.setState({
            meeting_name: formData.name,
            meeting_group_size: formData.group_size,
            meeting_duration: formData.duration_minutes,
            meeting_date_time: formData.date_time,
            isEditing: false, // toggle editing off
        });
    };

    editSubmit = event => {
        const { meeting_name, meeting_group_size, meeting_date_time, meeting_duration } = this.state;
        let payload = {
            id: this.props.reservations[this.props.index].reservation_id,
            name: meeting_name.trim(),
            group_size: meeting_group_size,
            date_time: meeting_date_time,
            duration_minutes: meeting_duration,
        };

        this.setState({
            isEditing: false,
        }, this.props.updateReservation(payload, this.props.index));
    };

    // Save Location Handler
    toggleSavedLocation = event => {
        const { reservations, index, addSavedLocation, deleteSavedLocation } = this.props;
        const res = reservations[index];
        const toggleState = res.saved_location;

        // If the location is saved the toggle state will not be null, so we remove the saved_location from the table
        if (toggleState) {
            let payload = {
                user_id: res.user_id,
                places_id: res.location.places_id,
            };
            // Delete from saved locations
            deleteSavedLocation(payload, index);
        }
        // Otherwise it's a non-existent entry and we need to add it to saved_locations
        else {
            let payload = {
                places_id: res.location.places_id,
                userId: res.user_id,
                locationId: res.location.location_id,
                nickname: res.location.name,
            };
            // Add to saved locations
            addSavedLocation(payload, index);
        }

    };

    reviewRedirect = () => {
        const { reservations, index } = this.props;
        
        const location = {
            pathname: "/biz/rate",
            state: {
                places_id: reservations[index].location.places_id,
                name: reservations[index].location.name,
                referral: "/users/reservations",
                picture: this.state.details.photos ? this.state.details.photos[0].getUrl() : undefined,
            }
        };

        return this.props.history.push(location);
    };

    // Initialize the required Google API (Headless map + getDetails request)
    componentDidMount() {
        this.initMap();
    }

    /**
     * In order to prevent multiple requests when a new reservation is selected, we have to track the oldindex and
     * compare it to the currently selected index property. When we switch the oldindex will be updated within the
     * getDetails setState callback, and the getDetails request won't fire multiple times as a result of mapping.
     */
    componentDidUpdate() {
        const { oldindex, isLoading } = this.state;
        if (oldindex !== this.props.index && !isLoading) {
            this.setState(
                {
                    meeting_name: this.props.reservations[this.props.index].name,
                    meeting_group_size: this.props.reservations[this.props.index].group_size,
                    meeting_duration: this.props.reservations[this.props.index].duration_minutes,
                    meeting_date_time: parseISO(this.props.reservations[this.props.index].date_time),
                    isLoading: true,
                    isEditing: false,
                    isTimeInitialized: false, // reset initialization
                },
                // setState callback expects a function but async always returns a promise, so just wrap
                // getDetails in an IIFE
                () => this.getDetails(undefined, this.props.index)
            );
        }
    }

    render() {
        const {
            details,
            formErrors,
            isEditing,
            isLoading,
            initialTime,
            meeting_name,
            meeting_group_size,
            meeting_duration,
            meeting_date_time,
        } = this.state;
        const reservation = this.props.reservations[this.props.index];
        const date_options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
        const char_length = this.state.meeting_name.length;
        const char_limit = 50;

        return isLoading ? (
            <Loader />
        ) : (
                <form method="post" name="reservation_form" className="reservation_form" autoComplete="off">
                    <div className="content_group row spc_btwn">
                        <div className={"res_status " + (reservation.status === "CANCELLED" ? "red" : "green")}>
                            {reservation.status}
                        </div>
                        <div className="edit_form_toolbar">
                            {isEditing && (
                                <button type="button" className="cancel_edit_button" onClick={this.editCancel}>
                                    Cancel
                                </button>
                            )}
                            {(!isEditing && reservation.status !== "CANCELLED") && (
                                <button type="button" className="meeting_edit_button" onClick={this.editMeeting}>
                                    Edit Meeting
                                </button>
                            )}
                            {isEditing &&
                                <button type="button" className="submit_edit_button" onClick={this.editSubmit}>
                                    Save Changes
                                </button>
                            }
                        </div>
                    </div>
                    <div className="content_group row spc_btwn">
                        {isEditing ? (
                            <div className="edit_meeting_name">
                                <label htmlFor="meeting_name">
                                    Change Meeting Name <span className="required_ast">*</span>
                                </label>
                                <input
                                    maxLength={char_limit}
                                    id="meeting_name"
                                    name="meeting_name"
                                    className={"meeting_name " + (formErrors.meeting_name ? "error" : "")}
                                    type="text"
                                    value={meeting_name}
                                    onChange={this.handleInputChange}
                                    placeholder="Required"
                                />
                                <span className={"char_limit " + (char_length < char_limit ? "" : "capped")}>
                                    {char_length}/{char_limit}
                                </span>
                            </div>
                        ) : (
                                <span className="show_meeting_name">{reservation.name}</span>
                            )}
                    </div>
                    <div className="content_group row">
                        {isEditing ? (
                            <div className="edit_meeting_group_size">
                                <label htmlFor="meeting_group_size">Change Group Size (1 to 8) </label>
                                <input
                                    id="meeting_group_size"
                                    name="meeting_group_size"
                                    className="meeting_group_size"
                                    type="number"
                                    value={meeting_group_size}
                                    onChange={this.handleGroupSize}
                                />
                            </div>
                        ) : (
                                <span className="show_group_size">Group Size: {reservation.group_size}</span>
                            )}
                    </div>
                    <div className="content_group row">
                        <div className="date_time_info_window">
                            <span className="date">{meeting_date_time.toLocaleDateString(undefined, date_options)}</span>
                            <span className="time">@ {meeting_date_time.toLocaleTimeString("en-US")}</span>
                        </div>
                        {isEditing && (
                            <DatePicker
                                id="meeting_date_time"
                                name="meeting_date_time"
                                selected={meeting_date_time}
                                onSelect={date => this.setOperationHours(date)}
                                onChange={date => this.handleChangeDateTime(date)}
                                onCalendarOpen={this.initDateTime}
                                filterDate={date => this.getClosedDays(date)}
                                minDate={subDays(new Date(), 0)}
                                minTime={setHours(setMinutes(new Date(), initialTime.open.minutes), initialTime.open.hours)}
                                maxTime={setHours(setMinutes(new Date(), initialTime.close.minutes), initialTime.close.hours - 1)}
                                value={"edit"}
                                showTimeSelect
                                withPortal
                                timeIntervals={30}
                                dateFormat="MMM d, yyyy - h:mm aa"
                                customInput={<DatePickerButton />}
                            />
                        )}
                    </div>
                    <div className="content_group row">
                        {isEditing ? (
                            <div className="edit_meeting_duration">
                                <label htmlFor="meeting_duration">Change Meeting Duration</label>
                                <select
                                    id="meeting_duration"
                                    className="meeting_duration"
                                    value={meeting_duration}
                                    onChange={this.handleDurationChange}
                                >
                                    <option value="15">15 Minutes</option>
                                    <option value="30">30 Minutes</option>
                                    <option value="45">45 Minutes</option>
                                    <option value="60">60 Minutes</option>
                                </select>
                            </div>
                        ) : (
                                <span className="show_meeting_duration">Duration: {reservation.duration_minutes} minutes</span>
                            )}
                    </div>
                    <div className="location_details_window">
                        <div className="location_primary_details">
                            <div className="location_toprow_details">
                                <h3>
                                    @{details.name}
                                    <i
                                        className={"material-icons save_location " + (
                                            reservation.saved_location !== null && reservation.saved_location.saved_location_id ? "gold" : ""
                                        )}
                                        title={reservation.saved_location !== null && reservation.saved_location.saved_location_id ? "Remove from Saved Locations" : "Save Location"}
                                        onClick={this.toggleSavedLocation}
                                    >
                                        star
                                    </i>
                                    <i className="material-icons location_type_icon">
                                        {(() => {
                                            switch (details.types[0]) {
                                                case "cafe":
                                                    return "local_cafe";
                                                case "library":
                                                    return "local_library";
                                                case "book_store":
                                                    return "local_library";
                                                case "restaurant":
                                                    return "restaurant";
                                                case "university":
                                                    return "school";
                                                default:
                                                    return "location_city";
                                            }
                                        })()}
                                    </i>
                                </h3>
                            </div>
                            <h4>
                                <i className="material-icons">location_on</i>
                                {details.formatted_address}
                            </h4>
                        </div>
                        <div className="location_sub_details">
                            <div className="sub_detail_box sub_hours">
                                <div className="sub_title">Hours</div>
                                <div className="sub_details">
                                    {details.opening_hours ?
                                        <>
                                            {details.opening_hours.weekday_text.map((item, idx) => {
                                                let current = new Date().getDay();
                                                current -= 1;
                                                if (current < 0) {
                                                    current = 6;
                                                }
                                                return (
                                                    <p key={idx} className={current === idx ? "current_day" : ""}>
                                                        {item}
                                                    </p>
                                                );
                                            })}
                                        </>
                                        :
                                        <p>Could not retrieve the opening hours.</p>
                                    }
                                </div>
                            </div>
                            <div className="sub_detail_box sub_contact">
                                <div className="sub_title">Contact</div>
                                <div className="sub_details">
                                    <p>
                                        <span>Local:</span> <span>{details.formatted_phone_number}</span>
                                    </p>
                                    <p>
                                        <span>Int'l:</span> <span>{details.international_phone_number}</span>
                                    </p>
                                    <p className="web_link">
                                        {details.website ? (
                                            <a target="_blank" rel="noopener noreferrer" href={details.website}>
                                                Visit Official Website
                                        </a>
                                        ) : (
                                                "Website Unavailable"
                                            )}
                                    </p>
                                </div>
                            </div>
                            <div className="sub_detail_box sub_rating">
                                <div className="sub_title">Rating</div>
                                <div className="sub_details">
                                    {this.calculateRating(details.rating)}
                                    <span className="total_ratings">based on {details.user_ratings_total} rating(s).</span>
                                    <span className="submit_review" onClick={this.reviewRedirect}>Review</span>
                                </div>
                            </div>
                            <div className="sub_detail_box sub_pricing">
                                <div className="sub_title">Average Pricing</div>
                                <div className="sub_details">{this.calculatePricing(details.price_level)}</div>
                            </div>
                        </div>
                    </div>
                    {reservation.status === "CANCELLED" || isEditing ? (
                        ""
                    ) : (
                            <button
                                type="button"
                                onClick={() => this.props.cancelReservation(reservation.reservation_id, this.props.index)}
                                className="btn_cancel_reservation"
                            >
                                Cancel Reservation
                    </button>
                        )}
                </form>
            );
    }
}

export default withRouter(ReservationDetails);
