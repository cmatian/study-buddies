import React from 'react';

// individual place item
// displaying: name, rating, picture
class PlaceItem extends React.Component {
    render() {
        const { place } = this.props;
        // console.log('place item props', this.props)
        return(
            <div>
            <div>{place.name}</div>            
            </div>

        );
    }
}
export default PlaceItem;