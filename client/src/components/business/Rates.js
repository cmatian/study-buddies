import React from 'react';
import { withRouter } from "react-router-dom";
import "./Rates.scss";

const stars = [0, 1, 2, 3, 4];
const costs = ["$", "$$", "$$$", "$$$$"];

// Page for submitting a rating + review + estimated cost
class Rates extends React.Component {
    constructor(props) {
        super(props);
        this.state = this.initialState;
    }

    get initialState() {
        return {
            starRating: 0,
            review: "",
            estimatedCost: 0, 
        }
    }

    // update state of star rating to cur selected
    handleStarClick = index => {
        this.setState({starRating: index + 1});
    };

    // update state of cost to cur selected
    handleCostClick = index => {
        this.setState({estimatedCost: index + 1});
    };

    // update state of review state on every key stroke
    handleChange = e => {
        this.setState({review: e.target.value});
    };

    // reset state
    clearFrom = () => {
        this.setState(this.initialState);
    }

    reviewValidation() {
        if (this.state.starRating > 0 && this.state.review.length > 0 && this.state.estimatedCost > 0) {
             this.handleSubmit();
        } else {
           alert("All input must be filled.")
        }
    }

    handleSubmit = () => {
        let auth2 = window.gapi.auth2.getAuthInstance();
        let googleUser = auth2.currentUser.get();
        let idToken = googleUser.getAuthResponse().id_token;

        // convert cost to string to match varchar in db
        let data = {
            places_id: this.props.location.state.places_id,
            rating: this.state.starRating,
            comment: this.state.review,
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
    }

    render() {
        return(
            <div className="review_wrapper">
                <div>
                    Star Rating: 
                    {stars.map((star, index) => {
                        {/* conditonal className to display stars selcted */}
                        const className = index <= this.state.starRating - 1 ? "star_filled" : "star";
                        return <span
                            className={className} 
                            key={index.toString()} 
                            onClick={() => this.handleStarClick(index)}
                        >★</span>
                    })}
                </div>
                <div>
                    <form>
                        <textarea
                            id="user review"
                            required
                            placeholder="Describe your study experience."
                            rows="10"
                            cols="40"
                            value={this.state.review}
                            onChange={e => this.handleChange(e)} 
                        ></textarea>                       
                    </form>
                </div>
                <div className="estimated_cost_container">
                    Estimated Cost:
                    {costs.map((cost, index) => {
                        const className = index == this.state.estimatedCost - 1 ? "cost_selected" : "cost";
                        return <span className={className} key={index} onClick={() => this.handleCostClick(index)}>{costs[index]}</span>
                    })}
                </div>
                <div>
                    <button 
                        onClick={() => this.reviewValidation()}
                    >Submit</button>
                    <button onClick={() => this.clearFrom()}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default withRouter(Rates);
