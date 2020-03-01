import React from 'react';
import PlaceItem from './PlaceItem';

class PlaceList extends React.Component {

    render() {
        return (
            <div className="place_list_wrapper">{
                // takes in places list and return new array of placeItem components
                this.props.places.map((place, index) => {
                    return (
                        <PlaceItem
                            key={index}
                            index={index}
                            onPlaceSelect={() => this.props.onPlaceSelect(place, index)}
                            place={place}
                            selected={this.props.selected}
                            hover={this.props.hover}
                        />
                    );
                })
            }
            </div>
        );
    }
}
export default PlaceList;