import React from "react";

class Filters extends React.Component {
    constructor(props) {
        super(props);
    }

    // Handle Change
    handleChange = (event, locationType = false) => {
        const { filters } = this.props;
        const target = event.target;
        let value = target.type === "checkbox" ? target.checked : target.value;

        if (target.name === "maxPriceLevel") {
            value = parseInt(value);
        }

        let newFilters = {};

        console.log(filters);

        if (locationType) {
            newFilters = {
                ...filters,
                type: {
                    ...filters.type,
                    [target.name]: value,
                },
            };
            this.props.updateFilters(newFilters);
            return;
        }

        newFilters = {
            ...filters,
            [target.name]: value,
        };
        this.props.updateFilters(newFilters);
    };

    componentDidMount() {
        this.setState({
            filters: { ...this.props.filters },
            isLoading: false,
        });
    }

    render() {
        const { filters } = this.props;
        const { type } = filters;
        // const { maxPriceLevel, openNow, type } = this.state.filters;
        return (
            <form>
                <div className="input_group">
                    <fieldset>
                        <label>
                            Cheap
                            <input
                                type="radio"
                                name="maxPriceLevel"
                                value="0"
                                checked={parseInt(filters.maxPriceLevel) === 0}
                                onChange={this.handleChange}
                            />
                        </label>
                        <label>
                            Inexpensive
                            <input
                                type="radio"
                                name="maxPriceLevel"
                                value="1"
                                checked={parseInt(filters.maxPriceLevel) === 1}
                                onChange={this.handleChange}
                            />
                        </label>
                        <label>
                            Moderate
                            <input
                                type="radio"
                                name="maxPriceLevel"
                                value="2"
                                checked={parseInt(filters.maxPriceLevel) === 2}
                                onChange={this.handleChange}
                            />
                        </label>
                        <label>
                            Expensive
                            <input
                                type="radio"
                                name="maxPriceLevel"
                                value="3"
                                checked={parseInt(filters.maxPriceLevel) === 3}
                                onChange={this.handleChange}
                            />
                        </label>
                        <label>
                            Very Expensive
                            <input
                                type="radio"
                                name="maxPriceLevel"
                                value="4"
                                checked={parseInt(filters.maxPriceLevel) === 4}
                                onChange={this.handleChange}
                            />
                        </label>
                    </fieldset>
                </div>
                <div className="input_group">
                    <label>
                        Currently Open
                        <input type="checkbox" name="openNow" checked={filters.openNow} onChange={this.handleChange} />
                    </label>
                </div>
                {/* Multi-select for the type options 
                    - Need to pass in a second arg to trigger the correct state update
                */}
                <div className="input_group">
                    <label>
                        Book Store
                        <input
                            type="checkbox"
                            name="book_store"
                            checked={type.book_store}
                            onChange={event => this.handleChange(event, true)}
                        />
                    </label>
                    <label>
                        Cafe
                        <input
                            type="checkbox"
                            name="cafe"
                            checked={type.cafe}
                            onChange={event => this.handleChange(event, true)}
                        />
                    </label>
                    <label>
                        Restaurant
                        <input
                            type="checkbox"
                            name="restaurant"
                            checked={type.restaurant}
                            onChange={event => this.handleChange(event, true)}
                        />
                    </label>
                    <label>
                        University
                        <input
                            type="checkbox"
                            name="university"
                            checked={type.university}
                            onChange={event => this.handleChange(event, true)}
                        />
                    </label>
                    <label>
                        Library
                        <input
                            type="checkbox"
                            name="library"
                            checked={type.library}
                            onChange={event => this.handleChange(event, true)}
                        />
                    </label>
                </div>
            </form>
        );
    }
}

export default Filters;
