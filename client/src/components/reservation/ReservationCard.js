import React from "react";

const ReservationCard = props => {
    const { status, name, location, date_time } = props.data;
    const newDate = new Date(date_time);
    const date = newDate.toLocaleDateString("en-US");
    const time = newDate.toLocaleTimeString("en-US");
    return (
        <div
            className={"reservation_individual_card " + (props.itemkey === props.selectionkey ? "selected" : "")}
            data-index={props.index}
            data-itemkey={props.itemkey}
            onClick={props.UpdateSelection}
        >
            <div className="top">
                <div className="card_name">{name}</div>
                <div className={"card_status " + (status === "CANCELLED" ? "stat_red" : "stat_green")}>{status}</div>
            </div>
            <div className="middle">
                <div className="card_location">{location.name || "This is the name of the location"}</div>
            </div>
            <div className="bottom">
                <div className="card_date">{date}</div>
                <div className="card_time">{time}</div>
            </div>
        </div>
    );
};

export default ReservationCard;
