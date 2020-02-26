import React from "react";
import Search from "../search/Search";
import Filters from "../search/Filters";
import Header from "./Header";
// Home specific styling
import "./Home.scss";

class Home extends React.Component {
    constructor(props) {
        super(props);

        // set inital state to props being passed down
        this.state = {
            lat: props.lat,
            long: props.long,
            filters: {},
        };
    }

    // update state wheneve changed
    componentDidUpdate(prevProps) {
        if (prevProps !== this.props) {
            this.setState({
                lat: this.props.lat,
                long: this.props.long,
            });
        }
    }

    render() {
        return (
            <div className="home_page">
                <video id="video-main" muted loop autoPlay>
                    <source src="./images/rain_ambient.mp4" type="video/mp4" />
                </video>
                <Header headerTitle="Study Buddies" />
                <div className="content_wrapper">
                    <Search
                        lat={this.props.lat}
                        long={this.props.long}
                        updateUserCoord={this.props.updateUserCoord}
                        getUserCoord={this.props.getUserCoord}
                    />
                    <Filters updateFilters={this.props.updateFilters} filters={this.props.filters} />
                </div>
            </div>
        );
    }
}

export default Home;
