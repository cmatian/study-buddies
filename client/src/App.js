import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Nav from "./components/layouts/Nav";
import Home from "./components/layouts/Home";
import Maps from "./components/maps/Maps";
import Search from "./components/search/Search";
import Biz from "./components/business/Biz";
import Rates from "./components/business/Rates";
import Reserve from "./components/business/Reserve";
import Reservations from "./components/reservation/Reservations";
import Saved from "./components/maps/Saved";
import NotFound from "./components/pages/NotFound";

// App specific styling
import "./App.scss";

// Only routes, the provider context API, or nav elements should be on App.js
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lat: null,
            long: null,
        };
    }

    getUserCoord = () => {
        // get user loc
        window.navigator.geolocation.getCurrentPosition(
            position => {
                // set state
                this.setState({
                    lat: position.coords.latitude,
                    long: position.coords.longitude,
                });
            },
            err => console.log(err)
        );
    };

    // update user location
    updateUserCoord = (lat, long) => {
        this.setState({
            lat: lat,
            long: long,
        });
    };

    componentDidMount() {
        this.getUserCoord();
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    <Nav /> {/* Navigation Component */}
                    <Switch>
                        <Route
                            path="/"
                            exact
                            render={() => {
                                return (
                                    <Home
                                        lat={this.state.lat}
                                        long={this.state.long}
                                        updateUserCoord={this.updateUserCoord}
                                        getUserCoord={this.getUserCoord}
                                    />
                                );
                            }}
                        ></Route>
                        <Route
                            path="/maps"
                            exact
                            render={() => {
                                return <Maps lat={this.state.lat} long={this.state.long} />;
                            }}
                        ></Route>
                        <Route path="/maps/search" exact component={Search}></Route>
                        <Route path="/biz" exact component={Biz}></Route>
                        <Route path="/biz/rate" exact component={Rates}></Route>
                        <Route path="/biz/reserve" exact component={Reserve}></Route>
                        <Route path="/users/reservations" exact component={Reservations}></Route>
                        <Route path="/maps/users/saved" exact component={Saved}></Route>
                        <Route component={NotFound}></Route>
                    </Switch>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;
