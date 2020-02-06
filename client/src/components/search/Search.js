import React from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { withRouter } from "react-router-dom";
import "./Search.scss"; // Styling

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            address: "",
            setAddress: "",
        };

        this.someRef = React.createRef(); // This is a ref to the PlacesAutoComplete component
    }

    handleRedirect = () => {
        if (this.state.address !== "") {
            return this.props.history.push("/maps");
        }
        console.log("An address is required.");
    };

    handleLocClick = () => {
        // If the coords are already set immediately redirect them
        if (!this.props.lat && !this.props.long) {
            this.props.getUserCoord();
        }
        return this.props.history.push("/maps");
    };

    handleChange = address => {
        this.setState({
            address,
            setAddress: address,
        });
    };

    handleFocus = () => {
        // Fetch predictions but only when the string isn't empty
        this.someRef.fetchPredictions();
    };

    handleBlur = () => {
        // Clear suggestions when you lose focus of the input - hides the autocomplete container
        this.someRef.clearSuggestions();
    };

    handleSelect = address => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.props.updateUserCoord(latLng.lat, latLng.lng))
            .catch(error => console.error("Error", error));
        this.handleChange(address);
    };

    // onclick of submit button redirect to maps
    render() {
        return (
            <PlacesAutocomplete
                value={this.state.address}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
                ref={ref => {
                    if (!ref) return;
                    // ref.handleInputOnBlur = () => {}; // uncomment when you want the box to stay in view
                    this.someRef = ref;
                }}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className="search_addr_form">
                        <div className="search_input_group">
                            <div className="input_icon_container">
                                <input
                                    {...getInputProps({
                                        placeholder: "E.g. 101 California Drive, Millbrae, CA, 94030",
                                        className: "location_search_input",
                                    })}
                                    onFocus={this.handleFocus}
                                    onBlur={this.handleBlur}
                                />
                                <i className="material-icons" title="Use my location" onClick={this.handleLocClick}>
                                    location_on
                                </i>
                            </div>
                            <div className="autocomplete_dropdown_container">
                                {loading && <div>Loading...</div>}
                                {suggestions.map(suggestion => {
                                    const className =
                                        "suggestion_item" + (suggestion.active ? " suggestion_item__active" : "");
                                    return (
                                        <div
                                            {...getSuggestionItemProps(suggestion, {
                                                className,
                                            })}
                                        >
                                            <span>{suggestion.description}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                        <button onClick={this.handleRedirect}>Go</button>
                    </div>
                )}
            </PlacesAutocomplete>
        );
    }
}

/*
    Because we are rendering the component as a child of other components, export the component as an arg to withRouter.
    This will allow the component to access the history object and we can use this.props.history.push(''); instead of
    using redirect. Redirect will overwrite the history location (preventing us from navigating use the back or forward buttons). We only want that behavior when we're redirecting a user to login, for example.
*/
export default withRouter(Search);
