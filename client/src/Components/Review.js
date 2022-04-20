import React, { useContext, useState } from "react";
import styled from "styled-components";
import moment from "moment";
import StarRating from "./StarRating";

import { FiThumbsUp } from "react-icons/fi";
import { FiThumbsDown } from "react-icons/fi";
import { useHistory } from "react-router";
import { Comment } from "./Comment";
import { UserContext } from "./UserContext";
import { themeVars } from "../GlobalStyle";

const Review = ({ review, isHomepage }) => {
    const { user, setState } = useContext(UserContext);
    let history = useHistory();
    const [comment, setComment] = useState();
    let isLiked = user && review.likedBy.includes(user._id);
    let isDisliked = user && review.dislikedBy.includes(user._id);

    //HANDLE REDIRECTS
    const handleClick = (e) => {
        console.log("clicked", e.target.id);
        if (e.target.id === "review") {
            history.push(`/review/${review._id}`);
        } else if (e.target.id === "profile") {
            history.push(`/profile/${review.user._id}`);
        } else if (e.target.id === "book") {
            history.push(`/book/${review.book.bookID}`);
        }
    };
    //POST COMMENT
    const handlePostComment = () => {
        fetch("/api/review/comment", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                reviewID: review._id,
                user: {
                    _id: user._id,
                    username: user.username,
                    avatar: user.avatar,
                },
                comment,
                timestamp: moment(),
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setState(
                    `commented "${comment}" on ${review._id} at ${moment()}`
                );
                document.getElementById("comment_form").value = "";
            });
    };

    const handleLikeDislike = (option) => {
        fetch("/api/likeDislike", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                option,
                reviewID: review._id,
                userID: user._id,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setState(`${option} ${review._id} at ${moment()}`);
            });
    };
    //DELETE REVIEW
    const handleDelete = () => {
        if (window.confirm(`Delete Review: ${review._id}?`)) {
            fetch("/api/review/delete", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reviewID: review._id,
                    bookID: review.book.bookID,
                    userID: review.user._id,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setState(`deleted review ${review._id}`);
                    history.push("/");
                });
        }
    };

    return (
        <ReviewWrapper onClick={handleClick}>
            <Header>
                <Profile id="profile">
                    <Avatar src={review.user.avatar} id="profile" />
                    <Username id="profile">{review.user.username}</Username>
                </Profile>
                <Right>
                    <p style={{ fontSize: "small" }}>
                        {moment(review.timestamp).format(
                            "MMMM Do YYYY, h:mm a"
                        )}
                    </p>
                    {!isHomepage && user && user._id === review.user._id && (
                        <DeleteReview onClick={handleDelete}>x</DeleteReview>
                    )}
                </Right>
            </Header>
            <ReviewContent id="book" noComments={review.comments.length === 0}>
                <Cover id="book" src={review.book.cover} />
                <ReviewInfo id="review">
                    <Title id="book">{review.book.title}</Title>
                    <Author id="book">
                        <span style={{ fontWeight: "normal" }}>By</span>{" "}
                        {review.book.author.join(", ")}
                    </Author>
                    <BlackLine />
                    <p
                        id="review"
                        style={{ height: "100%", cursor: "pointer" }}
                    >
                        {review.review}
                    </p>
                    <StarRating rating={review.rating} fixed={true} />
                    <BlackLine />
                    <Actions>
                        <LikeDislike>
                            <FiThumbsUp
                                onClick={() => handleLikeDislike("like")}
                                style={{
                                    width: "25px",
                                    height: "25px",
                                    margin: "0px",
                                    fill: isLiked ? "green" : "white",
                                    cursor: "pointer",
                                }}
                            />
                            <p style={{ margin: "0px" }}>
                                {review.likedBy.length}
                            </p>
                        </LikeDislike>
                        <LikeDislike>
                            <FiThumbsDown
                                onClick={() => handleLikeDislike("dislike")}
                                style={{
                                    width: "25px",
                                    height: "25px",
                                    margin: "0px",
                                    fill: isDisliked ? "firebrick" : "white",
                                    cursor: "pointer",
                                }}
                            />
                            <p style={{ margin: "0px" }}>
                                {review.dislikedBy.length}
                            </p>
                        </LikeDislike>
                    </Actions>
                </ReviewInfo>
            </ReviewContent>

            {!isHomepage && (
                <>
                    <CommentForm>
                        <CommentContent
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Comment"
                            id="comment_form"
                        />
                        <button onClick={handlePostComment}>Post</button>
                    </CommentForm>
                </>
            )}
            {review.comments.length > 0 && (
                <>
                    <p
                        style={{
                            textAlign: "center",
                            margin: "0px auto",
                            backgroundColor: `${themeVars.secondary}`,
                            border: "2px solid black",
                            borderTop: "0",
                            borderBottom: "0",
                        }}
                    >
                        Comments:
                    </p>
                </>
            )}
            <CommentWrapper>
                {review.comments.map((comment, k) => {
                    return isHomepage ? (
                        k < 2 && (
                            <Comment
                                comment={comment}
                                reviewID={review._id}
                                isHomepage={isHomepage}
                                key={k}
                            />
                        )
                    ) : (
                        <Comment
                            comment={comment}
                            key={k}
                            reviewID={review._id}
                            isHomepage={isHomepage}
                        />
                    );
                })}
                {isHomepage && review.comments.length > 2 && (
                    <p
                        id="review"
                        style={{ margin: "0px auto", cursor: "pointer" }}
                    >
                        {review.comments.length - 2} more comments...
                    </p>
                )}
            </CommentWrapper>
        </ReviewWrapper>
    );
};

