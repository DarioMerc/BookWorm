import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";
import moment from "moment";
import { Loading } from "./Loading";
import StarRating from "./StarRating";
import { UserContext } from "./UserContext";
import ReactHtmlParser from "react-html-parser";
import { Link } from "react-router-dom";
import { themeVars } from "../GlobalStyle";

export const Book = () => {
    const bookID = useParams().id;
    const [book, setBook] = useState(null);
    const [review, setReview] = useState();
    const [rating, setRating] = useState(0);
    const { user, setState } = useContext(UserContext);
    let history = useHistory();

    //check if the book has already been reviewed by the user. if it has get the reviewID using this crazy line
    const isReviewed =
        user && user.reviews.some((rev) => rev.bookID === bookID);
    const reviewID =
        isReviewed &&
        user.reviews.filter((rev) => {
            return rev.bookID === bookID;
        })[0]["reviewID"];

    //get book
    useEffect(() => {
        fetch(`/api/books/${bookID}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.data.volumeInfo);
                setBook(data.data.volumeInfo);
            });
    }, [bookID]);

    const handleReviewPost = () => {
        fetch("/api/review", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                book: {
                    bookID,
                    title: book.title,
                    author: book.authors,
                    cover: book.imageLinks.thumbnail,
                },
                user: {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                },
                review,
                rating,
                timestamp: moment(),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                console.log(data);
                setState(`created review for ${bookID}`);
            });
    };

    return (
        <>
            {!book ? (
                <Loading />
            ) : (
                <Wrapper>
                    <BookContent>
                        <CoverCol>
                            <Cover src={book.imageLinks.thumbnail} alt="" />
                            <BookDetails>
                                <Detail>
                                    Published in{" "}
                                    <span class="bold">
                                        {moment(book.publishedDate).format(
                                            "YYYY"
                                        )}
                                    </span>{" "}
                                    by{" "}
                                    <span class="bold">{book.publisher}</span>
                                </Detail>
                                <Detail>
                                    Pages:{" "}
                                    <span class="bold">{book.pageCount}</span>
                                </Detail>
                                {book.categories && (
                                    <Detail>
                                        Categories:{" "}
                                        {book.categories.map((cat, k) => {
                                            console.log(cat);
                                            return (
                                                <>
                                                    <Subject
                                                        class="bold"
                                                        onClick={() =>
                                                            history.push(
                                                                `/subjectsearch/${cat}`
                                                            )
                                                        }
                                                    >
                                                        {cat}
                                                    </Subject>
                                                    <span>
                                                        {k !==
                                                            book.categories
                                                                .length -
                                                                1 && ", "}
                                                    </span>
                                                </>
                                            );
                                        })}
                                    </Detail>
                                )}
                            </BookDetails>
                        </CoverCol>
                        <BookInfo>
                            <Title>{book.title}</Title>
                            <Author>
                                <span class="normal">by</span>{" "}
                                {book.authors
                                    ? book.authors.join(", ")
                                    : "Unknown"}
                            </Author>
                            <BlackLine />
                            <p>
                                {book.description
                                    ? ReactHtmlParser(book.description)
                                    : "No Description"}
                            </p>
                        </BookInfo>
                    </BookContent>
                    {isReviewed ? (
                        <ExistingReview to={`/review/${reviewID}`}>
                            <p>
                                You already reviewed this book. Click here to
                                view it.
                            </p>
                        </ExistingReview>
                    ) : (
                        <Review>
                            <h2
                                style={{
                                    textAlign: "center",
                                    margin: "0px 0px 5px 0px",
                                }}
                            >
                                Write a review:{" "}
                            </h2>
                            <ReviewContent
                                onChange={(e) => setReview(e.target.value)}
                                placeholder="Review"
                            ></ReviewContent>
                            <RatingAndPost>
                                <Post
                                    disabled={rating === 0}
                                    onClick={handleReviewPost}
                                >
                                    Post
                                </Post>
                                <StarRating
                                    rating={rating}
                                    setRating={setRating}
                                    fixed={false}
                                />
                            </RatingAndPost>
                        </Review>
                    )}
                </Wrapper>
            )}
        </>
    );
};

const Wrapper = styled.div`
    width: 80%;
    height: auto;
    margin: auto;
    display: flex;
    flex-direction: column;
    background-color: ${themeVars.secondary};
    padding: 25px;
    border: 2px solid black;
    /* margin: 10px auto; */
`;

const BookContent = styled.div`
    display: flex;
    flex-direction: row;
    margin-bottom: 10px;
`;
const CoverCol = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${themeVars.primary};
    width: 25%;
    border: 2px solid black;
    margin: 0px 10px 0px 0px;
    padding: 10px;
`;
const Cover = styled.img`
    width: 100%;
    height: 100%;
    border: 1px solid black;
`;
const BookDetails = styled.div`
    display: flex;
    flex-direction: column;
`;
const Detail = styled.p`
    margin: 10px 0px;
`;
const Subject = styled.span`
    font-weight: bold;

    &:hover {
        color: ${themeVars.secondary};
        cursor: pointer;
    }
`;
const BookInfo = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${themeVars.primary};
    width: 75%;
    padding: 10px;
    border: 2px solid black;
`;
const Title = styled.h1`
    margin: 0px;
`;
const Author = styled.h2`
    margin: 0px;
    font-weight: bold;
    margin-bottom: 10px;
`;

//Review
const Review = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${themeVars.primary};
    width: 100%;
    border: 2px solid black;
    padding: 10px;
`;

const ReviewContent = styled.textarea`
    resize: none;
`;

const RatingAndPost = styled.div`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
`;

const Post = styled.button`
    width: auto;
    padding: 5px 25px 5px 25px;
    margin: 5px;
`;

const BlackLine = styled.hr`
    margin: 0px;
    background-color: black;
    border: none;
    height: 2px;
    width: 100%;
`;

const ExistingReview = styled(Link)`
    margin: 0px auto;
    background-color: ${themeVars.primary};
    border: 2px solid black;
    padding: 0px 5px;
    text-decoration: none;
    color: black;
`;
