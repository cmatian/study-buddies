import React from "react";
import UserContext from "../../UserContext";
import SavedItem from "./SavedItem";
import Loader from '../layouts/Loader';
import "./styles/SavedList.scss";

class SavedList extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);

        this.state = ({
            isFetched: false,   // flag for fetched data
            isFetching: true,   // flag for fetching data
            savedLocations: [],
            grid: false,
        });
    }

    // on inital load get saved location
    componentDidMount() {
        this.maybeFetchData();
    }

    // on upddate check if data
    componentDidUpdate() {
        this.maybeFetchData();
    }

    // fetches data if user is log in and 
    maybeFetchData() {
        const userContext = this.context;
        if (!this.state.isFetched && userContext.isAuthenticated) {
            this.fetchSavedLocations(userContext.user);
        }
    }

    fetchSavedLocations = (googleUser) => {
        let idToken = googleUser.getAuthResponse().id_token;
        let url = "/backend/users/savedLocations";

        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + idToken,
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log("Data: ", JSON.parse(data).saved_locations);
                this.setState({
                    isFetched: true,
                    isFetching: false,
                    savedLocations: JSON.parse(data).saved_locations,
                });
            })
            .catch(error => {
                console.error("Error", error);
            });
    };

    // delete and refetch data
    onDelete = (places_id) => {
        console.log("in on delete places_id: ", places_id);
        const googleUser = this.context.user;
        let idToken = googleUser.getAuthResponse().id_token;

        let url = `/backend/users/savedLocations/for_place/${places_id}`;
        console.log(url);
        fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + idToken,
            },
        })
            .then(response => response.json())
            .then(data => {
                console.log("Data: ", JSON.parse(data));
                this.fetchSavedLocations(googleUser);
            })
            .catch(error => {
                console.error("Error", error);
            });
    };

    toggleGrid = () => {
        this.setState({
            grid: true,
        });
    };

    toggleList = () => {
        this.setState({
            grid: false,
        });
    };

    render() {
        const { grid, isFetching, savedLocations } = this.state;
        if (isFetching) {
            return <Loader />;
        }

        if (savedLocations.length < 1) {
            return (
                <div>
                    <h1>My Locations</h1>
                    <div>You currently have no saved locations.</div>
                </div>

            );
        }

        return (
            <>
                <h1>My Locations</h1>
                <div className="change_orientation">
                    <button type="button" title="Show as List" onClick={this.toggleList} className={"list_btn " + (!grid ? "active" : "")}>
                        <i className="material-icons">
                            view_list
                        </i>
                    </button>
                    <button type="button" title="Show as Grid" onClick={this.toggleGrid} className={"grid_btn " + (grid ? "active" : "")}>
                        <i className="material-icons">view_module</i>
                    </button>
                </div>
                <div className={"saved_list_container " + (grid ? "grid" : "list")}> {
                    this.state.savedLocations.map((savedLocation) => {
                        let places_id = savedLocation.location.places_id;
                        return (
                            <SavedItem
                                key={places_id}
                                savedLocation={savedLocation}
                                onDelete={this.onDelete}
                            />
                        );
                    })
                }
                </div>
            </>
        );
    }
}

export default SavedList;