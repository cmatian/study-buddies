import React from 'react';
import { withRouter } from "react-router-dom";
import "./Biz.scss";

// Display extended details for matches display of hours, location, and distance
class Biz extends React.Component {
    handleRedriect = () => {
        return this.props.history.push("biz/rate");
    }

    render() {
        const {selectedPlace, selectedPlaceDetail, selectedPlaceDistance, onReservationSelect} = this.props;

        if (Object.keys(selectedPlaceDistance).length === 0 && selectedPlaceDistance.constructor === Object) {
            return null;
        } else {
            let displayDistance = this.props.selectedPlaceDistance.rows[0].elements[0].status === 'NOT_FOUND' ? false : true;
           
            return(
                <div className="business_detail_wrapper">
                    <div className="business_name_container">
                        {selectedPlace.name}
                    </div>
                    <img className = "image_container "src={selectedPlaceDetail.photos[0].getUrl()} alt=""></img>
                    <div className="business_addr_container">
                        {selectedPlaceDetail.formatted_address}
                    </div>
                    {/* display distance only when available */}
                    {displayDistance ?
                        <div className="travel_detail_container">
                            Distance: {selectedPlaceDistance.rows[0].elements[0].distance.text}
                            <br/>
                            Driving time: {selectedPlaceDistance.rows[0].elements[0].duration.text}
                        </div>
                    : null }
                    <div className="business_hours_container">
                        Opening Hours:
                        <br/>
                        {selectedPlaceDetail.opening_hours.weekday_text.map((text, index) => {
                            return <div key={index}>{text}<br/></div>
                        })}
                    </div>
                    <div className="utility_buttons_container">
                        <button onClick={()=> onReservationSelect()}>Make Reservation</button>
                        <button>Save</button>
                        <button onClick={()=>this.handleRedriect()}>Write a Review</button>                    
                    </div>
                    <div className="view_review_container">
                        <div>
                            Google Reviews
                        </div>
                        <div>
                            Study Buddies Reviews
                        </div>
                    </div>
                </div>
            );                
        }
    }
}

export default withRouter(Biz);