import React, { useState } from "react";
import styled from "styled-components";

// I TAKE NO CREDIT FOR THIS.
// ALL I DID WAS PASS A RATING HOOK AND A PROP CALLED "FIXED" WHICH EITHER RENDERS THE COMPONENT AS AN INTERACTABLE RATING SYSTEM OR A STATIC DISPLAY
//https://www.30secondsofcode.org/react/s/star-rating

const Star = ({ marked, starId, fixed }) => {
    return (
        <StyledStar
            data-star-id={starId}
            className="star"
            role="button"
            fixed={fixed}
        >
            {marked ? "\u2605" : "\u2606"}
        </StyledStar>
    );
};

const StarRating = ({ rating, setRating, fixed }) => {
    const [selection, setSelection] = useState(0);

    const hoverOver = (event) => {
        if (!fixed) {
            let val = 0;
            if (
                event &&
                event.target &&
                event.target.getAttribute("data-star-id")
            )
                val = event.target.getAttribute("data-star-id");
            setSelection(val);
        }
    };
    return (
        <StarRow
            fixed={fixed}
            onMouseOut={() => hoverOver(null)}
            onClick={(e) => {
                !fixed &&
                    setRating(e.target.getAttribute("data-star-id") || rating);
            }}
            onMouseOver={hoverOver}
        >
            {Array.from({ length: 5 }, (v, i) => (
                <Star
                    starId={i + 1}
                    key={`star_${i + 1}`}
                    marked={selection ? selection >= i + 1 : rating >= i + 1}
                    fixed={fixed}
                />
            ))}
        </StarRow>
    );
};

export default StarRating;

const StarRow = styled.div`
    /* margin: 0px; */
`;
const StyledStar = styled.span`
    font-size: 25px;
    &:hover {
        cursor: ${(props) => (props.fixed ? "default" : "pointer")};
    }
`;
