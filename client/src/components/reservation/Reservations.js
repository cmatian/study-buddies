import React from "react";
// import { Redirect } from "react-router-dom";
import ReservationCard from "./ReservationCard";
import ReservationDetails from "./ReservationDetails";
import "./Reservations.scss";
import UserContext from "../../UserContext";

class Reservations extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            isFetched: false,
            isFetching: true,
            isError: false,
            reservationData: {},
            isSelected: null, // This is the reservation id of the card that is selected
            isSelectedIdx: null,
            id_token: null,
        };
    }

    updateSelectedCard = event => {
        const itemkey = event.currentTarget.getAttribute("data-itemkey");
        const itemidx = event.currentTarget.getAttribute("data-index");
        // Prevent re-render on already selected keys
        if (parseInt(this.state.isSelected) === parseInt(itemkey)) {
            return;
        }
        this.setState({
            isSelected: parseInt(itemkey),
            isSelectedIdx: parseInt(itemidx),
        });
    };

    maybeFetchData() {
        const userContext = this.context;
        if (!this.state.isFetched && userContext.isAuthenticated) {
            this.fetchRequest(userContext.user);
        }
    }

    fetchRequest = (googleUser, index = 0) => {
        let token = googleUser.getAuthResponse().id_token;
        fetch("/backend/users/reservations", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then(response => response.json())
            .then(response => {
                console.log("reservation data: " + response);
                let data = JSON.parse(response);
                let selectionState = null;
                let selectionStateIdx = null;
                if (data.reservations.length > 0) {
                    // set the selection state for the first item in the array if the array is not empty
                    selectionState = data.reservations[index].reservation_id;
                    selectionStateIdx = index; // default 0 from function param
                }
                this.setState({
                    reservationData: data,
                    isFetching: false,
                    isFetched: true,
                    isError: false,
                    isSelected: selectionState,
                    isSelectedIdx: selectionStateIdx,
                });
            })
            .catch(error => {
                console.error("Error", error);
                this.setState({ ...this.state, isFetching: false, isError: true, isFetched: true });
            });
    };

    catchErrors = () => {
        throw new Error("There was an issue with the initialization.");
    };

    cancelReservation = reservation_id => {
        console.log(reservation_id);
    };

    componentDidMount() {
        this.maybeFetchData();
    }

    componentDidUpdate() {
        this.maybeFetchData();
    }

    render() {
        const { isFetching, reservationData, isSelected, isSelectedIdx } = this.state;
        return isFetching ? (
            <div>Loading...</div>
        ) : (
            <div className="reservation_wrapper">
                <h1>My Reservations</h1>
                <div className="reservation_window">
                    <div className="reservation_cards">
                        {reservationData.reservations.map((item, index) => {
                            return (
                                <ReservationCard
                                    key={item.reservation_id}
                                    index={index}
                                    itemkey={item.reservation_id}
                                    selectionkey={isSelected}
                                    data={item}
                                    UpdateSelection={this.updateSelectedCard}
                                />
                            );
                        })}
                    </div>
                    <div className="reservation_detail_window">
                        <ReservationDetails
                            cancelReservation={this.cancelReservation}
                            reservations={reservationData.reservations}
                            selected={isSelected}
                            index={isSelectedIdx}
                        />
                    </div>
                </div>
            </div>
        );
    }

    statusMessage() {
        if (this.state.isFetching) {
            return "Fetching reservations...";
        } else if (this.state.isError) {
            return "Error fetching reservations.";
        } else if (this.state.isFetched) {
            return "Data loaded!";
        } else {
            return "Waiting...";
        }
    }
}

export default Reservations;
