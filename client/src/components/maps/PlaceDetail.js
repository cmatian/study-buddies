import React from 'react';
import './PlaceDetail.scss';

const PlaceDetail = (props) => {
    const { data } = props;

    const ratingColor = () => {
        let color = '';
        if (data.rating === undefined || data.rating === null) {
            return (
                <>
                    <span className="gray">N/A</span>
                </>
            );
        }

        const rating = parseInt(Math.ceil(data.rating));
        switch (rating) {
            case 0:
                color = 'red';
                break;
            case 1:
                color = 'red';
                break;
            case 2:
                color = 'orange';
                break;
            case 3:
                color = "light_green";
                break;
            case 4:
                color = "green";
                break;
            case 5:
                color = 'green';
                break;
        }

        return (
            <>
                <span title="Rating" className={"rating " + color}>{data.rating}</span>
            </>
        );
    };

    const calculatePricing = () => {
        if (!data.price_level) {
            return "";
        }
        const pricing = data.price_level;
        const price = ["$", "$", "$$", "$$$", "$$$$"];
        const price_class = ["inexpensive", "inexpensive", "moderate", "pricey", "very_expensive"];

        return (
            <>
                <span title="Average Pricing" className={"pricing " + (price_class[pricing])}>{price[pricing]}</span>
            </>
        );
    };

    return (
        <div className="marker_place_detail">
            <div className="header">{data.name} ({ratingColor()}) {calculatePricing()}</div>
            <div className="address"><span>{data.formatted_address}</span></div>
        </div>
    );

};

export default PlaceDetail;