import moment from "moment";
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router";
import styled from "styled-components";
import { themeVars } from "../GlobalStyle";
import { Loading } from "./Loading";
import StarRating from "./StarRating";
import { UserContext } from "./UserContext";
export const Profile = () => {
    const profileID = useParams()._id;
    const { user, setState } = useContext(UserContext);
    const [profile, setProfile] = useState();
    const [profilesReviews, setProfilesReviews] = useState();
    let history = useHistory();

    const isUser = user && user._id === profileID;
    const isFollowing = user && user.following.some((u) => u._id === profileID);

    //Get User Profile
    useEffect(() => {
        async function fetchData() {
            setProfile(undefined);
            setProfilesReviews(undefined);
            if (isUser) {
                setProfile(user);
            } else {
                const profileRes = await fetch(`/api/user/${profileID}`);
                let profileData = await profileRes.json();
                console.log("PROFILE", profileData.user);
                setProfile(profileData.user);
            }

            const profileReviewsRes = await fetch(
                `/api/reviews/user/${profileID}`
            );
            let profileReviewsData = await profileReviewsRes.json();
            console.log(profileReviewsData);
            setProfilesReviews(profileReviewsData.reviews);
        }
        fetchData();
    }, [user, profileID, isUser]);

    const handleDeleteFavorite = (fav) => {
        fetch(`/api/favorite/${profile._id}`, {
            method: "PUT",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({
                bookID: fav.bookID,
                title: fav.title,
                cover: fav.cover,
                author: fav.author,
                categories: fav.categories,
            }),
        })
            .then((res) => res.json())
            .then((data) => {
                setState(`deleted ${fav.bookID} from favorites`);
            });
    };

    const handleFriend = (action) => {
        console.log(action);
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
        <>
            {profile ? (
                <Wrapper>
                    <ProfileContent>
                        <AvatarCol>
                            <Avatar src={profile.avatar} alt="" />
                            <FriendWrapper>
                                {profile.followers.length > 0 && (
                                    <p class="nomargin">Followers:</p>
                                )}
                                <AvatarWrapper>
                                    {profile.followers.map((fl) => {
                                        return (
                                            <FriendAvatar
                                                src={fl.avatar}
                                                title={fl.username}
                                                onClick={() =>
                                                    history.push(
                                                        `/profile/${fl._id}`
                                                    )
                                                }
                                            />
                                        );
                                    })}
                                </AvatarWrapper>
                                {profile.following.length > 0 && (
                                    <p class="nomargin">Following:</p>
                                )}
                                <AvatarWrapper>
                                    {profile.following.map((fl) => {
                                        return (
                                            <FriendAvatar
                                                src={fl.avatar}
                                                title={fl.username}
                                                onClick={() =>
                                                    history.push(
                                                        `/profile/${fl._id}`
                                                    )
                                                }
                                            />
                                        );
                                    })}
                                </AvatarWrapper>
                            </FriendWrapper>
                        </AvatarCol>
                        <ProfileInfo>
                            <Head>
                                <h2>{profile.username}</h2>
                                {!isUser && (
                                    <Friend
                                        id={isFollowing ? "Unfollow" : "Follow"}
                                        onClick={(e) =>
                                            handleFriend(e.target.id)
                                        }
                                    >
                                        {isFollowing ? "Unfollow" : "Follow"}
                                    </Friend>
                                )}
                            </Head>
                            <BlackLine />
                            <p class="nomargin">
                                <span class="bold">Full Name: </span>
                                {`${profile.firstname} ${profile.lastname}`}
                            </p>
                            <p class="nomargin">
                                <span class="bold">Email: </span>
                                {profile.email}
                            </p>
                            <p class="nomargin">
                                <span class="bold">Joined: </span>
                                {moment(profile.timestamp).format(
                                    "MMMM Do YYYY"
                                )}
                            </p>
                        </ProfileInfo>
                        <UserReviews>
                            <h2 class="nomargin centertext">Reviews</h2>
                            {profilesReviews &&
                                profilesReviews.map((rev, k) => {
                                    return (
                                        <ReviewLink key={k}>
                                            <ReviewLinkCover
                                                src={rev.book.cover}
                                                onClick={() =>
                                                    history.push(
                                                        `/review/${rev._id}`
                                                    )
                                                }
                                            />
                                            <ReviewLinkInfo>
                                                <p class="bold nomargin">
                                                    {rev.book.title}
                                                </p>
                                                <p class="bold nomargin">
                                                    <span class="normal nomargin">
                                                        By
                                                    </span>{" "}
                                                    {rev.book.author}
                                                </p>
                                                <span class="heightspacer"></span>
                                                <StarRating
                                                    rating={rev.rating}
                                                    fixed={true}
                                                />
                                                <p style={{ margin: "0px" }}>
                                                    {moment(
                                                        rev.timestamp
                                                    ).format("MMMM Do YYYY")}
                                                </p>
                                            </ReviewLinkInfo>
                                        </ReviewLink>
                                    );
                                })}
                        </UserReviews>
                    </ProfileContent>
                    <h2>Favorites</h2>
                    <FavoritesWrapper>
                        {profile.favorites.map((fav) => {
                            return (
                                <Favorite>
                                    <FavCover
                                        src={fav.cover.thumbnail}
                                        onClick={() =>
                                            history.push(`/book/${fav.bookID}`)
                                        }
                                    />
                                    <FavTitle>{fav.title}</FavTitle>-{" "}
                                    <FavAuthor>
                                        {fav.author && fav.author.join(", ")}
                                    </FavAuthor>
                                    {isUser && (
                                        <DeleteFav
                                            onClick={() =>
                                                handleDeleteFavorite(fav)
                                            }
                                        >
                                            x
                                        </DeleteFav>
                                    )}
                                </Favorite>
                            );
                        })}
                    </FavoritesWrapper>
                </Wrapper>
            ) : (
                <Loading />
            )}
        </>
    );
};

