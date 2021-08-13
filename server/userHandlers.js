const { MongoClient } = require("mongodb");
const { v4: uuidv4 } = require("uuid");
const assert = require("assert");
require("dotenv").config();
const { MONGO_URI, JWT_KEY } = process.env;

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const options = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
};

//REGISTER
const register = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { username, password, firstname, lastname, email, timestamp } =
        req.body;

    try {
        await client.connect();
        const db = client.db("Project");

        //check if username already exists
        const check = await db.collection("users").findOne({ username });
        if (check) {
            await client.close();
            return res.status(400).json({
                status: 400,
                message: "Username already exists",
            });
        }

        //create user
        const _id = uuidv4();
        const avatar = `https://avatars.dicebear.com/api/identicon/${username}.svg?b=%23ffffff`;
        const hashedPassword = await bcrypt.hash(
            password,
            await bcrypt.genSalt(10)
        );
        const user = {
            _id,
            username,
            firstname,
            lastname,
            email,
            password: hashedPassword,
            avatar,
            favorites: [],
            reviews: [],
            following: [],
            followers: [],
            timestamp,
        };

        const result = await db.collection("users").insertOne(user);
        assert.equal(true, result.acknowledged);
        await client.close();
        delete user.password;

        return res.status(201).json({ status: 201, message: "success", user });
    } catch (err) {
        return res.status(500).json({ status: 500, message: err.message });
    }
};

//LOGIN
const login = async (req, res) => {
    const client = new MongoClient(MONGO_URI, options);
    const { username, password } = req.body;
    try {
        await client.connect();
        const db = client.db("Project");

        const result = await db.collection("users").findOne({ username });
        await client.close();

        if (!result) {
            return res.status(400).json({
                status: 400,
                message: "Username or Password is wrong",
            });
        } else {
            const check = await bcrypt.compare(password, result.password);
            if (!check) {
                return res.status(400).json({
                    status: 400,
                    message: "Username or Password is wrong",
                });
            } else {
                const token = jwt.sign(
                    { _id: result._id, username: result.username },
                    JWT_KEY,
                    {
                        expiresIn: "1h",
                    }
                );

                return res
                    .status(200)
                    .json({ status: 200, user: result, token });
            }
        }
    } catch (err) {
        return res.status(500).json({ status: 500, message: err });
    }
};

module.exports = { register, login };
