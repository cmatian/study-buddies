import React from "react";
import { Map, Marker } from "google-maps-react";
import Reserve from "../business/Reserve";

const mapStyles = {
    width: "100%",
    height: "100%",
};

class Maps extends React.Component {
    render() {
        return (
            <div>
                {/* Make Reservation Component */}
                <Reserve />
                {/* Map Component */}
                <Map
                    google={window.google}
                    zoom={12}
                    style={mapStyles}
                    initialCenter={{ lat: this.props.lat, lng: this.props.long }}
                    center={{ lat: this.props.lat, lng: this.props.long }}
                >
                    <Marker position={{ lat: this.props.lat, lng: this.props.long }} />
                </Map>
            </div>
        );
    }
}

export default Maps;
