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
import CallbackContext from "./CallbackContext";
import UserContext from "./UserContext";

// App specific styling
import "./App.scss";

// Only routes, the provider context API, or nav elements should be on App.js
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lat: null,
            long: null,
            user: {},
            isAuthenticated: false,
            callbacks: {
                onSigninSuccess: this.onSigninSuccess.bind(this),
                onSigninFailure: this.onSigninFailure.bind(this),
            },
        };
    }

    getUserCoord = () => {
        // get user loc
        window.navigator.geolocation.getCurrentPosition(
            position => {
                // set state
                this.setState({ ...this.state, lat: position.coords.latitude, long: position.coords.longitude });
            },
            err => console.log(err)
        );
    };

    // update user location
    updateUserCoord = (lat, long) => {
        this.setState({ ...this.state, lat: lat, long: long });
    };

    componentDidMount() {
        this.getUserCoord();
    }

    onSigninSuccess(googleUser) {
        this.setState({ ...this.state, user: googleUser, isAuthenticated: true });
        var profile = googleUser.getBasicProfile();
        console.log("ID: " + profile.getId()); // Do not send to your backend! Use an ID token instead.
        console.log("Name: " + profile.getName());
        console.log("Image URL: " + profile.getImageUrl());
        console.log("Email: " + profile.getEmail()); // This is null if the 'email' scope is not present.
        var idToken = googleUser.getAuthResponse().id_token;
        var data = { idToken: idToken };
        fetch("/backend/signin", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
            },
        })
            .then(response => {
                console.log("Success:", response.json());
            })
            .catch(error => {
                console.error("Error", error);
            });
    }

    onSigninFailure(error) {
        this.setState({ ...this.state, user: {}, isAuthenticated: false });
        console.log(error);
    }

    render() {
        var authState = {
            user: this.state.user,
            isAuthenticated: this.state.isAuthenticated,
        };
        return (
            <div className="App">
                <UserContext.Provider value={authState}>
                    <CallbackContext.Provider value={this.state.callbacks}>
                        {this.renderRouter()}
                    </CallbackContext.Provider>
                </UserContext.Provider>
            </div>
        );
    }

    renderRouter() {
        return (
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
        );
    }
}

export default App;
