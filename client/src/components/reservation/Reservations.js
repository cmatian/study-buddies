import React from 'react';
import "./Reservations.scss";

class Reservations extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            isError: false,
            reservationData: {}
        };
    }

    componentDidMount() {
        this.setState({...this.state, isFetching: true, isError: false});
        // Note: this fails if the page is visited directly.
        // This depends on the user visiting a prior page with SignIn
        // executing its initialization logic. (This needs to be fixed.)
        var auth2 = window.gapi.auth2.getAuthInstance();
        var googleUser = auth2.currentUser.get();
        var idToken = googleUser.getAuthResponse().id_token;
        fetch('/backend/users/reservations', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + idToken
            }
        }).then(response => response.json()
        ).then(response => {
            console.log("reservation data: " + response);
            this.setState({reservationData: response, isFetching: false, isError: false})
        }).catch((error) => {
            console.error('Error', error);
            this.setState({...this.state, isFetching: false, isError: true});
        });
    }
    
    render() {
        return(
            <div className="content_wrapper">
                <h1>My reservations page</h1>
                <p>{this.statusMessage()}</p>
                <pre>
                {JSON.stringify(this.state.reservationData)}
                </pre>
            </div>
        );
    }

    statusMessage() {
        if (this.state.isFetching) {
            return 'Fetching reservations...';
        } else if (this.state.isError) {
            return 'Error fetching reservations.';
        } else {
            return 'Data loaded!';
        }
    }
}

export default Reservations;
