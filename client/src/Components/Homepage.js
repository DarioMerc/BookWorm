import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { themeVars } from "../GlobalStyle";
import { Loading } from "./Loading";

import Review from "./Review";
import { UserContext } from "./UserContext";

export const Homepage = () => {
    const { user } = useContext(UserContext);
    const [reviews, setReviews] = useState();

    useEffect(() => {
        fetch("/api/reviews")
            .then((res) => res.json())
            .then((data) => {
                console.log(data.reviews);
                setReviews(data.reviews);
            });
    }, [user]);

    return (
        <>
            {!reviews ? (
                <Loading />
            ) : (
                <Wrapper>
                    {reviews.map((review, k) => {
                        return (
                            <Review review={review} isHomepage={true} key={k} />
                        );
                    })}
                </Wrapper>
            )}
        </>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: stretch;
    width: 80%;
    background-color: ${themeVars.primary};
    /* border: 2px solid black;
    border-top: 0;
    border-bottom: 0; */
    margin: auto;
`;
