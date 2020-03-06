import React from "react";
import { withRouter } from 'react-router-dom';

class SavedItem extends React.Component {

    viewDetails = () => {
        const { savedLocation } = this.props;
        const location = {
            pathname: "/maps/users/saved/details",
            state: {
                data: {
                    ...savedLocation,
                },
                referral: "/maps/users/saved",
            }
        };
        return this.props.history.push(location);
    };

    render() {
        const { savedLocation, onDelete } = this.props;
        // console.log("saved_locations: ", savedLocation.location.places_id)
        // let places_id = savedLocation.location.places_id;
        return (
            <div>
                {savedLocation.nickname}
                <button onClick={this.viewDetails}>See Details</button>
                <button
                    onClick={() => onDelete(savedLocation.location.places_id)}
                > delete
                </button>
            </div>
        );
    }
}

export default withRouter(SavedItem);