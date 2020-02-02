import React from "react";
import { BrowserRouter, Route } from "react-router-dom";
import Home from "./components/layouts/Home";
import Maps from "./components/maps/Maps";
import Search from "./components/maps/Search";
import Biz from "./components/business/Biz";
import Rates from "./components/business/Rates";
import Reserve from "./components/business/Reserve";
import Reservations from "./components/reservation/Reservations";
import Saved from "./components/maps/Saved";

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
                    long: position.coords.longitude
                });
            },
            err => console.log(err)
        );
    };

    componentDidMount() {
        this.getUserCoord();
    }

    render() {
        return (
            <div className="App">
                <BrowserRouter>
                    {/* Can optionally wrap all routes in a switch if we only want one matched route to render */}
                    <Route 
                        path="/" exact
                        render={() => {
                            return <Home lat={this.state.lat} long={this.state.long} />
                        }}
                    ></Route>
                    <Route 
                        path="/maps" exact
                        render={() => {
                            return <Maps lat={this.state.lat} long={this.state.long} />
                        }}
                    ></Route>
                    <Route path="/maps/search" exact component={Search}></Route>
                    <Route path="/biz" exact component={Biz}></Route>
                    <Route path="/biz/rate" exact component={Rates}></Route>
                    <Route path="/biz/reserve" exact component={Reserve}></Route>
                    <Route path="/users/reservations" exact component={Reservations}></Route>
                    <Route path="/maps/users/saved" exact component={Saved}></Route>
                </BrowserRouter>
            </div>
        );
    }
}

export default App;