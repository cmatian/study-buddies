import React from 'react';
import "./Reservations.scss";
import UserContext from "../../UserContext";

class Reservations extends React.Component {
    static contextType = UserContext;
    
    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            isError: false,
            isFetched: false,
            reservationData: {}
        };
    }

    componentDidMount() {
        this.maybeFetchData();
    }

    componentDidUpdate() {
        this.maybeFetchData();
    }

    maybeFetchData() {
        var userContext = this.context;
        if (!this.state.isFetching && !this.state.isFetched && userContext.isAuthenticated) {
            this.fetchData(userContext.user);
        }
    }

    fetchData(googleUser) {
        this.setState({...this.state, isFetching: true, isError: false});
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
            this.setState({reservationData: response, isFetching: false, isError: false, isFetched: true})
        }).catch((error) => {
            console.error('Error', error);
            this.setState({...this.state, isFetching: false, isError: true, isFetched: true});
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
        } else if (this.state.isFetched) {
            return 'Data loaded!';
        } else {
            return 'Waiting...';
        }
    }
}

export default Reservations;