const Wrapper = styled.div`
    width: 80%;
    margin: auto;
    display: flex;
    flex-direction: column;
    padding: 25px;
    background-color: ${themeVars.tri};
    height: auto;
    border: 2px solid black;
`;
const ProfileContent = styled.div`
    display: flex;
    flex-direction: row;
    width: auto;
    /* border: 2px solid black; */
    height: 30%;
`;
const ProfileInfo = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${themeVars.secondary};
    width: 50%;
    margin: 0px 10px;
    padding: 0px 10px;
    border: 2px solid black;
    /* border-left: 0; */
`;
const Head = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0px;
`;
const Friend = styled.button`
    margin: 0px;
    border-style: none;
    padding: 5px;
    background-color: ${themeVars.four};
    font-weight: bold;
    cursor: pointer;
    &:hover {
        background-color: ${themeVars.five};
    }
`;
const AvatarCol = styled.div`
    display: flex;
    flex-direction: column;
    width: 20%;
    padding: 10px;
    border: 2px solid black;
    background-color: ${themeVars.secondary};
`;
const Avatar = styled.img`
    width: auto;
    height: auto;
    border: 2px solid black;
    /* margin: auto; */
`;
const UserReviews = styled.div`
    display: flex;
    flex-direction: column;
    width: 30%;
    max-height: 400px;
    /* background-color: lightcoral; */
    overflow-y: auto;
    flex-wrap: nowrap;
    border: 2px solid black;
    background-color: ${themeVars.secondary};
`;

const ReviewLink = styled.div`
    display: flex;
    flex-direction: row;
    border: 2px solid black;
    margin: 5px 10px;
    /* border-radius: 15px; */
    background-color: ${themeVars.primary};
    padding: 5px;
`;
const ReviewLinkCover = styled.img`
    /* flex: 1; */
    width: 30%;
    cursor: pointer;
`;
const ReviewLinkInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin: 0px 5px;
`;
//FAVORITES
const FavoritesWrapper = styled.div`
    display: flex;
    overflow-x: auto;
    flex-wrap: nowrap;
    align-items: stretch;
    width: 100%;
    border: 2px solid black;
    padding: 10px;
    background-color: ${themeVars.secondary};
`;
const Favorite = styled.div`
    display: flex;
    flex-direction: column;
    margin: 5px;
    border: 2px solid black;
    flex: 0 0 auto;
    text-align: center;
    width: 12%;
    height: auto;
    padding: 5px;
    background-color: ${themeVars.primary};
`;
const FavCover = styled.img`
    height: 70%;
    width: auto;
    cursor: pointer;
`;
const FavTitle = styled.p`
    margin: 0px;
    font-weight: bold;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
`;
const FavAuthor = styled.p`
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    margin: 0px;
`;
const DeleteFav = styled.button`
    position: relative;
    border-style: none;
    background-color: red;
    color: white;
    margin: auto 1px 1px auto;
    padding: 1px;

    &:hover {
        background-color: firebrick;
        cursor: pointer;
    }
`;

const BlackLine = styled.hr`
    background-color: black;
    border: none;
    height: 2px;
    width: 100%;
`;
const FriendWrapper = styled.div`
    margin: 10px 0px auto 0px;
`;
const AvatarWrapper = styled.div`
    display: flex;
    flex-direction: row;
    overflow-x: auto;
    margin-bottom: 5px;
`;
const FriendAvatar = styled.img`
    width: 10%;
    height: auto;
    margin: 5px;
    flex: 0 0 auto;
    cursor: pointer;
`;
