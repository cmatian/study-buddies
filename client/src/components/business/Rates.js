import React from 'react';
import "./Rates.scss";

const stars = [0, 1, 2, 3, 4];
const costs = ["$", "$$", "$$$", "$$$$"];

// Page for submitting a rating + review + estimated cost
class Rates extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            starRating: 0,
            review: "",
            estimatedCost: 0,
        };
    }

    // update state of star rating to cur selected
    handleStarClick = index => {
        this.setState({starRating: index + 1});
    }

    // update state of cost to cur selected
    handleCostClick = index => {
        this.setState({estimatedCost: index + 1});
    }

    // update state of review state on every key stroke
    handleChange = e => {
        this.setState({review: e.target.value});
    }

    clearFrom = () => {
        this.setState({
            starRating: 0,
            review: "",
            estimatedCost: 0,           
        });
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
                            key={index} 
                            onClick={() => this.handleStarClick(index)}
                        >★</span>
                    })}
                </div>
                <div>
                    <form>
                        <textarea
                            id="user review"
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
                    <button>Submit</button>
                    <button onClick={() => this.clearFrom()}>Cancel</button>
                </div>
            </div>
        );
    }
}

export default Rates;