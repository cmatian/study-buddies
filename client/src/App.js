import React from "react";
import "./App.css";

class App extends React.Component {
    state = {
        apiResponse: "",
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
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <p>
                        API Response: <br />
                        {this.state.apiResponse}
                    </p>
                </header>
            </div>
        );
    }
}

export default App;
