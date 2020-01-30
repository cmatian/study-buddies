import React from "react";

// Home specific styling
import "./Home.scss";

class Home extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lat: null,
            long: null,
        };
    }

    // Example API function call to our express server - make sure it's running before using this fn!
    callAPI() {
        fetch("http://localhost:5000/testapi")
            .then(res => res.text())
            .then(res =>
                this.setState({
                    apiResponse: res,
                })
            )
            .catch(err => err);
    }

    getUserCoord = () => {
        // get user loc
        window.navigator.geolocation.getCurrentPosition(
            position => {
                // set state
                this.setState({ lat: position.coords.latitude });
                this.setState({ long: position.coords.longitude });
            },
            err => console.log(err)
        );
    };

    componentDidMount() {
        this.getUserCoord();
    }

    render() {
        return (
            <div className="home_page">
                <p>
                    Your current coordinates are lat: {this.state.lat} and long: {this.state.long}.
                </p>
            </div>
        );
    }
}

export default Home;
