import React from 'react';
import GoogleMap from 'google-map-react';
import Reserve from "../business/Reserve";
import PlaceList from './PlaceList';
import "./Maps.scss"; // Styling

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
            places: [],
        };
    }
    
    // map is google map and maps = maps api
    handleApiLoaded = ({ map, maps }) => {
        // console.log(map, maps)
        this.setState({
            map,
            maps,
            geocoderService: new maps.Geocoder(),
        });

        let request = {
            location: new maps.LatLng(this.props.lat, this.props.long),
            type: ['restaurant', 'cafe', 'libary', 'university', 'book_store'],
            query: 'study spots',
            // can only use rankBy or radius can't use both
            rankBy: maps.places.RankBy.DISTANCE,
            // radius: 30000, 
        };

        let placeService = new maps.places.PlacesService(map);
    
        // perform text search
        placeService.textSearch(request, (results, status) => {
            if (status == maps.places.PlacesServiceStatus.OK) {
                console.log(results)
                let placeLen = results.length > 10 ? 10 : results.length;
                
                // add place obj to places list
                this.setState({ places: results });        
                for (let i = 0; i < placeLen; i++) {
                    this.addMarker(results[i].formatted_address, map, this.state.maps)
                } 
            } else {
                console.log('Error place service fail.')
            }
            // console.log('places: ', this.state.places)
        })
    }

    // add marker to map 
    addMarker(address, map,maps) {
        this.state.geocoderService.geocode( { 'address': address}, function(results, status) {
          if (status == 'OK') {
            map.setCenter(results[0].geometry.location);
            new maps.Marker({
                map: map,
                position: results[0].geometry.location,
            }); 
          } else {
            console.log('Geocode was not successful for the following reason: ' + status);
          }
        });
    }
      

    render() {
        // console.log('this.props: ', this.props)
        const center = {
            lat: this.props.lat,
            lng: this.props.long
        }   

        return (
            <div className="map_wrapper">
                <div className="place_list_container">
                    <PlaceList places={this.state.places} />
                </div>
                <div className="map_container">
                    <div style={mapStyles}>   
                    {/* Make Reservation Component */}
                       {/* <Reserve /> */} 
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
                </div>                
            </div>
        );
    }
}

export default Maps;