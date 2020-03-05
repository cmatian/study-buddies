import React from "react";
import ReviewItem from './ReviewItem';

class ReviewList extends React.Component {       

    render() {  
        const { reviews } = this.props;
        if (Object.keys(reviews).length === 0 && reviews.constructor === Object) {
            return(<div>There currently are no reviews.</div>);
        } else {
            return(
                <div>
                    {
                        // takes in a list of review and return a new array of review item componets
                        this.props.reviews.map((review, idx) => {
                            return <ReviewItem key={idx.toString()} review={review}/>;
                        })
                    }
                </div> 
            );
        }
    }
}
export default ReviewList;