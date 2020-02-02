import React from 'react';
import { Map, GoogleApiWrapper, Marker } from 'google-maps-react';
import { config } from "../../config/config";

const mapStyles = {
    width: '100%',
    height: '100%',
};

class Maps extends React.Component {

    static defaultProps = {
        center: {
            lat: 25.03,
            lng: 121.56
        },
        zoom: 11
        };

    render() {
        return (
            <div>Results from a particular geo location & zoom, without a particular search term
                <Map
                    google={this.props.google}
                    zoom={8}
                    style={mapStyles}
                    initialCenter={{ lat: 25.03, lng: 121.56}}
                >
                    <Marker position={{ lat: 25.03, lng: 121.56}} />
                </Map>
            </div>
        );
    }
}

export default GoogleApiWrapper({
    apiKey: config.MAP_API_KEY
  })(Maps);