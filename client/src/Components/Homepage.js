import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { themeVars } from "../GlobalStyle";
import { Loading } from "./Loading";

import Review from "./Review";
import { UserContext } from "./UserContext";

export const Homepage = () => {
    const { user } = useContext(UserContext);
    const [homeFeed, setHomeFeed] = useState();

    //pagination
    const [startIndex, setStartIndex] = useState(0);
    const [page, setPage] = useState(1);

    //Get Homefeed
    useEffect(() => {
        fetch(`/api/homefeed/${user._id}/${startIndex}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.homeFeed);
                setHomeFeed(data.homeFeed);
            });
    }, [user, startIndex]);

    return (
        <>
            {!homeFeed ? (
                <Loading />
            ) : (
                <Wrapper>
                    <Header>
                        <h1 class="nomargin">Feed</h1>
                        {user.following.length < 1 ? (
                            <p>You don't have any friends!</p>
                        ) : homeFeed.length < 1 ? (
                            <p>Your friends havent posted any reviews!</p>
                        ) : (
                            <Pagination>
                                <button
                                    disabled={page === 1}
                                    onClick={() => {
                                        setPage(page - 1);
                                        setStartIndex(startIndex - 10);
                                    }}
                                >
                                    Previous
                                </button>
                                <div style={{ display: "block" }}>
                                    <p class="nomargin">Page {page}</p>
                                </div>
                                <button
                                    disabled={homeFeed.length < 10}
                                    onClick={() => {
                                        setPage(page + 1);
                                        setStartIndex(startIndex + 10);
                                    }}
                                >
                                    Next
                                </button>
                            </Pagination>
                        )}
                    </Header>
                    {homeFeed.map((review, k) => {
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
const Header = styled.div`
    margin: 0px auto;
    text-align: center;
    width: 30%;
`;
const Pagination = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    /* width: 30%; */
    margin: auto;
`;
