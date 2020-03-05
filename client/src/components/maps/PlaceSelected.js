import React from 'react';
import UserContext from "../../UserContext";
import './PlaceSelected.scss';

// display currently selected place with detail information
class PlaceSelected extends React.Component {
    static contextType = UserContext;

    onReservationSelect = event => {
        const userContext = this.context;
        if (!userContext.isAuthenticated) {
            event.preventDefault();
        } else {
            this.props.onReservationSelect();
        }
    }

    render() {
        const userContext = this.context;
        const protectedClassName = userContext.isAuthenticated ? "" : "disabled";
        const { place, onDetailSelect } = this.props;
        return (
            <div className="focus_wrapper">
                {!this.props.place ? (
                    <div className="blank">Select a location</div>
                ) : (
                        <>
                            <span className="sticky">Current Focus</span>
                            <div className="focus_details">
                                <div className="title">{place.name}</div>
                                <div className="address">{place.formatted_address}</div>
                            </div >
                            <div className="focus_toolbar">
                                <button className={"reservation " + protectedClassName}
                                        onClick={this.onReservationSelect}>
                                    Make Reservation
                                </button>
                                <button className="details" onClick={() => onDetailSelect()}>Details</button>
                            </div>
                        </>
                    )
                }
            </div>
        );
    }
}
export default PlaceSelected;
