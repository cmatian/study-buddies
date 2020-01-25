import React from "react";
import "./App.css";

class App extends React.Component {
    state = {
        apiResponse: "",
        lat: null,
        long: null
    };

    callAPI() {
        fetch("http://localhost:9000/testapi")
            .then(res => res.text())
            .then(res =>
                this.setState({
                    apiResponse: res,
                })
            )
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();

        // get user loc
        window.navigator.geolocation.getCurrentPosition(
            position => {
                // set state
                this.setState({ lat: position.coords.latitude });
                this.setState({ long: position.coords.longitude });
            },
            err => console.log(err)
        );
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        API Response: <br />
                        {this.state.apiResponse}
                        latitude: {this.state.lat} <br />
                        longitude: {this.state.long}
                    </p>
                </header>
            </div>
        );
    }
}

export default App;