import React from 'react';
import "./Biz.scss";

// Display extended details for matches display of hours, location, and distance
class Biz extends React.Component {
    render() {
        const {selectedPlace, selectedPlaceDetail, selectedPlaceDistance, onReservationSelect} = this.props;
        if (Object.keys(selectedPlaceDistance).length === 0 && selectedPlaceDistance.constructor === Object) {
            return null;
        } else {
            return(
                <div className="business_detail_wrapper">
                    <div className="business_name_container">
                        {selectedPlace.name}
                    </div>
                    <img className = "image_container "src={selectedPlaceDetail.photos[0].getUrl()} alt=""></img>
                    <div className="business_addr_container">
                        {selectedPlaceDetail.formatted_address}
                    </div>
                    <div className="travel_detail_container">
                        Distance: {selectedPlaceDistance.rows[0].elements[0].distance.text}
                        <br/>
                        Driving time: {selectedPlaceDistance.rows[0].elements[0].duration.text}
                    </div>
                    <div className="business_hours_container">
                        Opening Hours:
                        <br/>
                        {selectedPlaceDetail.opening_hours.weekday_text.map(text => {
                            return <div>{text}<br/></div>
                        })}
                    </div>
                    <div className="utility_buttons_container">
                        <button onClick={()=> onReservationSelect()}>Make Reservation</button>
                        <button>Save</button>
                        <button>Write a Review</button>                    
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

export default Biz;