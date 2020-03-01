import React from 'react';
import './PlaceSelected.scss';

// display currently selected place with detail information
class PlaceSelected extends React.Component {
    render() {

        const { place, onDetailSelect, onReservationSelect } = this.props;
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
                                <button className="reservation" onClick={() => onReservationSelect()}>Make Reservation</button>
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