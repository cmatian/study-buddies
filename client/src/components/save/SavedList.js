import React from "react";
import SavedItem from "./SavedItem";
import PlaceItem from "../maps/PlaceItem";

class SavedList extends React.Component {
    constructor(props) {
        super(props);

        this.state = ({
            savedLocations: [],
        });
    }

    // on inital load get saved location
    componentDidMount() {
        this.fetchSavedLocations();
    }

    fetchSavedLocations() {
        let auth2 = window.gapi.auth2.getAuthInstance();
        let googleUser = auth2.currentUser.get();
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
                console.log("Data: ", JSON.parse(data));
                this.setState({savedLocations: JSON.parse(data).saved_locations});
            })
            .catch(error => {
                console.error("Error", error);
            });
    };

    onDelete(places_id) {
        console.log("in on delete: ")
        // let auth2 = window.gapi.auth2.getAuthInstance();
        // let googleUser = auth2.currentUser.get();
        // let idToken = googleUser.getAuthResponse().id_token;
        // console.log(this.state.savedLocations)
        // let url = `/backend/users/savedLocations/for_place/${places_id}`;
        // console.log(url);
        // fetch(url, {
        //     method: "DELETE",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: "Bearer " + idToken,
        //     },
        // })
        //     .then(response => response.json())
        //     .then(data => {
        //         console.log("Data: ", JSON.parse(data));
        //     })
        //     .catch(error => {
        //         console.error("Error", error);
        //     });
        // this.fetchSavedLocations();
    };

    render() {
        return(
            <div> { 
                this.state.savedLocations.map((savedLocation) => {
                    console.log("places_id: ", savedLocation.location.places_id)
                    let places_id = savedLocation.location.places_id;
                    return (
                        <SavedItem 
                            key= {places_id}
                            savedLocation = {savedLocation}
                            onDelete = {() => this.onDelete()}
                        />
                    );
                })
            } 
            </div>
        );
    }
}

export default SavedList;