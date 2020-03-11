import React from "react";
import SavedList from "../save/SavedList";
import "./styles/Saved.scss";

class Saved extends React.Component {
    render() {
        return (
            // Toggle the wrapper between grid or list views
            <div className="saved_wrapper">
                <SavedList />
            </div>
        );
    }
}

export default Saved;