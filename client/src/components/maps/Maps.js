import React from "react";
import ReactDOMServer from 'react-dom/server';
import GoogleMap from "google-map-react";
import Reserve from "../business/Reserve";
import PlaceList from "./PlaceList";
import PlaceSelected from "./PlaceSelected";
import Biz from "../business/Biz";
import PlaceDetail from './PlaceDetail';
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
            lastOpen: null,
            placeService: {},
            distanceService: {},
            places: [],
            selectedIndex: 0,
            selectedPlace: null,
            selectedPlaceDetail: {},
            selectedPlaceDistance: {},
            showBusinessDetail: false,
            showMakeReservation: false,
            isExpanded: true,
            hoverTarget: null,
            markerRefs: [],
        };
    }

    // Returns a formatted array of the filters
    setTypeFilter = () => {
        const { filters } = this.props;
        const defaultTypes = ["restaurant", "cafe", "libary", "university", "book_store"];

        let types = [];
        Object.keys(filters.type).forEach(key => {
            if (filters.type[key]) {
                types.push(key);
            }
        });
        return types.length > 0 ? types : defaultTypes;
    };

    // map is google map and maps = maps api
    handleApiLoaded = ({ map, maps }) => {
        // console.log(map, maps)
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
                // add place obj to places list
                this.setState({
                    places: results.slice(0, 10), // slice will already read up to 10 items, dont need [].length
                });
                for (let i = 0; i < this.state.places.length; i++) {
                    this.addMarker(results[i], this.state.map, this.state.maps, i);
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
        let origin = { lat: this.props.lat, lng: this.props.long };
        let destination = this.state.selectedPlace.formatted_address;

        let distanceRequest = {
            origins: [origin],
            destinations: [destination],
            travelMode: "DRIVING",
            unitSystem: this.state.maps.UnitSystem.IMPERIAL,
        };

        this.state.distanceService.getDistanceMatrix(distanceRequest, (results, status) => {
            if (status === "OK") {
                // console.log('in getDistanceDetail results', results)
                this.setState({
                    selectedPlaceDistance: results,
                });
            } else {
                console.log("getDistanceMatrix was not successful for the following reason: " + status);
            }
        });
    };

    // add marker to map
    addMarker(address, map, maps, index) {

        const { markerRefs } = this.state;

        let LatLng = { lat: address.geometry.location.lat(), lng: address.geometry.location.lng() };

        map.setCenter(LatLng);
        let marker = new maps.Marker({
            map: map,
            position: LatLng,
            animation: maps.Animation.DROP,
        });

        let infowindow = new maps.InfoWindow({
            content: ReactDOMServer.renderToString(<PlaceDetail data={address} />),
        });

        marker.addListener("mouseover", () => {
            if (this.state.lastOpen) {
                this.state.lastOpen.close();
            }
            this.setState({
                lastOpen: infowindow,
                hoverTarget: index,
            });
            infowindow.open(map, marker);
        });

        marker.addListener("mouseout", () => {
            this.setState({
                hoverTarget: null,
            });
        });

        // add onclick event
        marker.addListener("click", () => {
            // update selectedPlace to clicked pin
            this.onPlaceSelect(address, index);
        });

        // We need to create a reference to our markers by storing it into state so that the PlaceItem can access their associated markers by reference

        this.setState({
            markerRefs: [
                ...markerRefs,
                {
                    marker, infowindow
                }
            ]
        });
    }

    // set state for cur place selected and hide selected
    onPlaceSelect = (place, index) => {
        const { map, markerRefs, lastOpen } = this.state;
        if (lastOpen) {
            lastOpen.close();
        }

        this.setState({
            selectedIndex: index,
            selectedPlace: place,
            isExpanded: true,
            showBusinessDetail: false,
            showMakeReservation: false,
            lastOpen: markerRefs[index].infowindow,
        });
        this.getPlaceDetail(place);
        map.setCenter({ lat: place.geometry.location.lat(), lng: place.geometry.location.lng() });
        map.setZoom(14);

        // Open the infowindow for the associated marker
        markerRefs[index].infowindow.open(map, markerRefs[index].marker);
    };

    // func to update showBusiness state from child PlaceSelected
    onDetailSelect = () => {
        console.log('Detail');
        this.setState({
            showBusinessDetail: true, // show details
            showMakeReservation: false, // hide reservations
        });
        this.getDistanceDetail();
    };

    closeDetails = () => {
        this.setState({
            showBusinessDetail: false,
        });
    };

    closeReservations = () => {
        this.setState({
            showMakeReservation: false,
        });
    };

    // func to updadate showMakeReservation to display reserve component
    onReservationSelect = () => {
        console.log('Reservation');
        this.setState({
            showBusinessDetail: false,
            showMakeReservation: true,
        });
    };

    toggleSideMenu = () => {
        this.setState(prevState => ({
            isExpanded: !prevState.isExpanded,
        }));
    };

    render() {
        // console.log('this.props: ', this.props)
        const center = {
            lat: this.props.lat,
            lng: this.props.long,
        };

        const { isExpanded } = this.state;

        return (
            <div className="map_wrapper">
                <div className={"place_list_container " + (isExpanded ? "expanded" : "")}>
                    <PlaceSelected
                        onDetailSelect={this.onDetailSelect}
                        place={this.state.selectedPlace}
                        onReservationSelect={this.onReservationSelect}
                    />
                    <PlaceList onPlaceSelect={this.onPlaceSelect} places={this.state.places} selected={this.state.selectedIndex} hover={this.state.hoverTarget} />
                </div>
                <div className="map_container">
                    {/* Don't show list toggle when detail menu is visible */}
                    {!this.state.showBusinessDetail &&
                        <div className="toggle_side_menu" onClick={this.toggleSideMenu} title="Toggle Side Bar">
                            <i className="material-icons">{isExpanded ? "arrow_back" : "arrow_forward"}</i>
                        </div>
                    }
                    {/* Show business detail close button when detail bar is visible */}
                    {this.state.showBusinessDetail &&
                        <div className="close_detail_menu" onClick={this.closeDetails} title="Close Detail Side Bar">
                            <i className="material-icons">close</i>
                        </div>
                    }
                    {/* Show business detail close button when detail bar is visible */}
                    {this.state.showMakeReservation &&
                        <div className="close_detail_menu" onClick={this.closeReservations} title="Close Reservations Side Bar">
                            <i className="material-icons">close</i>
                        </div>
                    }
                    <div style={mapStyles}>
                        {/* Business Details */}
                        {this.state.showBusinessDetail &&
                            <Biz
                                selectedPlace={this.state.selectedPlace}
                                selectedPlaceDetail={this.state.selectedPlaceDetail}
                                selectedPlaceDistance={this.state.selectedPlaceDistance}
                                onReservationSelect={this.onReservationSelect}
                            />
                        }

                        {/* Reservation Form */}
                        {this.state.showMakeReservation &&
                            <Reserve openingHours={this.state.selectedPlaceDetail.opening_hours} />
                        }

                        {/* Google Map + Pins */}
                        <GoogleMap
                            bootstrapURLKeys={{ key: "AIzaSyC4YLPSKd-b0RxRh5kqx8QDnf9yMDioK0Y" }}
                            center={center}
                            defaultZoom={12}
                            yesIWantToUseGoogleMapApiInternals
                            onGoogleApiLoaded={({ map, maps }) => this.handleApiLoaded({ map, maps })}
                        ></GoogleMap>
                    </div>
                </div>
            </div >
        );
    }
}

export default Maps;
