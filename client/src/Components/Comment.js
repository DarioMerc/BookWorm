import React, { useContext } from "react";
import styled from "styled-components";
import moment from "moment";
import { UserContext } from "./UserContext";
import { themeVars } from "../GlobalStyle";
import { useHistory } from "react-router";

export const Comment = ({ comment, reviewID, isHomepage }) => {
    const { user, setState } = useContext(UserContext);
    let history = useHistory();

    const handleDeleteComment = () => {
        if (window.confirm("Delete comment?")) {
            fetch("/api/review/comment/delete", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    reviewID,
                    commentID: comment._id,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setState(
                        `deleted comment ${comment._id} from review ${reviewID}`
                    );
                });
        }
    };

    return (
        <Wrapper>
            <Avatar
                onClick={() => history.push(`/profile/${comment.user._id}`)}
                src={comment.user.avatar}
            />
            <Content>
                <Header>
                    <Username
                        onClick={() =>
                            history.push(`/profile/${comment.user._id}`)
                        }
                    >
                        {comment.user.username}
                    </Username>
                    <Timestamp>
                        {moment(comment.timestamp).format(
                            "MMMM Do YYYY, h:mm a"
                        )}
                    </Timestamp>
                </Header>
                <BlackLine />
                <Text>{comment.comment}</Text>
                {!isHomepage && user && user._id === comment.user._id && (
                    <DeleteComment onClick={handleDeleteComment}>
                        x
                    </DeleteComment>
                )}
            </Content>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    /* border-radius: 15px; */
    border: 2px solid black;
    margin: 5px auto;
    width: 100%;
    background-color: ${themeVars.tri};
    white-space: pre-line;
    overflow-wrap: normal;
`;
const Avatar = styled.img`
    height: 35px;
    width: auto;
    border-radius: 50%;
    margin: 10px 5px auto 5px;
    cursor: pointer;
`;

const Content = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    overflow-wrap: break-word;
    margin: auto;
`;
const Header = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    width: 100%;
    margin: auto;
    justify-content: space-between;
`;
const Username = styled.p`
    margin: 5px;
    font-weight: bold;
    cursor: pointer;
`;
const Timestamp = styled.p`
    margin: 0px 5px;
    font-size: small;
`;
const Text = styled.p`
    margin: 10px 5px 5px 5px;
    overflow-wrap: break-word;
`;
const BlackLine = styled.hr`
    margin: auto;
    background-color: black;
    border: none;
    height: 2px;
    width: 100%;
`;
const DeleteComment = styled.button`
    margin: 0px 1px 1px auto;
    /* border-radius: 0px 0px 0px 15px; */
    border-style: none;
    background-color: red;
    color: white;

    &:hover {
        background-color: firebrick;
        cursor: pointer;
    }
`;
