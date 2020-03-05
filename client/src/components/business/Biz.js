import React from 'react';
import { withRouter } from "react-router-dom";
import ReviewList from "../rate/ReviewList";
import UserContext from "../../UserContext";
import "./Biz.scss";

// Display extended details for matches display of hours, location, and distance
class Biz extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = ({
            showGoogleReview: true, // on default show google review
            showStudyReview: false,
            reviewDetail: {},
        });
    }

    onRateSelect = event => {
        const userContext = this.context;
        if (!userContext.isAuthenticated) {
            event.preventDefault();
        } else {
            const location = {
                pathname: "/biz/rate",
                state: {
                    places_id: this.props.selectedPlaceDetail.place_id,
                    picture: this.props.selectedPlaceDetail.photos[0].getUrl(),
                    name: this.props.selectedPlaceDetail.name,
                    referral: "/maps",
                }
            };

            return this.props.history.push(location);
        }
    };

    onGoogleSelect = () => {
        this.setState({
            showGoogleReview: true,
            showStudyReview: false,
        });
    };

    onStudySelect = () => {
        this.setState({
            showGoogleReview: false,
            showStudyReview: true,
        },
            this.fetchReviews()
        );
    };

    onReservationSelect = event => {
        const userContext = this.context;
        if (!userContext.isAuthenticated) {
            event.preventDefault();
        } else {
            this.props.onReservationSelect();
        }
    }

    fetchReviews() {
        let auth2 = window.gapi.auth2.getAuthInstance();
        let googleUser = auth2.currentUser.get();
        let idToken = googleUser.getAuthResponse().id_token;

        let url = `/backend/locations/for_place/${this.props.selectedPlaceDetail.place_id}`;

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + idToken,
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log("Data: ", JSON.parse(data));
                this.setState({
                    reviewDetail: JSON.parse(data).location.ratings,
                });
            })
            .catch(error => {
                console.error("Error", error);
            });
    };

    render() {
        const userContext = this.context;
        const protectedClassName = userContext.isAuthenticated ? "" : "disabled";
        const { selectedPlace, selectedPlaceDetail, selectedPlaceDistance } = this.props;
        const { showGoogleReview, showStudyReview } = this.state;
        // console.log(selectedPlace);

        if (Object.keys(selectedPlaceDistance).length === 0 && selectedPlaceDistance.constructor === Object) {
            return null;
        } else {
            let displayDistance = this.props.selectedPlaceDistance.rows[0].elements[0].status === "NOT_FOUND" ? false : true;

            return (
                <div className="business_detail_wrapper">
                    <img className="image_container " src={selectedPlaceDetail.photos[0].getUrl()} alt=""></img>
                    <div className="utility_buttons_container">
                        <button className={"reservation_button " + protectedClassName}
                                onClick={this.onReservationSelect}>
                            Make Reservation
                        </button>
                    </div>
                    <div className="business_name_container">
                        <h2>{selectedPlace.name}</h2>
                    </div>
                    <div className="business_addr_container">
                        {selectedPlaceDetail.formatted_address}
                    </div>
                    {/* display distance only when available */}
                    {displayDistance &&
                        <div className="travel_detail_container">
                            <span className="distance">
                                Distance: <span className="sub">{selectedPlaceDistance.rows[0].elements[0].distance.text}</span>
                            </span>
                            <span className="driving_time">
                                Driving time: <span className="sub">{selectedPlaceDistance.rows[0].elements[0].duration.text}</span>
                            </span>
                        </div>
                    }
                    <div className="business_hours_container">
                        <div className="title"> Opening Hours: </div>
                        {selectedPlaceDetail.opening_hours.weekday_text.map((text, index) => {
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
                    </div>
                    <div className="review_button_container">
                        <button className={"review_button " + protectedClassName} onClick={this.onRateSelect}>
                            Submit a Review
                        </button>
                    </div>
                    <div className="view_review_container">
                        <span onClick={this.onGoogleSelect} className={showGoogleReview ? "selected" : ""}>
                            Google<br />Reviews
                        </span>
                        <span onClick={this.onStudySelect} className={showStudyReview ? "selected" : ""}>
                            Study Buddies<br />Reviews
                        </span>
                    </div>
                    <div>
                        {this.state.showGoogleReview ? (
                            <ReviewList
                                reviews={selectedPlaceDetail.reviews}
                            />
                        ) : (
                            <ReviewList 
                                reviews={this.state.reviewDetail}
                            />
                        )}
                    </div>
                </div>
            );
        }
    }
}

export default withRouter(Biz);
