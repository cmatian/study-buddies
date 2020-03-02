import React from "react";
import SavedList from "../save/SavedList";
import "./Saved.scss";

class Saved extends React.Component {
    render() {
        return(
            <div className="saved_wrapper">
                <SavedList />
            </div>
        );
    }
}

export default Saved;