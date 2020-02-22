import React from "react";
import DatePicker from "react-datepicker";
import { subDays, setHours, setMinutes, parseISO, getDay } from "date-fns";
import DatePickerButton from "../layouts/form/DatePickerButton";
import "react-datepicker/dist/react-datepicker.css"; // DatePicker CSS import
import "./ReservationDetails.scss";

const google = window.google;
class ReservationDetails extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            details: {}, // Google Places Details
            oldindex: props.index,
            map: null,
            formData: {},
            meeting_date_time: parseISO(props.reservations[this.props.index].date_time),
            initialTime: {
                closed_days: [],
                open: { hours: 0, minutes: 0 }, // 12:00 am
                close: { hours: 24, minutes: 0 }, // 12:00 am},
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
                "opening_hours",
                "price_level",
                "website",
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

    filterOpenDays = array => {
        if (array.length < 1) {
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
        const { periods } = this.state.details.opening_hours;
        let { initialTime } = this.state;

        // Generate a key value pair from the periods array that google provides us.
        const periods_idx = this.indexTimePeriods(periods, "day");

        // Convert periods_idx keys to an integer array for use (so we can set the open days)
        const openDays = this.convertStringToInt(Object.keys(periods_idx));

        const closedDays = this.filterOpenDays(openDays);

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
                    hours: periods_idx[day].close.hours,
                    minutes: periods_idx[day].close.minutes,
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

    handleChangeDateTime = date => {
        this.setState({ meeting_date_time: date });
    };

    // Need to initialize the selected date when the user opens the date box.
    // This will only occur once when the user opens the calendar for the first time.
    initDateTime = () => {
        let date = parseISO(this.props.reservations[this.props.index].date_time);
        // Returning an object containing the initialTime obj and the closed_days array.
        // We need to spread both results into the state.initialTime object.
        let obj = this.setOperationHours(date, true);
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
                    isLoading: true,
                    isTimeInitialized: false, // reset initialization
                    // Reset date time because we're switching to a different reservation
                    meeting_date_time: parseISO(this.props.reservations[this.props.index].date_time),
                },
                // setState callback expects a function but async always returns a promise, so just wrap
                // getDetails in an IIFE
                () => this.getDetails(undefined, this.props.index)
            );
        }
    }

    render() {
        const { details, initialTime, isLoading, meeting_date_time } = this.state;
        const reservation = this.props.reservations[this.props.index];
        const date_options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };

        return isLoading ? (
            <div>Loading</div>
        ) : (
            <form method="post" name="reservation_form" className="reservation_form">
                <div className="content_group row spc_btwn">
                    <div className="res_title">{reservation.name}</div>
                    <div className={"res_status " + (reservation.status === "CANCELLED" ? "red" : "green")}>
                        {reservation.status}
                    </div>
                </div>
                <div className="content_group row">
                    <div className="date_time_info_window">
                        <p className="date">{meeting_date_time.toLocaleDateString(undefined, date_options)}</p>
                        <p className="time">{meeting_date_time.toLocaleTimeString("en-US")}</p>
                    </div>
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
                        maxTime={setHours(setMinutes(new Date(), initialTime.close.minutes), initialTime.close.hours)}
                        value={"edit"}
                        showTimeSelect
                        withPortal
                        timeIntervals={30}
                        dateFormat="MMM d, yyyy - h:mm aa"
                        customInput={<DatePickerButton />}
                    />
                </div>
                <div className="location_details_window">
                    <i className="material-icons location_type_icon">
                        {(() => {
                            switch (details.types[0]) {
                                case "cafe":
                                    return "local_cafe";
                                case "library" || "bookstore":
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
                    <div className="location_primary_details">
                        <h3>@ {details.name}</h3>
                        <h4>
                            <i className="material-icons">location_on</i>
                            {details.formatted_address}
                        </h4>
                    </div>
                    <div className="location_sub_details">
                        <div className="sub_detail_box sub_hours">
                            <div className="sub_title">Hours</div>
                            <div className="sub_details">
                                {details.opening_hours.weekday_text.map((item, idx) => {
                                    let current = new Date().getDay();
                                    // Set Sunday
                                    if (current - 1 < 0) {
                                        current = 6;
                                        // Set Monday
                                    } else if (current + 1 > 6) {
                                        current = 0;
                                    } else {
                                        current -= 1;
                                    }
                                    return (
                                        <p key={idx} className={current === idx ? "current_day" : ""}>
                                            {item}
                                        </p>
                                    );
                                })}
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
                            </div>
                        </div>
                        <div className="sub_detail_box sub_pricing">
                            <div className="sub_title">Average Pricing</div>
                            <div className="sub_details">{this.calculatePricing(details.price_level)}</div>
                        </div>
                    </div>
                </div>
                {reservation.status === "CANCELLED" ? (
                    ""
                ) : (
                    <button
                        type="button"
                        onClick={() => this.props.cancelReservation(reservation.reservation_id)}
                        className="btn_cancel_reservation"
                    >
                        Cancel Reservation
                    </button>
                )}
            </form>
        );
    }
}

export default ReservationDetails;
