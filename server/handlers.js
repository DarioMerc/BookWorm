const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const assert = require("assert");
const request = require("request-promise");
require("dotenv").config();
const { MONGO_URI, GOOGLE_API_KEY } = process.env;

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};
//User
const getUsers = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Project");
        const usersArray = await db
            .collection("users")
            .find({}, { projection: { password: 0 } })
            .toArray();
        await client.close();

        return res.status(200).json({ status: 200, users: usersArray });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};
const getUser = async (req, res) => {
    const _id = req.params._id;
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Project");
        const user = await db.collection("users").findOne({ _id });
        await client.close();
        if (user) {
            delete user.password;
            res.status(200).json({ status: 200, user });
        } else {
            res.status(404).json({
                status: 404,
                message: "ERROR: User not found.",
            });
        }
    } catch (error) {
        res.status(500).json({ status: 500, message: error });
    }
};
const updateFriend = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { profileID, userID, username, avatar } = req.body;
    try {
        await client.connect();
        const db = client.db("Project");
        const profile = await db
            .collection("users")
            .findOne({ _id: profileID });

        if (profile.followers.some((user) => user._id === userID)) {
            //remove user from profile followers
            //remove profile from user following
            await db
                .collection("users")
                .updateOne(
                    { _id: profileID },
                    { $pull: { followers: { _id: userID } } }
                );
            await db
                .collection("users")
                .updateOne(
                    { _id: userID },
                    { $pull: { following: { _id: profileID } } }
                );

            await client.close();
            return res
                .status(200)
                .json({ status: 200, message: "unfollowed user" });
        } else {
            await db.collection("users").updateOne(
                { _id: profileID },
                {
                    $push: {
                        followers: { _id: userID, username, avatar },
                    },
                }
            );
            await db.collection("users").updateOne(
                { _id: userID },
                {
                    $push: {
                        following: {
                            _id: profileID,
                            username: profile.username,
                            avatar: profile.avatar,
                        },
                    },
                }
            );

            await client.close();
            return res
                .status(200)
                .json({ status: 200, message: "followed user" });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};

//Favorites
const updateFavorites = async (req, res) => {
    const _id = req.params._id;
    const { bookID, title, cover, author, categories } = req.body;

    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Project");
        const check = await db.collection("users").findOne({ _id });

        //check if favorite is already there.
        //If it is, remove it.
        //If it isnt, add it.
        if (check.favorites.some((fav) => fav.bookID === bookID)) {
            await db
                .collection("users")
                .updateOne({ _id }, { $pull: { favorites: { bookID } } });

            await client.close();
            return res
                .status(200)
                .json({ status: 200, message: "removed from favorites" });
        } else {
            await db.collection("users").updateOne(
                { _id },
                {
                    $push: {
                        favorites: { bookID, title, author, cover, categories },
                    },
                }
            );

            await client.close();
            return res
                .status(200)
                .json({ status: 200, message: "added to favorites" });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};

//Reviews
const getHomeFeed = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const _id = req.params._id;
    const index = parseInt(req.params.startIndex);
    try {
        await client.connect();
        const db = client.db("Project");

        //Get array of friend IDs
        const following = await db
            .collection("users")
            .findOne({ _id }, { projection: { "following._id": 1 } });
        const friendsArray = following.following.map((e) => e._id);

        //Get friends reviews
        const homeFeed = await db
            .collection("reviews")
            .find({ "user._id": { $in: friendsArray } })
            .sort({ timestamp: -1 })
            .skip(index)
            .limit(10)
            .toArray();
        await client.close();

        return res.status(200).json({ status: 200, homeFeed });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};
const getReview = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const _id = req.params._id;
    try {
        await client.connect();
        const db = client.db("Project");
        const review = await db.collection("reviews").findOne({ _id });
        await client.close();

        return res.status(200).json({ status: 200, review });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};
const postReview = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { book, user, review, rating, timestamp } = req.body;
    try {
        await client.connect();
        const db = client.db("Project");

        const userReview = {
            _id: uuidv4(),
            book,
            user,
            review,
            rating,
            comments: [],
            timestamp,
            likedBy: [],
            dislikedBy: [],
        };
        //add review to the review db
        const reviewResult = await db
            .collection("reviews")
            .insertOne(userReview);
        assert.equal(true, reviewResult.acknowledged);
        //add bookID to reviews array in user
        const userResult = await db.collection("users").updateOne(
            { _id: user._id },
            {
                $push: {
                    reviews: {
                        reviewID: userReview._id,
                        bookID: book.bookID,
                    },
                },
            }
        );
        assert.equal(1, userResult.matchedCount);
        assert.equal(1, userResult.modifiedCount);
        await client.close();

        return res
            .status(201)
            .json({ status: 201, message: "success", userReview });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};
const deleteReview = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { reviewID, bookID, userID } = req.body;
    try {
        await client.connect();
        const db = client.db("Project");

        //remove from user's reviews array
        const userResult = await db
            .collection("users")
            .updateOne(
                { _id: userID },
                { $pull: { reviews: { reviewID: reviewID } } }
            );
        assert.equal(1, userResult.modifiedCount);

        //delete review document
        const reviewResult = await db
            .collection("reviews")
            .deleteOne({ _id: reviewID });
        assert.equal(1, reviewResult.deletedCount);

        return res.status(200).json({ status: 200, message: "success" });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};
const postComment = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { reviewID, user, comment, timestamp } = req.body;
    try {
        await client.connect();
        const db = client.db("Project");

        const userComment = { _id: uuidv4(), user, comment, timestamp };
        await db
            .collection("reviews")
            .updateOne({ _id: reviewID }, { $push: { comments: userComment } });

        return res.status(201).json({ status: 201, comment: userComment });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};
const deleteComment = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { reviewID, commentID } = req.body;

    try {
        await client.connect();
        const db = client.db("Project");
        const result = await db
            .collection("reviews")
            .updateOne(
                { _id: reviewID },
                { $pull: { comments: { _id: commentID } } }
            );
        assert.equal(1, result.modifiedCount);
        return res
            .status(200)
            .json({ status: 200, message: "deleted comment" });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};
const likeDislike = async (req, res) => {
    //this is for both the like and dislike
    const { userID, reviewID, option } = req.body;
    const client = new MongoClient(MONGO_URI, options);
    try {
        await client.connect();
        const db = client.db("Project");
        const review = await db
            .collection("reviews")
            .findOne({ _id: reviewID });

        //check if alrady liked already there.
        //If it is, remove it.
        //If it isnt, add it.
        let arrName = option === "like" ? "likedBy" : "dislikedBy";
        if (review[arrName].includes(userID)) {
            console.log("YO");
            await db
                .collection("reviews")
                .updateOne({ _id: reviewID }, { $pull: { [arrName]: userID } });

            await client.close();
            return res.status(200).json({ status: 200, message: "" });
        } else {
            await db.collection("reviews").updateOne(
                { _id: reviewID },
                {
                    $push: {
                        [arrName]: userID,
                    },
                }
            );

            await client.close();
            return res
                .status(200)
                .json({ status: 200, message: "added to favorites" });
        }
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};
const getUsersReviews = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const _id = req.params._id;

    try {
        await client.connect();
        const db = client.db("Project");
        const reviewsArray = await db
            .collection("reviews")
            .find({ "user._id": _id })
            .toArray();
        await client.close();

        return res
            .status(200)
            .json({ status: 200, reviews: reviewsArray.reverse() });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};

//GOOGLE BOOKS
const searchBooks = async (req, res) => {
    try {
        const search = req.params.search_query;
        const index = req.params.startIndex;

        const response = await request(
            `https://www.googleapis.com/books/v1/volumes?q=${search}&key=${GOOGLE_API_KEY}&startIndex=${index}&maxResults=10`,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );
        const result = await JSON.parse(response);
        return res.status(200).json({ status: 200, data: result });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};
const getBook = async (req, res) => {
    try {
        const bookID = req.params.bookID;
        const response = await request(
            `https://www.googleapis.com/books/v1/volumes/${bookID}?key=${GOOGLE_API_KEY}`,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );
        const result = await JSON.parse(response);
        return res.status(200).json({ status: 200, data: result });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};
const searchBooksBySubject = async (req, res) => {
    try {
        const subject = req.body.search_query;
        const index = req.body.startIndex;

        const response = await request(
            `https://www.googleapis.com/books/v1/volumes?q=+subject:${subject}&key=${GOOGLE_API_KEY}&startIndex=${index}&maxResults=20`,
            {
                headers: {
                    Accept: "application/json",
                },
            }
        );
        const result = await JSON.parse(response);
        return res.status(200).json({ status: 200, data: result });
    } catch (error) {
        return res.status(500).json({ status: 500, message: error });
    }
};
module.exports = {
    getUser,
    getUsers,
    updateFavorites,
    getHomeFeed,
    getReview,
    getUsersReviews,
    postReview,
    deleteReview,
    postComment,
    deleteComment,
    searchBooks,
    getBook,
    likeDislike,
    updateFriend,
    searchBooksBySubject,
};
