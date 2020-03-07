import React from "react";
import SavedList from "../save/SavedList";
import "./Saved.scss";

class Saved extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            grid: false, // default to list view
        };
    }





    render() {
        const { grid } = this.state;
        return (
            // Toggle the wrapper between grid or list views
            <div className="saved_wrapper">
                <SavedList />
            </div>
        );
    }
}

export default Saved;