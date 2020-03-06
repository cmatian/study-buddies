import React from "react";
import "./ReviewItem.scss";

// individual review item
// displaying: name, rating, txt
class ReviewItem extends React.Component {
    render() {
        const { review } = this.props;
        const stars = ["★", "★★", "★★★", "★★★★", "★★★★★"];
        const costs = ["$", "$$", "$$$", "$$$$"];
        let idxStar = review.rating - 1;
        let idxCost = review.cost - 1;

        // onclick update calls a call back function to update state of placeSlected
        return (
            <div className="review_item_wrapper">
                <div className="author_name">
                    {review.author_name || "Anonymous"}
                </div>
                <div>
                    {costs[idxCost]}
                </div>
                <div className="stars_rating">
                    {stars[idxStar]}
                </div>
                <div className="comments">
                    {review.text}
                </div>
            </div>

        );
    }
}
export default ReviewItem;