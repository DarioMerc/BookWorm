import React, { useContext } from "react";
import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { themeVars } from "../GlobalStyle";
import { UserContext } from "./UserContext";

export const Header = () => {
    const { user } = useContext(UserContext);
    const handleLogout = () => {
        if (window.confirm("Confirm Logout?")) {
            localStorage.removeItem("user");
            window.location.replace("/");
        }
    };
    return (
        <Wrapper>
            <Home to="/">
                <HomeH2>BookWorm</HomeH2>
            </Home>
            <NavItem to="/search">
                <Page>Search</Page>
            </NavItem>
            <NavItem to="/community">
                <Page>Community</Page>
            </NavItem>
            <span class="widthspacer"></span>
            <NavItem to={`/profile/${user._id}`}>
                <Page>{user.username}</Page>
            </NavItem>
            <LogOut onClick={handleLogout}>Logout</LogOut>
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: row;
    background-color: ${themeVars.secondary};
    align-items: baseline;
    width: 80%;
    margin: 10px auto;
    padding: 5px;
    border: 2px solid black;
`;

const NavItem = styled(NavLink)`
    text-decoration: none;
    color: white;
    margin: 0px 10px;

    &:hover {
        color: ${themeVars.primary};
        transition: 1s;
    }
`;
const Home = styled(NavLink)`
    text-decoration: none;
    color: white;
    margin: 0px 10px;

    &:hover {
        color: ${themeVars.primary};
        transition: 1s;
    }
`;
const HomeH2 = styled.h1`
    margin: 10px 0px 0px 0px;
    padding: 0px 0px;
`;
const Page = styled.p`
    margin-bottom: 0px;
`;
const LogOut = styled.p`
    color: white;
    margin: 0px 10px;

    &:hover {
        color: red;
        transition: 1s;
        cursor: pointer;
    }
`;
