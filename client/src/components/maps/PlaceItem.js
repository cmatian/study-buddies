import React from 'react';
import './styles/PlaceItem.scss';

// individual place item
// displaying: name, rating, estimated cost
class PlaceItem extends React.Component {
    getTypeString = (type) => {
        switch (type) {
            case "cafe":
                return "Cafe";
            case "library":
                return "Library";
            case "book_store":
                return "Book Store";
            case "restaurant":
                return "Restaurant";
            case "university":
                return "University";
            default:
                return "Hot Spot";
        }
    };

    render() {
        const { place, onPlaceSelect, selected, index, hover } = this.props;
        const type = place.types[0];
        let active = selected === index; // bool
        let shade = hover === index;

        // onclick update calls a call back function to update state of placeSlected
        return (
            <div className={"place_item_card " + (active ? "active " : "") + (shade ? "hover " : "")} onClick={() => onPlaceSelect(place)}>
                <span className="name">{place.name}</span> <span className="type">{this.getTypeString(type)}</span>
            </div>
        );
    }
}
export default PlaceItem;
