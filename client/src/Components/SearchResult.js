import React, { useContext, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import { UserContext } from "./UserContext";
import { useHistory } from "react-router";
import { FiHeart } from "react-icons/fi";
import { themeVars } from "../GlobalStyle";

export const SearchResult = ({ result }) => {
    const { user } = useContext(UserContext);
    const [isFaved, setIsFaved] = useState(
        user.favorites.some((fav) => fav.bookID === result.id)
    );

    let bookID = result.id;
    let cover = result.volumeInfo.imageLinks;
    let title = result.volumeInfo.title;
    let author = result.volumeInfo.authors
        ? result.volumeInfo.authors
        : ["Unknown"];
    let publishDate = result.volumeInfo.publishedDate;
    let subtitle = result.volumeInfo.subtitle;
    let categories = result.volumeInfo.categories
        ? result.volumeInfo.categories
        : "None";
    let pageCount = result.volumeInfo.pageCount;
    let publisher = result.volumeInfo.publisher;
    let history = useHistory();

    const handleFavorite = () => {
        fetch(`/api/favorite/${user._id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                bookID,
                title,
                author,
                cover,
                categories,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setIsFaved(!isFaved);
            });
    };

    const handleClick = (e) => {
        if (e.target.id !== "favorite" && e.target.tagName !== "path") {
            history.push(`/book/${bookID}`);
        }
    };

    return (
        <Result onClick={handleClick}>
            {cover && <Cover src={cover.thumbnail} />}
            <ResultContent>
                <Header>
                    <Title>{title}</Title>
                    <Author>
                        <span class="normal">by</span> {author.join(", ")}
                    </Author>
                </Header>
                {subtitle && <Info>{subtitle}</Info>}
                <span class="heightspacer"></span>
                <DetailsAndHeart>
                    <Details>
                        <Info>
                            Published in{" "}
                            <span class="bold">
                                {moment(publishDate).format("YYYY")}
                            </span>{" "}
                            by <span class="bold">{publisher}</span>
                        </Info>
                        <Info>
                            <span class="bold">Page Count: </span>
                            {pageCount}
                        </Info>
                        <Info>
                            <span class="bold">Subjects:</span> {categories}
                        </Info>
                    </Details>
                    <Heart
                        id="favorite"
                        onClick={() => handleFavorite()}
                        isfaved={isFaved}
                    />
                </DetailsAndHeart>
            </ResultContent>
        </Result>
    );
};

const Result = styled.div`
    margin: 10px auto;
    border: 2px solid black;
    display: flex;
    flex-direction: row;
    background-color: ${themeVars.tri};
    width: 50%;
    height: 20%;
    cursor: pointer;
`;
const Cover = styled.img`
    width: 20%;
    height: auto;
`;
const Header = styled.div`
    padding: 5px;
    background-color: ${themeVars.secondary};
    border-bottom: 2px solid black;
    white-space: nowrap;
    text-overflow: ellipsis;
`;
const Title = styled.h2`
    margin: 0px 0px 10px 0px;
    white-space: pre-wrap;
`;
const Author = styled.h4`
    font-weight: bold;
    margin: 0px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;
const ResultContent = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: auto;
    border-left: 2px solid black;
`;
const Info = styled.p`
    margin: 0px 5px;
    white-space: pre-wrap;
`;
const DetailsAndHeart = styled.div`
    display: flex;
    flex-direction: row;
`;
const Details = styled.div`
    display: flex;
    flex-direction: column;
    width: auto;
`;
const Heart = styled(FiHeart)`
    width: 30px;
    height: 30px;
    margin: auto 0px 0px auto;
    fill: ${(props) => (props.isfaved ? "red" : "white")};
    &:hover {
        cursor: pointer;
    }
`;
