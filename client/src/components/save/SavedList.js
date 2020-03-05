import React from "react";
import UserContext from "../../UserContext";
import SavedItem from "./SavedItem";
import Loader from '../layouts/Loader';

class SavedList extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);

        this.state = ({
            isFetched: false,   // flag for fetched data
            isFetching: true,   // flag for fetching data
            savedLocations: [],
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
        console.log("in on delete places_id: ", places_id)
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

    render() {
        if (this.state.isFetching) {
            return <Loader />;
        }

        if (this.state.savedLocations.length < 1) {
            return(
                <div>
                    <h1>My Locations</h1>
                    <div>You currently have no saved locations.</div>
                </div>
                
            )
        } else {
            return(
                <div>
                    <h1>My Locations</h1>
                    <div> {
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
                </div>
            );
        }
    }
}

export default SavedList;