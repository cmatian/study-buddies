import React from "react";
import "./BizDetail.scss";
import UserContext from "../../UserContext";

class BizDetail extends React.Component {
    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            isFetching: false,
            isFetched: false,
            isError: false,
            locationData: {},
        };
    }

    componentDidMount() {
        this.maybeFetchData();
    }

    componentDidUpdate() {
        this.maybeFetchData();
    }

    maybeFetchData() {
        const userContext = this.context;
        if (!this.state.isFetching && !this.state.isFetched && userContext.isAuthenticated) {
            this.fetchData(userContext.user);
        }
    }

    fetchData(googleUser) {
        this.setState({...this.state, isFetching: true, isError: false});
        var bizId = this.props.match.params.bizId;
        let token = googleUser.getAuthResponse().id_token;

        fetch("/backend/users/locations/for_place/" + bizId, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
            },
        })
            .then(response => response.json())
            .then(response => {
                console.log("location data: " + response);
                this.setState({
                    locationData: response,
                    isFetching: false,
                    isFetched: true,
                    isError: false,
                });
            })
            .catch(error => {
                console.error("Error", error);
                this.setState({ ...this.state, isFetching: false, isError: true, isFetched: true });
            });
    }

    render() {
        return (
            <div className="bizdetail_wrapper">
                Biz Detail: {this.props.match.params.bizId}<br/>
                Status: {this.statusMessage()}<br/>
                <pre>
                {JSON.stringify(this.state.locationData)}
                </pre>
            </div>
        );
    }

    statusMessage() {
        if (this.state.isFetching) {
            return "Fetching data...";
        } else if (this.state.isError) {
            return "Error fetching data.";
        } else if (this.state.isFetched) {
            return "Data loaded!";
        } else {
            return "Waiting...";
        }
    }
}

export default BizDetail;
