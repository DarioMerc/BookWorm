import React, { useContext, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import styled from "styled-components";
import { themeVars } from "../GlobalStyle";
import { UserContext } from "./UserContext";

const isEmpty = (str) => {
    return str.length === 0 || !str.trim();
};

export const Login = () => {
    const { setUser } = useContext(UserContext);
    const [error, setError] = useState("");
    let history = useHistory();
    const handleSubmit = (e) => {
        e.preventDefault();
        let username = document.forms.login.elements["username"].value;
        let password = document.forms.login.elements["password"].value;

        if (!isEmpty(username) && !isEmpty(password)) {
            fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    // localStorage.setItem("token", data.token);
                    if (data.status !== 200) {
                        setError(data.message);
                    } else {
                        let currentUser = data.user;
                        delete currentUser.password;
                        localStorage.setItem("user", currentUser._id);
                        setUser(currentUser);
                        history.push("/");
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
            setError("Fields cant be empty");
        }
    };

    return (
        <Wrapper>
            <LoginContent>
                <Header>
                    <h1>BookWorm</h1>
                </Header>
                <BlackLine />
                <h2>Login</h2>
                <form id="login" onSubmit={handleSubmit}>
                    <FormWrapper>
                        <Field id="username" placeholder="Username"></Field>
                        <Field
                            id="password"
                            type="password"
                            placeholder="Password"
                        ></Field>
                        <button type="submit">Login</button>
                    </FormWrapper>
                </form>
                <p style={{ margin: "5px auto", padding: "0px" }}>{error}</p>
                <StyledLink to="/register">
                    <p>Create Account</p>
                </StyledLink>
            </LoginContent>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 90vh;
`;

const LoginContent = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-color: ${themeVars.tri};
    border-radius: 15px;
    border: 2px solid black;
    align-items: center;
    width: auto;
    height: auto;
    margin: 10px;
`;
const Header = styled.div`
    background-color: ${themeVars.secondary};
    width: 100%;
    border-radius: 15px 15px 0px 0px;
    padding: 0px 25px;
`;
const FormWrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: auto;
`;

const Field = styled.input`
    margin: 5px 0px;
`;

const BlackLine = styled.hr`
    margin: 0px auto;
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
