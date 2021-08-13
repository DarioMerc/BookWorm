import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router";
import styled from "styled-components";
import { themeVars } from "../GlobalStyle";
import { Loading } from "./Loading";
import { UserContext } from "./UserContext";

export const Community = () => {
    const [users, setUsers] = useState();
    const { user, setState } = useContext(UserContext);
    const isFollowing = user && user.following.some((u) => u._id === user._id);
    let history = useHistory();

    useEffect(() => {
        fetch("/api/users")
            .then((res) => res.json())
            .then((data) => {
                console.log(data.users);
                setUsers(data.users);
            });
    }, []);

    const handleFriend = (action, profileID) => {
        fetch("/api/user/friend", {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                profileID,
                userID: user._id,
                username: user.username,
                avatar: user.avatar,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setState(`${action} ${profileID}`);
            });
    };

    return (
        <Wrapper>
            {!user || !users ? (
                <Loading />
            ) : (
                users.map((u) => {
                    return (
                        <UserLink>
                            <Avatar
                                src={u.avatar}
                                onClick={() =>
                                    history.push(`/profile/${u._id}`)
                                }
                            />
                            <ProfileDetails>
                                <h1 class="nomargin">{u.username}</h1>
                                <span class="heightspacer"></span>
                                <p class="nomargin">
                                    <span class="bold">Full Name: </span>
                                    {`${u.firstname} ${u.lastname}`}
                                </p>
                                <p class="nomargin">
                                    <span class="bold">Email: </span>
                                    {u.email}
                                </p>
                                <p class="nomargin">
                                    <span class="bold">Joined: </span>
                                    {moment(u.timestamp).format("MMMM Do YYYY")}
                                </p>
                            </ProfileDetails>
                            {u._id !== user._id && (
                                <Friend
                                    id={
                                        user.following.some(
                                            (friend) => friend._id === user._id
                                        )
                                            ? "Unfollow"
                                            : "Follow"
                                    }
                                    onClick={(e) =>
                                        handleFriend(e.target.id, u._id)
                                    }
                                >
                                    {user.following.some(
                                        (friend) => friend._id === u._id
                                    )
                                        ? "Unfollow"
                                        : "Follow"}
                                </Friend>
                            )}
                        </UserLink>
                    );
                })
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    margin: auto;
`;
const ProfileDetails = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-left: 10px;
`;
const UserLink = styled.div`
    display: flex;
    flex-direction: row;
    margin: 10px;
    border: 2px solid black;
    padding: 10px;
    background-color: ${themeVars.secondary};
    /* align-items: center; */
    /* justify-content: space-around; */
    width: auto;
    height: auto;
`;

const Avatar = styled.img`
    height: auto;
    width: 25%;
    cursor: pointer;
`;

const Friend = styled.button`
    margin: auto;
    border-style: none;
    padding: 5px;
    background-color: ${themeVars.four};
    font-weight: bold;
    cursor: pointer;
    &:hover {
        background-color: ${themeVars.five};
    }
`;
