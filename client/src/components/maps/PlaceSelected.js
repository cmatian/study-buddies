import React from 'react';

// display currently selected place with detail information
class PlaceSelected extends React.Component {
    render() {
        if (!this.props.place) {
            return <div>Loading..</div>;
        } else {
            const {place, onDetailSelect, onReservationSelect} = this.props;
            let rating = place.rating === undefined ? 0 : place.rating;
            let estCost = place.price_level === undefined ? 'N/A' : place.price_level;

            // console.log('PlaceSelected props: ', this.props);
            return(
                <div>
                    <div className="place_selected_wrapper" onClick={()=> onDetailSelect()}>
                        <div>{place.name}</div>
                        <div>Address: {place.formatted_address}</div>
                        <div>Rating: {rating}</div>
                        <div>Cost: {estCost}</div>
                    </div>
                    <div>
                        <button onClick={()=>onReservationSelect()}>Make Reservation</button>
                    </div>
                </div>

            );            
        }
    }
}
export default PlaceSelected;