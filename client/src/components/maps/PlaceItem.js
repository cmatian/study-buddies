import React from 'react';
import './PlaceItem.scss'

// individual place item
// displaying: name, rating, estimated cost
class PlaceItem extends React.Component {
    render() {
        const { place, onPlaceSelect } = this.props;
        // console.log('place item props', this.props)

        let rating = place.rating === undefined ? 0 : place.rating;
        let estCost = place.price_level === undefined ? 'N/A' : place.price_level;

        // onclick update calls a call back function to update state of placeSlected
        return(    
            <div className="place_item_card" onClick={() => onPlaceSelect(place)}>
                <div>{place.name}</div> 
                <div>Rating: {rating}</div>
                <div>Cost: {estCost}</div>
            </div>
        );
    }
}
export default PlaceItem;