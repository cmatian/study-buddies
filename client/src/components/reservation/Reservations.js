import React from "react";
import { Redirect } from "react-router-dom";
import ReservationCard from "./ReservationCard";
import ReservationDetails from "./ReservationDetails";
import "./styles/Reservations.scss";
import UserContext from "../../UserContext";
import Loader from '../layouts/Loader';

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
            needsSignin: false,
            hideSubmitted: false,
            hideCancelled: false,
        };
    }

    clearFilters = () => {
        this.setState({
            hideSubmitted: false,
            hideCancelled: false,
        });
    };

    toggleSubmitted = () => {
        this.setState(prevState => ({
            hideSubmitted: !prevState.hideSubmitted,
        }));
    };

    toggleCancelled = () => {
        this.setState(prevState => ({
            hideCancelled: !prevState.hideCancelled,
        }));
    };

    updateSelectedCard = event => {
        const itemkey = event.currentTarget.getAttribute("data-itemkey");
        const itemidx = event.currentTarget.getAttribute("data-index");
        // Prevent re-render on already selected keys
        if (parseInt(this.state.isSelected) === parseInt(itemkey)) {
            return;
        }
        this.setState({
            ...this.state,
            isSelected: parseInt(itemkey),
            isSelectedIdx: parseInt(itemidx),
        });
    };

    maybeFetchData() {
        const userContext = this.context;
        if (!this.state.isFetched) {
            if (userContext.isAuthenticated) {
                this.fetchRequest(userContext.user);
            } else if (userContext.isUserChecked) {
                this.setState({
                    ...this.state,
                    isFetching: false,
                    isFetched: true,
                    isError: false,
                    needsSignin: true,
                });
            }
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
                    ...this.state,
                    reservationData: data || {},
                    isFetching: false,
                    isFetched: true,
                    isError: false,
                    isSelected: selectionState,
                    isSelectedIdx: selectionStateIdx,
                });
            })
            .catch(error => {
                console.error("Error", error);
                this.setState({
                    ...this.state,
                    isFetching: false,
                    isError: true,
                    isFetched: true
                });
            });
    };

    catchErrors = () => {
        throw new Error("There was an issue with the initialization.");
    };

    cancelReservation = (reservation_id, index) => {
        const googleUser = this.context.user;
        let token = googleUser.getAuthResponse().id_token;

        fetch(`/backend/users/reservations/${reservation_id}`, {
            method: "PATCH",
            body: JSON.stringify({
                status: "CANCELLED",
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then(response => {
                response.json();
            })
            .then(response => {
                console.log("Success", response);
                // Refetch the updated data
                this.fetchRequest(googleUser, index);
            })
            .catch(error => {
                console.log("Error", error);
            });
    };

    updateReservation = (data, index) => {
        const googleUser = this.context.user;
        let token = googleUser.getAuthResponse().id_token;
        let reservation_id = data.id;
        fetch(`/backend/users/reservations/${reservation_id}`, {
            method: "PATCH",
            body: JSON.stringify({
                group_size: data.group_size,
                duration_minutes: data.duration_minutes,
                date_time: data.date_time,
                name: data.name,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then(response => {
                response.json();
            })
            .then(response => {
                console.log("Success", response);
                // Refetch the updated data
                this.fetchRequest(googleUser, index);
            })
            .catch(error => {
                console.log("Error", error);
            });
    };

    addSavedLocation = (data, index) => {
        const googleUser = this.context.user;
        let token = googleUser.getAuthResponse().id_token;
        fetch("/backend/users/savedLocations", {
            method: "POST",
            body: JSON.stringify({
                places_id: data.places_id,
                userId: data.user_id,
                locationId: data.location_id,
                nickname: data.nickname,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then(response => {
                response.json();
            })
            .then(response => {
                console.log("Success", response);
                this.fetchRequest(googleUser, index);
            })
            .catch(error => {
                console.log("Error", error);
            });
    };

    deleteSavedLocation = (data, index) => {
        const googleUser = this.context.user;
        let token = googleUser.getAuthResponse().id_token;
        fetch(`/backend/users/savedLocations/for_place/${data.places_id}`, {
            method: "DELETE",
            body: JSON.stringify({
                places_id: data.places_id,
                userId: data.user_id,
            }),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then(response => {
                console.log("Success", response);
                this.fetchRequest(googleUser, index);
            })
            .catch(error => {
                console.log("Error", error);
            });
    };

    componentDidMount() {
        this.maybeFetchData();
    }

    componentDidUpdate() {
        this.maybeFetchData();
    }

    render() {
        const { isFetching,
            isError,
            reservationData,
            isSelected,
            isSelectedIdx,
            needsSignin,
            hideSubmitted,
            hideCancelled } = this.state;

        let count = 0;

        if (needsSignin) {
            return <Redirect to="/signin" />;
        }

        // Is the data loading?
        if (isFetching) {
            return <Loader />;
        }

        // If there was an error trying to fetch the data from the server.
        if (isError) {
            return (
                <div className="reservation_wrapper">
                    <h1>My Reservations</h1>
                    <div className="reservation_window">
                        <div className="error_res_group">
                            <i className="material-icons">error</i>
                            <span>There was an error loading your reservations.<br />Please wait and reload the page to try again.</span>
                        </div>
                    </div >
                </div >
            );
        }

        // If the user has no reservations.
        if (!isFetching && reservationData.reservations.length < 1 && !isError) {
            return (
                <div className="reservation_wrapper">
                    <h1>My Reservations</h1>
                    <div className="reservation_window">
                        <div className="no_res_group">
                            <i className="material-icons">error</i>
                            <span>You currently do not have any reservations.</span>
                        </div>
                    </div>
                </div>
            );
        }

        // Return the reservation block assuming the user has no errors and is done fetching
        return (
            <div className="reservation_wrapper">
                <h1>My Reservations</h1>
                <div className="filter_buttons">
                    <span className="text">Toggle Filters:</span>
                    <button className={"hideSubmitted " + (hideSubmitted ? "active" : "")} onClick={this.toggleSubmitted}>
                        Hide Submitted
                    </button>
                    <button className={"hideCancelled " + (hideCancelled ? "active" : "")} onClick={this.toggleCancelled}>
                        Hide Cancelled
                    </button>
                    {(hideSubmitted || hideCancelled) &&
                        <span className="reset" onClick={this.clearFilters}>Clear Filters</span>
                    }
                </div>
                <div className="reservation_window">
                    <div className="reservation_cards">
                        {reservationData.reservations.map((item, index) => {
                            if (this.state.hideSubmitted && item.status === "SUBMITTED") {
                                return <></>;
                            }
                            if (this.state.hideCancelled && item.status === "CANCELLED") {
                                return <></>;
                            }
                            count++;
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
                        {count > 0 ? (
                            <ReservationDetails
                                cancelReservation={this.cancelReservation}
                                updateReservation={this.updateReservation}
                                deleteSavedLocation={this.deleteSavedLocation}
                                addSavedLocation={this.addSavedLocation}
                                reservations={reservationData.reservations}
                                selected={isSelected}
                                index={isSelectedIdx}
                            />) : (
                                <div className="no_res_details">
                                    <span className="icon">
                                        <i className="material-icons">warning</i>
                                    </span>
                                    <span className="text">No reservations match the currently selected filters.</span>
                                </div>
                            )
                        }
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

export default Reservations;;
