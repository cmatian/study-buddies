import React from "react";
import "./ReviewItem.scss";

// individual review item
// displaying: name, rating, txt
class ReviewItem extends React.Component {
    render() {
         // console.log('place item props', review)       
        const { review } = this.props;
        const stars = ["★", "★★", "★★★", "★★★★", "★★★★★"];
        let idx = review.rating - 1;

        // onclick update calls a call back function to update state of placeSlected
        return(  
            <div className="review_item_wrapper">
                <div className="author_name">
                    {review.author_name}
                </div>
                <div className="stars_rating">
                    {stars[idx]}
                </div>
                <div className="comments">
                    {review.text}
                </div>
            </div>

        );
    }
}
export default ReviewItem;