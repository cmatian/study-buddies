import React from 'react';
import GoogleMap from 'google-map-react';
import Reserve from "../business/Reserve";

const mapStyles = {
    width: "100%",
    height: "100%"
};

class Maps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map : {},
            maps: {},
            geocoderService: {},
        };
    }
    
    handleApiLoaded = ({ map, maps }) => {
        // console.log(map, maps)
        this.setState({
            map,
            maps,
            geocoderService: new maps.Geocoder(),
        });

        let request = {
            location: new maps.LatLng(this.props.lat, this.props.long),
            type: ['restaurant', 'cafe', 'libary', 'university'],
            query: 'study spots',
            // can only use rankBy or radius
            rankBy: maps.places.RankBy.DISTANCE,
            //radius: 30000, 
        };

        let placeService = new maps.places.PlacesService(map);
    
        // perform text search
        placeService.textSearch(request, (results, status) => {
            if (status == this.state.maps.places.PlacesServiceStatus.OK) {
                console.log(results)
                for (let i = 0; i < 10; i++) {
                    this.addMarker(results[i].formatted_address, this.state.map, this.state.maps)
                } 
            }
        })
    }

    // add marker to map 
    addMarker(address, map,maps) {
        this.state.geocoderService.geocode( { 'address': address}, function(results, status) {
          if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            let marker = new maps.Marker({
                map: map,
                position: results[0].geometry.location,
            }); 
          } else {
            console.log('Geocode was not successful for the following reason: ' + status);
          }
        });
    }
      

    render() {
        console.log('this.props: ', this.props)
        const center = {
            lat: this.props.lat,
            lng: this.props.long
        }
        return (
            <div style={mapStyles}>
          {/* Make Reservation Component */}
                <Reserve />
                {/* Map Component */}
            <GoogleMap
                bootstrapURLKeys={{ key: 'AIzaSyC4YLPSKd-b0RxRh5kqx8QDnf9yMDioK0Y' }}
                center={center}
                defaultZoom={12}
                yesIWantToUseGoogleMapApiInternals
                onGoogleApiLoaded={({map, maps}) => this.handleApiLoaded({map, maps})}
            >
            </GoogleMap>
            </div>
        );
    }
}

export default Maps;