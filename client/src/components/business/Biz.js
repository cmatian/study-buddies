import React from 'react';
import { withRouter } from "react-router-dom";
import ReviewList from "../rate/ReviewList"
import "./Biz.scss";

// Display extended details for matches display of hours, location, and distance
class Biz extends React.Component {
    constructor(props) {
        super(props);
        this.state = ({
            showGoogleReview: true, // on default show google review
            showStudyReview: false,
            reviewDetail: {},
        });
    }

    handleRedriect = () => {
        const location = {
            pathname: "biz/rate",
            state: {
                places_id: this.props.selectedPlaceDetail.place_id,
                name: this.props.selectedPlaceDetail.name,
            }
        }

        return this.props.history.push(location);
    }

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
        });
        this.fetchReviews();
    };

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
                this.setState({reviewDetail: JSON.parse(data).location.ratings});
            })
            .catch(error => {
                console.error("Error", error);
            });
    };

    handleSavedLocation = () => {
        const {selectedPlaceDetail} = this.props;
        let auth2 = window.gapi.auth2.getAuthInstance();
        let googleUser = auth2.currentUser.get();
        let idToken = googleUser.getAuthResponse().id_token;
        
        let data = {
            places_id: selectedPlaceDetail.place_id,
            userId: googleUser,
            nickname: selectedPlaceDetail.name, 
        }

        console.log("Saved location data: ", data);

        fetch("/backend/users/savedLocations", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + idToken,
            },
        })
            .then(response => {
                console.log("Success", response.json());
            })
            .catch(error => {
                console.log("Error", error);
            });
    };

    render() {
        const {selectedPlace, selectedPlaceDetail, selectedPlaceDistance, onReservationSelect} = this.props;
        // console.log(selectedPlace);
        let emptyObj = {};    // place holder till i get study review from db
       
        if (Object.keys(selectedPlaceDistance).length === 0 && selectedPlaceDistance.constructor === Object) {
            return null;
        } else {
            let displayDistance = this.props.selectedPlaceDistance.rows[0].elements[0].status === "NOT_FOUND" ? false : true;
           
            return(
                <div className="business_detail_wrapper">
                    <div className="business_name_container">
                        <h2>{selectedPlace.name}</h2>
                    </div>
                    <img className = "image_container "src={selectedPlaceDetail.photos[0].getUrl()} alt=""></img>
                    <div className="business_addr_container">
                        {selectedPlaceDetail.formatted_address}
                    </div>
                    {/* display distance only when available */}
                    {displayDistance ?
                        <div className="travel_detail_container">
                            <span>
                               Distance: {selectedPlaceDistance.rows[0].elements[0].distance.text} 
                            </span>
                            <span>
                                Driving time: {selectedPlaceDistance.rows[0].elements[0].duration.text}
                            </span>
                        </div>
                    : null }
                    <div className="business_hours_container">
                        <b> Opening Hours: </b>
                        <br/>
                        {selectedPlaceDetail.opening_hours.weekday_text.map((text, index) => {
                            return <div key={index.toString()}>{text}<br/></div>
                        })}
                    </div>
                    <div className="utility_buttons_container">
                        <button onClick={() => onReservationSelect()}>Make Reservation</button>
                        <button onClick={() => this.handleSavedLocation()}>Save</button>
                        <button onClick={() => this.handleRedriect()}>Write a Review</button>                    
                    </div>
                    <div className="view_review_container">
                        <span onClick={() => this.onGoogleSelect()}>
                            Google Reviews
                        </span>
                        <span onClick={() => this.onStudySelect()}>
                            Study Buddies Reviews
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