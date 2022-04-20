import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { themeVars } from "../GlobalStyle";
import { Loading } from "./Loading";
import Review from "./Review";
import { UserContext } from "./UserContext";

export const ReviewPage = () => {
    const reviewID = useParams().id;
    const [review, setReview] = useState();
    const { user } = useContext(UserContext);

    useEffect(() => {
        fetch(`/api/review/${reviewID}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.review);
                setReview(data.review);
            });
    }, [user, reviewID]);

    return (
        <Wrapper>
            {!review ? (
                <Loading />
            ) : (
                <Review review={review} isHomepage={false} />
            )}
            <span class="heightspacer"></span>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 80%;
    height: 100%;
    background-color: ${themeVars.primary};
`;
