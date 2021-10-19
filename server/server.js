"use strict";
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const PORT = 8000;

const {
    getUser,
    getUsers,
    updateFavorites,
    getHomeFeed,
    getReview,
    postReview,
    postComment,
    deleteReview,
    searchBooks,
    getBook,
    likeDislike,
    deleteComment,
    getUsersReviews,
    updateFriend,
    searchBooksBySubject,
} = require("./handlers");
const { register, login } = require("./userHandlers");

const app = express()
    .use(morgan("dev"))
    .use(express.json())
    .use(bodyParser.json())
    .use(cors());

//user
app.post("/api/register", register);
app.post("/api/login", login);
app.get("/api/user/:_id", getUser);
app.get("/api/users", getUsers);
app.put("/api/user/friend", updateFriend);

//google books
app.get("/api/books/search/:search_query/:startIndex", searchBooks);
app.get("/api/books/:bookID", getBook);
app.post("/api/books/subjectsearch", searchBooksBySubject);

//favorites
app.put("/api/favorite/:_id", updateFavorites);
app.get("/api/:_id/favorites");

//reviews
app.get("/api/homefeed/:_id/:startIndex", getHomeFeed);
app.get("/api/review/:_id", getReview);
app.get("/api/reviews/user/:_id", getUsersReviews);
app.post("/api/review", postReview);
app.put("/api/review/delete", deleteReview);
app.put("/api/review/comment", postComment);
app.put("/api/review/comment/delete", deleteComment);
app.put("/api/likeDislike", likeDislike);

//.gets above
app.get("*", (req, res) => {
    res.status(404).json({
        status: 404,
        message: "This is NOT what you are looking for.",
    });
});

app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
});
