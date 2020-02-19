import React from "react";
import GoogleMap from "google-map-react";
import Reserve from "../business/Reserve";
import PlaceList from './PlaceList';
import PlaceSelected from './PlaceSelected';
import "./Maps.scss"; // Styling

const mapStyles = {
    width: "100%",
    height: "100%",
};

class Maps extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            map: {},
            maps: {},
            geocoderService: {},
            placeService: {},
            places: [],
            selectedPlace: null,
            selectedPlaceDetail: {},
        };
    }
    
    // map is google map and maps = maps api
    handleApiLoaded = ({ map, maps }) => {
        // console.log(map, maps)
        this.setState({
            map,
            maps,
            geocoderService: new maps.Geocoder(),
            placeService: new maps.places.PlacesService(map),
        });

        let request = {
            location: new maps.LatLng(this.props.lat, this.props.long),
            type: ['restaurant', 'cafe', 'libary', 'university', 'book_store'],
            query: 'study spots',
            // can only use rankBy or radius can't use both
            rankBy: maps.places.RankBy.DISTANCE,
            // radius: 30000, 
        };
    
        // perform text search
        this.state.placeService.textSearch(request, (results, status) => {
            if (status == maps.places.PlacesServiceStatus.OK) {
                console.log(results)
                let placeLen = results.length > 10 ? 10 : results.length;

                // add place obj to places list
                this.setState({ 
                    places: results.slice(0, placeLen)
                });        
                for (let i = 0; i < placeLen; i++) {
                    this.addMarker(results[i], this.state.map, this.state.maps)
                } 
            } else {
                console.log('Place service was not successful for the following reason: ' + status)
            }
            // console.log('places: ', this.state.places)
        })
    }

    // call getDetails for selectedPlace and save result to selectedPlaceDetail
    getPlaceDetail = (place) => {
        // console.log('place:', place.place_id)
        // call get detail only for 
        let detailRequest = {
            placeId: place.place_id,
        }

        // perform get detail 
        this.state.placeService.getDetails(detailRequest, (results, status) => {
            if (status == this.state.maps.places.PlacesServiceStatus.OK) {
                console.log('in getPlaceDetail results', results)
                this.setState({
                    selectedPlaceDetail: results
                });
            } else {
                console.log('getDetail was not successful for the following reason: ' + status)
            }
        })
    }

    // add marker to map 
    addMarker(address, map, maps) {
        // console.log(address)
        // perform geocode to convert address to latLng
        this.state.geocoderService.geocode({ 'address': address.formatted_address }, (results, status) => {
            if (status == 'OK') {
                map.setCenter(results[0].geometry.location);
                let marker = new maps.Marker({
                    map: map,
                    position: results[0].geometry.location,
                }); 
                let infowindow = new maps.InfoWindow({
                    content: address.name,
                });

                // add onclick event
                marker.addListener('click', () => {
                    // update selectedPlace to clicked pin
                    this.onPlaceSelect(address);
                    // open and auto close infowindow after 2 sec
                    infowindow.open(map, marker);
                    setTimeout(() => {infowindow.close();}, '2000');
                });
            } else {
                console.log('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    // set state for cur place selected
    onPlaceSelect = place => {
        this.setState({
            selectedPlace: place
        });
        this.getPlaceDetail(place);
        // console.log('onPlaceSelectedPlace: ', this.state.selectedPlace)
        // console.log('onPlaceSelectedDetail: ', this.state.selectedPlaceDetail)
        // OPTIONAL: zoom in to marker need to get latLng
        // this.state.map.setZoom(14);
        // this.state.map.setCenter();
    }

    render() {
        // console.log('this.props: ', this.props)
        console.log('this.state.selectedPlaceDetail: ', this.state.selectedPlaceDetail);
        const center = {
            lat: this.props.lat,
            lng: this.props.long,
        };
        return (
            <div className="map_wrapper">
                <div className="place_list_container">
                    <div>
                        <PlaceSelected place={this.state.selectedPlace}/>
                    </div>
                    <PlaceList onPlaceSelect={this.onPlaceSelect} places={this.state.places} />
                </div>
                <div className="map_container">
                    <div style={mapStyles}>   
                    {/* Make Reservation Component */}
                       {/* <Reserve openingHours={this.state.selectedPlaceDetail.opening_hours}/>  */}
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
