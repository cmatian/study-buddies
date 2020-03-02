import React from "react";

class SavedList extends React.Component {
    // componentDidMount() {
    //     this.fetchSavedLocations();
    // }

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
            })
            .catch(error => {
                console.error("Error", error);
            });
    };

    render() {
        return(
            <div>
                SavedList
            </div>
        );
    }
}

export default SavedList;