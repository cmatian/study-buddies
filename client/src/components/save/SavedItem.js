import React from "react";
import { Link, withRouter } from 'react-router-dom';

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

    handleRedirect = (event) => {
        event.preventDefault();
        this.viewDetails();
    };

    render() {
        const { savedLocation, onDelete } = this.props;
        // console.log("saved_locations: ", savedLocation.location.places_id)
        // let places_id = savedLocation.location.places_id;
        return (
            <div className="saved_item">
                <div className="check_item" onClick={this.handleRedirect}>{savedLocation.nickname}</div>
                <i className="material-icons remove_item" title="Remove from saved locations" onClick={() => onDelete(savedLocation.location.places_id)}>delete</i>
            </div>
        );
    }
}

export default withRouter(SavedItem);