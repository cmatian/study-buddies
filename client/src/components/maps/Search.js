import React from "react";
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from "react-places-autocomplete";
import { Redirect } from "react-router-dom"
import "./Search.scss"; // Styling

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = { 
            address: "", 
            redirect: false
        };

        console.log("props: ", props);
    }

    handleChange = address => {
        this.setState({ address });
    };

    handleSelect = address => {
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => this.props.updateUserCoord(latLng.lat, latLng.lng))
            .catch(error => console.error("Error", error));
    };

    // onclick of submit button redirect to maps
    render() {
        if (this.state.redirect) {
            return <Redirect to="/maps"/>
        }

        return (
            <PlacesAutocomplete value={this.state.address} onChange={this.handleChange} onSelect={this.handleSelect}>
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div>
                        <input
                            {...getInputProps({
                                placeholder: "Search Places ...",
                                className: "location-search-input",
                            })}
                        />
                        <div className="autocomplete-dropdown-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map(suggestion => {
                                const className = suggestion.active ? "suggestion-item--active" : "suggestion-item";
                                const style = suggestion.active
                                    ? { backgroundColor: "#fafafa", cursor: "pointer" }
                                    : { backgroundColor: "#ffffff", cursor: "pointer" };
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className,
                                            style,
                                        })}
                                    >
                                        <span>{suggestion.description}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <button onClick={()=>{this.setState({ redirect: true })}}>Submit</button>
                    </div>
                )}
            </PlacesAutocomplete>
        );
    }
}

export default Search;