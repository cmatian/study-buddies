import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const ReserveStatus = (props) => {
    const { isSuccess, isError, isErrorMessage } = props;

    if (isSuccess) {
        return (
            <div className="success_container">
                <div className="header">
                    <i className="material-icons success">check_circle</i>
                    <span className="title">Reservation Success!</span>
                </div>
                <div className="body">
                    <p className="text">You can make another reservation or view your current reservations.</p>
                    <Link to="/users/reservations" className="reservation_link">My Reservations Page</Link>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="error_container">
                <div className="header">
                    <i class="material-icons error">error_outline</i>
                    <div className="title">Reservation Error!</div>
                </div>
                <div className="body">
                    <p className="text">There was an issue trying to submit your reservation: {isErrorMessage}.</p>
                    <p className="text">Please try again later.</p>
                </div>
            </div>
        );
    }
};

export default withRouter(ReserveStatus);