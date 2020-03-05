import React from 'react';
import { withRouter } from "react-router-dom";
import "./Rates.scss";

const stars = [0, 1, 2, 3, 4];
const costs = ["$", "$$", "$$$", "$$$$"];

// Page for submitting a rating + review + estimated cost
class Rates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...this.initialState,
            data: this.props.location.state,
            errors: {
                user_review: false,
            }
        };
    }

    get initialState() {
        return {
            starRating: 0,
            user_review: "",
            estimatedCost: 0,
        };
    }

    // update state of star rating to cur selected
    handleStarClick = index => {
        this.setState({ starRating: index + 1 });
    };

    // update state of cost to cur selected
    handleCostClick = index => {
        this.setState({ estimatedCost: index + 1 });
    };

    validateEntry = (event) => {
        let result = (event.target.value.length < 1 || event.target.value.length > 1000);
        this.setState({
            errors: { [event.target.name]: result },
        });
    };

    // update state of review state on every key stroke
    handleChange = e => {
        this.validateEntry(e);
        this.setState({ [e.target.name]: e.target.value });
    };

    // reset state
    clearForm = () => {
        this.setState(this.initialState);
    };

    canSubmit = () => {
        const { starRating, estimatedCost, user_review } = this.state;
        return user_review.length > 0 && starRating && estimatedCost;
    };

    handleSubmit = () => {

        const { location } = this.props;

        let auth2 = window.gapi.auth2.getAuthInstance();
        let googleUser = auth2.currentUser.get();
        let idToken = googleUser.getAuthResponse().id_token;

        // convert cost to string to match varchar in db
        let data = {
            places_id: location.state.places_id,
            rating: this.state.starRating,
            comment: this.state.user_review,
            cost: this.state.estimatedCost.toString(),
        };

        console.log('review:', data);

        fetch("/backend/users/ratings", {
            method: "POST",
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + idToken,
            },
        })
            .then(response => {
                console.log("Success:", response.json());
            })
            .catch(error => {
                console.error("Error", error);
            });

        this.handleRedriect();
    };

    // redirect user to map page after submitting review
    handleRedriect = () => {
        return this.props.history.goBack();
    };

    render() {
        const { data, user_review, errors } = this.state;
        const length = user_review.length;
        const maxLength = 1000;
        const maxLengthOverflow = length > maxLength ? "overflow" : "";
        const disabled = this.canSubmit();

        return (
            <div className="review_wrapper" >
                {(data !== undefined) &&
                    // Render a photo if it exists
                    <img src={data.picture} alt={"Picture of " + data.name} className="fixed_picture" />
                }
                <div className="review_container">
                    {(data === undefined || data === null || data === "") ?
                        (<div className="invalid_referral"></div>)
                        :
                        <>
                            <div className="location_title">
                                <div className="title">Reviewing {data.name}</div>
                            </div>
                            <div className="star_rating">
                                <div className="rating_title"> How was your visit? <span className="required_ast">*</span></div>
                                <div className="star_container">
                                    {stars.map((star, index) => {
                                        {/* conditonal className to display stars selcted */ }
                                        const className = index <= this.state.starRating - 1 ? "star" : "star_outline";
                                        return (
                                            <i
                                                className={"material-icons " + className}
                                                key={index.toString()}
                                                onClick={() => this.handleStarClick(index)}
                                            >
                                                {className}
                                            </i>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className="estimated_cost_container">
                                <div className="cost_title">How was the pricing? <span className="required_ast">*</span></div>
                                <div className="price_container">
                                    {costs.map((cost, index) => {
                                        const className = index == this.state.estimatedCost - 1 ? "cost_selected" : "cost";
                                        return (
                                            <span
                                                className={className}
                                                key={index}
                                                onClick={() => this.handleCostClick(index)}
                                            >
                                                {costs[index]}
                                            </span>);
                                    })}
                                </div>
                            </div>
                            <div className="user_review">
                                <form className="user_review_form">
                                    <label htmlFor="user_review" className={"user_review_text"}>
                                        Summary of your visit <span className="required_ast">*</span>
                                    </label>
                                    <textarea
                                        className={errors.user_review ? "error" : ""}
                                        id="user_review"
                                        name="user_review"
                                        required
                                        placeholder={"Describe your study experience at " + data.name + "..."}
                                        rows="10"
                                        cols="40"
                                        value={this.state.review}
                                        onChange={e => this.handleChange(e)}
                                        onBlur={this.validateEntry}
                                    ></textarea>
                                    <div className="textarea_details">
                                        {length > maxLength &&
                                            <span className="label_error">Your review is too long!</span>
                                        }
                                        <span className={"max_length " + maxLengthOverflow}>{length}/1000</span>
                                    </div>
                                </form>
                            </div>
                            <div className="button_container">
                                <button className="cancel_button" onClick={() => this.clearForm()}>Cancel</button>
                                <button className="submit_button" disabled={!disabled} onClick={this.handleSubmit}>Submit Review</button>
                            </div>
                        </>
                    }
                </div>
            </div >
        );
    }
}



export default withRouter(Rates);
