import React from "react";
import Search from "../maps/Search";
// Home specific styling
import "./Home.scss";

class Home extends React.Component {
    constructor(props) {
        super(props);

        // set inital state to props being passed down
        this.state = {
            lat: props.lat,
            long: props.long,
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

    render() {
        return (
            <div className="home_page">
                <div className="content_wrapper">
                    <Search updateUserCoord={this.props.updateUserCoord} />
                </div> 
            </div>
        );
    }
}

export default Home;
