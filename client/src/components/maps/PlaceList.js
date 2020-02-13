import React from 'react';
import PlaceItem from './PlaceItem';

class PlaceList extends React.Component {       
    render() {
        return(
            <div>{
                // takes in places list and return new array of placeItem components
                this.props.places.map((place) => {
                    // TODO: ADD UNIQUE KEY PROP TO EACH CHILD COMPONENT
                    return <PlaceItem  place={place} />;
                })
            }
            </div> 
        );
    }
}
export default PlaceList;