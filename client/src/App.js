import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Nav from "./components/layouts/Nav";
import Home from "./components/layouts/Home";
import Maps from "./components/maps/Maps";
import Search from "./components/search/Search";
import Rates from "./components/business/Rates";
import Reserve from "./components/business/Reserve";
import Reservations from "./components/reservation/Reservations";
import Saved from "./components/maps/Saved";
import SavedDetails from "./components/save/SavedDetails";
import NotFound from "./components/pages/NotFound";
import Signin from "./components/auth/Signin";
import CallbackContext from "./CallbackContext";
import UserContext from "./UserContext";
import AuthButtonContext from "./AuthButtonContext";
import WindowSizeProvider from './WindowSizeContext';

// App specific styling
import "./App.scss";

// Only routes, the provider context API, or nav elements should be on App.js
class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            lat: null,
            long: null,
            geocodeError: null,
            // Default Values
            filters: {
                openNow: true,
                type: 'cafe',
                minPriceLevel: 0,
                maxPriceLevel: 4,
            },
            user: {},
            isUserChecked: false,
            isAuthenticated: false,
            callbacks: {
                onSigninSuccess: this.onSigninSuccess.bind(this),
                onSigninFailure: this.onSigninFailure.bind(this),
                onSignout: this.onSignout.bind(this),
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
            (err) => {
                this.setState({
                    ...this.state,
                    geocodeError: err.code,
                });
                console.log(err);
            }
        );
    };

    // update user location
    updateUserCoord = (lat, long) => {
        this.setState({ ...this.state, lat: lat, long: long });
    };

    updateFilters = filters => {
        console.log(filters);
        this.setState({
            filters,
        });
    };

    componentDidMount() {
        this.getUserCoord();
    }

    onSigninSuccess(googleUser) {
        this.setState({ ...this.state, user: googleUser, isUserChecked: true, isAuthenticated: true });
        var profile = googleUser.getBasicProfile();
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
        this.setState({ ...this.state, user: {}, isUserChecked: true, isAuthenticated: false });
        console.log(error);
    }

    onSignout() {
        this.setState({ ...this.state, user: {}, isUserChecked: true, isAuthenticated: false });
    }

    render() {
        var userState = {
            user: this.state.user,
            isUserChecked: this.state.isUserChecked,
            isAuthenticated: this.state.isAuthenticated,
        };
        var authState = {
            callbacks: this.state.callbacks,
            isUserChecked: this.state.isUserChecked,
            isAuthenticated: this.state.isAuthenticated,
        };
        return (
            <div className="App">
                <UserContext.Provider value={userState}>
                    <CallbackContext.Provider value={this.state.callbacks}>
                        <AuthButtonContext.Provider value={authState}>
                            <WindowSizeProvider>
                                {this.renderRouter()}
                            </WindowSizeProvider>
                        </AuthButtonContext.Provider>
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
                                    geocodeError={this.state.geocodeError}
                                    lat={this.state.lat}
                                    long={this.state.long}
                                    updateUserCoord={this.updateUserCoord}
                                    getUserCoord={this.getUserCoord}
                                    updateFilters={this.updateFilters}
                                    filters={this.state.filters}
                                />
                            );
                        }}
                    ></Route>
                    <Route
                        path="/maps"
                        exact
                        render={() => {
                            return (
                                <Maps
                                    geocodeError={this.state.geocodeError}
                                    lat={this.state.lat}
                                    long={this.state.long}
                                    filters={this.state.filters}
                                    updateFilters={this.updateFilters}
                                    updateUserCoord={this.updateUserCoord}
                                    getUserCoord={this.getUserCoord}
                                />);
                        }}
                    ></Route>
                    <Route path="/maps/search" exact component={Search}></Route>
                    <Route path="/biz/rate" exact component={Rates}></Route>
                    <Route path="/biz/reserve" exact component={Reserve}></Route>
                    <Route path="/users/reservations" exact component={Reservations}></Route>
                    <Route path="/maps/users/saved" exact component={Saved}></Route>
                    <Route path="/maps/users/saved/details" exact component={SavedDetails}></Route>
                    <Route path="/signin" exact render={() => {
                        // signin needs to consume 2 contexts in order to conditionally render signin/signout content
                        return (
                            <UserContext.Consumer>
                                {userState => (
                                    <Signin user={userState} />
                                )}
                            </UserContext.Consumer>
                        );
                    }}></Route>
                    <Route component={NotFound}></Route>
                </Switch>
            </BrowserRouter>
        );
    }
}

export default App;
