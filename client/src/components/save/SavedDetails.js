import React from 'react';
import Loader from '../layouts/Loader';
import Reserve from '../business/Reserve';
import "./SavedDetail.scss";

const google = window.google;
class SavedDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            data: props.location.state ? props.location.state.data : undefined,
            details: {
                place_id: props.location.state ? props.location.state.data.location.places_id : undefined,
            },
            map: null,
            isExpanded: false,
            isLoading: true,
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

    getDetails = async (response = this.state.map) => {
        let map = response;
        let item_place_id = this.state.data.location.places_id;
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
                        details: {
                            ...this.state.details, ...results
                        }, // set the results of the getDetails request
                        isLoading: false, // No longer loading
                        isExpanded: false, // Hide Make Reservation each mount
                        map: map, // Set the map object so we can reference it directly.
                    });
                }
            });
        });
    };

    calculatePricing = pricing => {
        if (!pricing) {
            return <span className="no_price">Pricing for this location is not available.</span>;
        }
        const price_text = ["Inexpensive", "Inexpensive", "Moderate", "Pricey", "Ultra High End"];
        const price_class = ["inexpensive", "inexpensive", "moderate", "pricey", "ultra_high_end"];

        return (
            <span className={price_class[pricing]}>{price_text[pricing]}</span>
        );
    };

    ratingColor = (rating) => {
        let color = '';
        if (rating === undefined || rating === null) {
            return (
                <span className="gray">N/A</span>
            );
        }

        const key = parseInt(Math.ceil(rating));
        switch (key) {
            case 0:
                color = 'red';
                break;
            case 1:
                color = 'red';
                break;
            case 2:
                color = 'orange';
                break;
            case 3:
                color = "light_green";
                break;
            case 4:
                color = "green";
                break;
            case 5:
                color = 'green';
                break;
            default:
                color = 'green';
                break;
        }

        return (
            <span title="Rating" className={"rating " + color}>{rating}</span>
        );
    };

    makeReservation = () => {
        this.setState(prevState => ({
            isExpanded: !prevState.isExpanded,
        }));
    };

    closeReservationBar = () => {
        this.setState({
            isExpanded: false,
        });
    };

    goBack = () => {
        const { history } = this.props;
        return history.push(history.location.state.referral);
    };

    componentDidMount() {
        if (!this.props.history.location.state) {
            console.log("Caught referral with undefined data.");
            return this.props.history.push("/maps/users/saved");
        }
        this.initMap();
    }

    render() {
        const { isLoading, data, details, isExpanded } = this.state;

        if (!this.props.location.state || this.props.location.state === null) {
            return <></>; // Additional catch for invalid referrals. 
        }

        return (
            <div className="saved_details_wrapper">
                {!isLoading && Object.keys(details).length > 0 &&
                    <div className={"side_bar_container " + (isExpanded ? "push" : "")}>
                        <Reserve data={details} />
                    </div>
                }
                <div className={"saved_details_container " + (isExpanded ? "push" : "")}>
                    {isExpanded &&
                        <div className="close_reservation" onClick={this.closeReservationBar}>
                            <i className="material-icons">close</i>
                        </div>
                    }
                    <div className="overlay"></div>
                    <div className="header">
                        <div className="button_toolbar">
                            <button type="button" className="goback_btn" onClick={this.goBack}>Return to Saved Locations</button>
                        </div>
                        <h1 className="header_text">{data.nickname} <span className="aux_text">| Details</span></h1>
                    </div>
                    <div className="body">
                        {isLoading &&
                            <Loader />
                        }
                        {(!isLoading && Object.keys(details).length > 0) && (
                            <div className="body_content">
                                <div className="button_toolbar">
                                    <button type="button" className="res_btn" onClick={this.makeReservation}>Make Reservation</button>
                                </div>
                                <div className="detail_group">
                                    <i className="material-icons">location_on</i>
                                    <div className="text_group">
                                        <div className="label">Address</div>
                                        <div className="text">{details.formatted_address}</div>
                                    </div>
                                </div>
                                <div className="detail_group">
                                    <i className="material-icons">contact_phone</i>
                                    <div className="text_group">
                                        <div className="label">Contact</div>
                                        <div className="text">{details.international_phone_number}</div>
                                    </div>
                                </div>
                                <div className="detail_group">
                                    <i className="material-icons">attach_money</i>
                                    <div className="text_group">
                                        <div className="label">Pricing</div>
                                        <div className="text pricing">{this.calculatePricing(details.price_level)}</div>
                                    </div>
                                </div>
                                <div className="detail_group">
                                    <i className="material-icons">rate_review</i>
                                    <div className="text_group">
                                        <div className="label">Rating</div>
                                        <div className="text">{this.ratingColor(details.rating)}</div>
                                    </div>
                                </div>
                                <div className="detail_group">
                                    <i className="material-icons">access_time</i>
                                    <div className="text_group">
                                        <div className="label">Hours</div>
                                        <div className="text hours">
                                            {details.opening_hours ?
                                                <>
                                                    {details.opening_hours.weekday_text.map((text, index) => {
                                                        let current = new Date().getDay();
                                                        current -= 1;
                                                        if (current < 0) {
                                                            current = 6;
                                                        }
                                                        return (
                                                            <div key={index} className={"day " + (current === index ? "current_day" : "")}>
                                                                {text}
                                                            </div>
                                                        );
                                                    })}
                                                </>
                                                :
                                                <span>Could not retrieve the opening hours.</span>
                                            }
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        );
    }

}

export default SavedDetails;