const ReviewWrapper = styled.div`
    margin: 10px 15%;
    border-radius: 15px;
`;

//REVIEW
const Header = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    background-color: ${themeVars.secondary};
    border-radius: 15px 15px 0px 0px;
    padding: 0px 10px;
    justify-content: space-between;
    border: 2px solid black;
`;
const Profile = styled.div`
    display: flex;
    align-items: center;

    &:hover {
        cursor: pointer;
    }
`;
const Right = styled.div`
    display: flex;
`;
const DeleteReview = styled.button`
    margin: auto;
    border-style: none;
    background-color: red;
    color: white;

    &:hover {
        background-color: firebrick;
        cursor: pointer;
    }
`;
const Avatar = styled.img`
    width: 35px;
    height: auto;
    border-radius: 50%;
    margin-right: 10px;
    box-shadow: 0px 0px 2px black;
`;
const Username = styled.p`
    font-weight: bold;
`;
const ReviewContent = styled.div`
    display: flex;
    flex-direction: row;
    padding: 10px;
    background-color: ${themeVars.tri};
    border: 2px solid black;
    border-top: 0;
    /* cursor: pointer; */
`;
const Cover = styled.img`
    width: 20%;
    height: auto;
    box-shadow: 0 0 3px black;
    cursor: pointer;
`;
const ReviewInfo = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin: 0px 10px;
`;
const Title = styled.h2`
    margin: 0px;
    font-size: 2em;
    cursor: pointer;
`;
const Author = styled.h3`
    margin: 0px 0px 10px 0px;
    font-size: 1.5em;
    cursor: pointer;
`;
const Actions = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-evenly;
`;
const LikeDislike = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-top: 10px;
`;
const CommentForm = styled.div`
    display: flex;
    flex-direction: row;
    padding: 5px;
    background-color: ${themeVars.secondary};
    border: 2px solid black;
    border-top: 0;
    border-bottom: 0;
`;
const CommentContent = styled.textarea`
    width: 100%;
    resize: none;
`;
const CommentWrapper = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${themeVars.secondary};
    border-radius: 0px 0px 15px 15px;
    padding: 5px 10px;
    border: 2px solid black;
    border-top: 0;
`;
const BlackLine = styled.hr`
    margin: auto;
    background-color: black;
    border: none;
    height: 2px;
    width: 100%;
`;
export default Review;
