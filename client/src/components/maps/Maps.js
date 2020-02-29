import React from "react";
import GoogleMap from "google-map-react";
import Reserve from "../business/Reserve";
import PlaceList from "./PlaceList";
import PlaceSelected from "./PlaceSelected";
import Biz from "../business/Biz";
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
            placeService: {},
            distanceService: {},
            places: [],
            selectedPlace: null,
            selectedPlaceDetail: {},
            selectedPlaceDistance: {},
            showBusinessDetail: false,
            showMakeReservation: false,
        };
    }

    // Returns a formatted array of the filters
    setTypeFilter = () => {
        const { filters } = this.props;

        let types = [];
        Object.keys(filters.type).map(key => {
            if (filters.type[key]) {
                types.push(key);
            }
        });
        return types.length > 0 ? types : ["restaurant", "cafe", "libary", "university", "book_store"];
    };

    // map is google map and maps = maps api
    handleApiLoaded = ({ map, maps }) => {
        // console.log(map, maps)
        this.setTypeFilter();
        this.setState({
            map,
            maps,
            placeService: new maps.places.PlacesService(map),
            distanceService: new maps.DistanceMatrixService(),
        });

        let request = {
            location: new maps.LatLng(this.props.lat, this.props.long),
            type: this.setTypeFilter(),
            maxPriceLevel: this.props.filters.maxPriceLevel,
            openNow: this.props.filters.openNow,
            query: "study spots",
            // can only use rankBy or radius can't use both
            rankBy: maps.places.RankBy.DISTANCE,
            // radius: 30000,
        };
        // perform text search
        this.state.placeService.textSearch(request, (results, status) => {
            if (status === maps.places.PlacesServiceStatus.OK) {
                // console.log('results ', results)
                let placeLen = results.length > 10 ? 10 : results.length;
                // add place obj to places list
                this.setState({
                    places: results.slice(0, placeLen),
                });
                for (let i = 0; i < placeLen; i++) {
                    this.addMarker(results[i], this.state.map, this.state.maps);
                }
            } else {
                console.log("Place service was not successful for the following reason: " + status);
            }
        });
    };

    // call getDetails for selectedPlace and save result to selectedPlaceDetail
    getPlaceDetail = place => {
        // call get detail only for
        let detailRequest = {
            placeId: place.place_id,
        };

        // perform get detail
        this.state.placeService.getDetails(detailRequest, (results, status) => {
            if (status === this.state.maps.places.PlacesServiceStatus.OK) {
                // console.log('in getPlaceDetail results', results)
                this.setState({
                    selectedPlaceDetail: results,
                });
            } else {
                console.log("getDetail was not successful for the following reason: " + status);
            }
        });
    };

    // call getDistanceMatrix and save result to selectedPlaceDistance
    getDistanceDetail = () => {  
        let origin = {lat: this.props.lat, lng: this.props.long};
        let destination = this.state.selectedPlace.formatted_address;

        let distanceRequest = {
            origins: [origin],
            destinations: [destination],
            travelMode: 'DRIVING',
            unitSystem: this.state.maps.UnitSystem.IMPERIAL,
        }

        this.state.distanceService.getDistanceMatrix(distanceRequest, (results, status) => {
            if (status === 'OK') {
                // console.log('in getDistanceDetail results', results)
                this.setState({
                    selectedPlaceDistance: results
                });
            } else {
                console.log('getDistanceMatrix was not successful for the following reason: ' + status)
            }
        })
    }

    // add marker to map
    addMarker(address, map, maps) {
        let LatLng = {lat: address.geometry.location.lat(), lng: address.geometry.location.lng()}

        map.setCenter(LatLng);
        let marker = new maps.Marker({
            map: map,
            position: LatLng,
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
    }

    // set state for cur place selected and hide selected
    onPlaceSelect = place => {
        this.setState({
            selectedPlace: place,
            showBusinessDetail: false,
            showMakeReservation: false,
        });
        this.getPlaceDetail(place);
        // OPTIONAL: zoom in to marker need to get latLng
        // this.state.map.setZoom(14);
        // this.state.map.setCenter();
    };

    // func to update showBusiness state from child PlaceSelected
    onDetailSelect = () => {
        this.setState({
            showBusinessDetail: true,
            showMakeReservation: false,
        });
        this.getDistanceDetail();
    };

    // func to updadate showMakeReservation to display reserve component
    onReservationSelect = () => {
        this.setState({
            showBusinessDetail: false,
            showMakeReservation: true,
        });
    };

    render() {
        // console.log('this.props: ', this.props)
        const center = {
            lat: this.props.lat,
            lng: this.props.long,
        };

        return (
            <div className="map_wrapper">
                <div className="place_list_container">
                    <div>
                        <PlaceSelected
                            onDetailSelect={this.onDetailSelect}
                            place={this.state.selectedPlace}
                            onReservationSelect={this.onReservationSelect}
                        />
                    </div>
                    <PlaceList onPlaceSelect={this.onPlaceSelect} places={this.state.places} />
                </div>
                <div className="map_container">
                    <div>
                        {this.state.showBusinessDetail ? (
                            <Biz
                                selectedPlace={this.state.selectedPlace}
                                selectedPlaceDetail={this.state.selectedPlaceDetail}
                                selectedPlaceDistance={this.state.selectedPlaceDistance}
                                onReservationSelect={this.onReservationSelect}
                            />
                        ) : null}
                    </div>
                    <div style={mapStyles}>
                        {this.state.showMakeReservation ? (
                            <Reserve openingHours={this.state.selectedPlaceDetail.opening_hours} />
                        ) : null}
                        <GoogleMap
                            bootstrapURLKeys={{ key: "AIzaSyC4YLPSKd-b0RxRh5kqx8QDnf9yMDioK0Y" }}
                            center={center}
                            defaultZoom={12}
                            yesIWantToUseGoogleMapApiInternals
                            onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded({ map, maps })}
                        ></GoogleMap>
                    </div>
                </div>
            </div>
        );
    }
}

export default Maps;
