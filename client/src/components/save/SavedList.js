import React from "react";
import SavedItem from "./SavedItem";
import PlaceItem from "../maps/PlaceItem";

class SavedList extends React.Component {
    constructor(props) {
        super(props);

        this.state = ({
            savedLocations: {},
        });
    }

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
                this.setState({savedLocations: JSON.parse(data.saved_locations)});
            })
            .catch(error => {
                console.error("Error", error);
            });
    };

    render() {
        return(
            <div> {
                this.state.savedLocations.map((savedLocation) => {
                    return (
                        <PlaceItem 
                        saved_locations = {savedLocation}
                        />
                    );
                })
            }
            </div>
        );
    }
}

export default SavedList;