import moment from "moment";
import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { themeVars } from "../GlobalStyle";
import { UserContext } from "./UserContext";

const isEmpty = (str) => {
    return str.length === 0 || !str.trim();
};

export const Register = () => {
    const [username, setUsername] = useState("");
    const [error, setError] = useState("");
    let history = useHistory();
    const { setUser } = useContext(UserContext);

    const handleSubmit = (e) => {
        e.preventDefault();
        let username = document.forms.register.elements["username"].value;
        let password = document.forms.register.elements["password"].value;
        let firstname = document.forms.register.elements["firstname"].value;
        let lastname = document.forms.register.elements["lastname"].value;
        let email = document.forms.register.elements["email"].value;
        let passwordConfirm =
            document.forms.register.elements["confirmPassword"].value;

        if (
            isEmpty(username) ||
            isEmpty(password) ||
            isEmpty(passwordConfirm) ||
            isEmpty(firstname) ||
            isEmpty(lastname) ||
            isEmpty(email)
        ) {
            setError("All fields must be filled.");
        } else if (password !== passwordConfirm) {
            setError("Passwords do not match.");
        } else {
            fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    firstname,
                    lastname,
                    email,
                    timestamp: moment(),
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    //add token to local storage
                    //add token to context
                    if (data.status == 201) {
                        let currentUser = data.user;
                        localStorage.setItem("user", currentUser._id);
                        setUser(currentUser);
                        history.push("/");
                    } else {
                        setError(data.message);
                    }
                });
        }
    };

    return (
        <Wrapper>
            <RegisterContent>
                <Header>
                    <h1>BookWorm</h1>
                </Header>
                <BlackLine />
                <h2>Register</h2>
                <form id="register" onSubmit={handleSubmit}>
                    <FormWrapper>
                        <Avatar
                            id="avatar"
                            src={`https://avatars.dicebear.com/api/identicon/${username}.svg?b=%23ffffff`}
                        />
                        <AvatarInfo>
                            Avatar will be randomly generated.
                        </AvatarInfo>
                        <Field
                            type="text"
                            id="username"
                            placeholder="Username"
                            onChange={(e) => setUsername(e.target.value)}
                        ></Field>
                        <Field
                            type="text"
                            id="firstname"
                            placeholder="First Name"
                        ></Field>
                        <Field
                            type="text"
                            id="lastname"
                            placeholder="Last Name"
                        ></Field>
                        <Field
                            type="text"
                            id="email"
                            placeholder="Email"
                        ></Field>
                        <Field
                            type="password"
                            id="password"
                            placeholder="Password"
                        ></Field>
                        <Field
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm Password"
                        ></Field>
                        <Error>{error}</Error>
                        <button type="submit">Submit</button>
                    </FormWrapper>
                </form>
                <StyledLink to="/login">
                    <p>Login</p>
                </StyledLink>
            </RegisterContent>
        </Wrapper>
    );
};
const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
    /* background-color: lightpink; */
`;

const RegisterContent = styled.div`
    display: flex;
    flex-direction: column;
    background-color: ${themeVars.tri};
    /* justify-content: center; */
    align-items: center;
    width: 20%;
    height: auto;
    border-radius: 15px;
    border: 2px solid black;
`;
const Field = styled.input`
    margin-bottom: 5px;
`;
const Avatar = styled.img`
    width: 100px;
    height: auto;
`;
const AvatarInfo = styled.p`
    font-size: small;
`;
const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`;
const Header = styled.div`
    background-color: ${themeVars.secondary};
    width: 100%;
    border-radius: 15px 15px 0px 0px;
    text-align: center;
`;
const Error = styled.p`
    color: red;
    /* font-size: small; */
    margin: 10px;
    font-weight: bold;
`;
const BlackLine = styled.hr`
    margin: auto;
    background-color: black;
    border: none;
    height: 2px;
    width: 100%;
`;

const StyledLink = styled(Link)`
    text-decoration: none;
    font-weight: bold;
    color: white;

    &:hover {
        color: ${themeVars.primary};
        transition: 0.5s;
    }
`;
