import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/layouts/LandingPage";
import Maps from "./components/maps/Maps";
import Search from "./components/maps/Search";
import Biz from "./components/business/Biz";
import Rates from "./components/business/Rates";
import Reserve from "./components/business/Reserve";
import Reservations from "./components/reservation/Reservations";
import Saved from "./components/maps/Saved";

class App extends React.Component {
    state = {
        apiResponse: "",
        lat: null,
        long: null,
    };

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
                        {this.state.apiResponse} <br />
                        latitude: {this.state.lat} <br />
                        longitude: {this.state.long}
                    </p>

                    <div>
                        <BrowserRouter>
                            <Route path="/" exact component={LandingPage}></Route>
                            <Route path="/maps" exact component={Maps}></Route>
                            <Route path="/maps/search" exact component={Search}></Route>
                            <Route path="/biz" exact component={Biz}></Route>
                            <Route path="/biz/rate" exact component={Rates}></Route>
                            <Route path="/biz/reserve" exact component={Reserve}></Route>
                            <Route path="/users/reservations" exact component={Reservations}></Route>
                            <Route path="/maps/users/saved" exact component={Saved}></Route>
                        </BrowserRouter>
                    </div>
                </header>
            </div>
        );
    }
}

export default App;