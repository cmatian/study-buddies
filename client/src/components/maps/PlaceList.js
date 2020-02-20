import React from 'react';
import PlaceItem from './PlaceItem';

class PlaceList extends React.Component {       
    render() {
        return(
            <div>{
                // takes in places list and return new array of placeItem components
                this.props.places.map((place) => {
                    return <PlaceItem key={place.id} onPlaceSelect={this.props.onPlaceSelect} place={place} />;
                })
            }
            </div> 
        );
    }
}
export default PlaceList;