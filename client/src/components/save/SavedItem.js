import React from "react";

class SavedItem extends React.Component {
    render() {
        const { savedLocation, onDelete } = this.props;

        // console.log("saved_locations: ", savedLocation.location.places_id)
        // let places_id = savedLocation.location.places_id;
        
        return(
            <div>
                {savedLocation.nickname}
                <button 
                    onClick={() => onDelete(savedLocation.location.places_id)}
                > delete
                </button>
            </div>
        );
    }
}

export default SavedItem;