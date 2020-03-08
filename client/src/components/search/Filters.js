import React from "react";
import "./Filters.scss"; // Filter Styling

class Filters extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            showPriceFilter: false,
            showTypesFilter: false,
        };

        this.priceFilterRef = React.createRef();
        this.typesFilterRef = React.createRef();
    }

    // Handle Change
    handleChange = (event) => {
        const { filters } = this.props;
        const target = event.target;
        let value = target.type === "checkbox" ? target.checked : target.value;

        if (target.name === "maxPriceLevel") {
            value = parseInt(value);
        }

        let newFilters = {
            ...filters,
            [target.name]: value,
        };
        this.props.updateFilters(newFilters);
    };

    toggleFilter = event => {
        if (event.currentTarget.name === "showPriceFilter") {
            this.setState(prevState => ({
                showPriceFilter: !prevState.showPriceFilter,
                showTypesFilter: false,
            }));
        }

        if (event.currentTarget.name === "showTypesFilter") {
            this.setState(prevState => ({
                showTypesFilter: !prevState.showTypesFilter,
                showPriceFilter: false,
            }));
        }
    };

    // Close all filters when we click outside of their node container
    handleClickOutside = event => {
        if (
            this.priceFilterRef &&
            !this.priceFilterRef.contains(event.target) &&
            this.typesFilterRef &&
            !this.typesFilterRef.contains(event.target)
        ) {
            this.setState({
                showPriceFilter: false,
                showTypesFilter: false,
            });
        }
    };

    componentDidMount() {
        document.addEventListener("mousedown", this.handleClickOutside);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleClickOutside);
    }

    render() {
        const { filters } = this.props; // filters prop
        const { type } = filters;
        const current = parseInt(filters.maxPriceLevel);
        return (
            <form className="form_filters">
                <span className="fp_wrapper" ref={node => (this.priceFilterRef = node)}>
                    <button
                        type="button"
                        className="showPriceButton"
                        name="showPriceFilter"
                        onClick={this.toggleFilter}
                    >
                        Max Price
                        <i className="material-icons">keyboard_arrow_down</i>
                    </button>
                    <div className={"flex_container " + (this.state.showPriceFilter ? "visible" : "")}>
                        <div className={"flex_item " + (current === 1 ? "active" : "")}>
                            <input
                                id="price_radio_1"
                                type="radio"
                                name="maxPriceLevel"
                                value="1"
                                checked={current === 1}
                                onChange={this.handleChange}
                            />
                            <label htmlFor="price_radio_1">Inexpensive ($)</label>
                        </div>
                        <div className={"flex_item " + (current === 2 ? "active" : "")}>
                            <input
                                id="price_radio_2"
                                type="radio"
                                name="maxPriceLevel"
                                value="2"
                                checked={current === 2}
                                onChange={this.handleChange}
                            />
                            <label htmlFor="price_radio_2">Moderate ($$)</label>
                        </div>
                        <div className={"flex_item " + (current === 3 ? "active" : "")}>
                            <input
                                id="price_radio_3"
                                type="radio"
                                name="maxPriceLevel"
                                value="3"
                                checked={current === 3}
                                onChange={this.handleChange}
                            />
                            <label htmlFor="price_radio_3">Pricey ($$$)</label>
                        </div>
                        <div className={"flex_item " + (current === 4 ? "active" : "")}>
                            <input
                                id="price_radio_4"
                                type="radio"
                                name="maxPriceLevel"
                                value="4"
                                checked={current === 4}
                                onChange={this.handleChange}
                            />
                            <label htmlFor="price_radio_4">Ultra High-End ($$$$)</label>
                        </div>
                    </div>
                </span>

                <span className="fo_wrapper">
                    <input
                        id="open_now_filter"
                        type="checkbox"
                        name="openNow"
                        checked={filters.openNow}
                        onChange={this.handleChange}
                    />
                    <label htmlFor="open_now_filter">Open Now</label>
                </span>

                <span className="ft_wrapper" ref={node => (this.typesFilterRef = node)}>
                    <button
                        type="button"
                        className="showTypesButton"
                        name="showTypesFilter"
                        onClick={this.toggleFilter}
                    >
                        Location Type
                        <i className="material-icons">keyboard_arrow_down</i>
                    </button>
                    <div className={"flex_container " + (this.state.showTypesFilter ? "visible" : "")}>
                        <div className={"flex_item " + (type === "cafe" ? "active" : "")}>
                            <label htmlFor="filter_cafe">
                                <input
                                    id="filter_cafe"
                                    type="radio"
                                    name="type"
                                    value="cafe"
                                    checked={type === "cafe"}
                                    onChange={this.handleChange}
                                />
                                Cafe
                            </label>
                        </div>
                        <div className={"flex_item " + (type === "library" ? "active" : "")}>
                            <label htmlFor="filter_library">
                                <input
                                    id="filter_library"
                                    type="radio"
                                    name="type"
                                    checked={type === "library"}
                                    value="library"
                                    onChange={this.handleChange}
                                />
                                Library
                            </label>
                        </div>
                        <div className={"flex_item " + (type === "book_store" ? "active" : "")}>
                            <label htmlFor="filter_bookstore">
                                <input
                                    id="filter_bookstore"
                                    type="radio"
                                    name="type"
                                    value="book_store"
                                    checked={type === "book_store"}
                                    onChange={this.handleChange}
                                />
                                Book Store
                            </label>
                        </div>
                        <div className={"flex_item " + (type === "restaurant" ? "active" : "")}>
                            <label htmlFor="filter_restaurant">
                                <input
                                    id="filter_restaurant"
                                    type="radio"
                                    name="type"
                                    value="restaurant"
                                    checked={type === "restaurant"}
                                    onChange={this.handleChange}
                                />
                                Restaurant
                            </label>
                        </div>
                        <div className={"flex_item " + (type === "university" ? "active" : "")}>
                            <label htmlFor="filter_university">
                                <input
                                    id="filter_university"
                                    type="radio"
                                    name="type"
                                    value="university"
                                    checked={type === "university"}
                                    onChange={this.handleChange}
                                />
                                University
                            </label>
                        </div>
                    </div>
                </span>
            </form>
        );
    }
}

export default Filters;
