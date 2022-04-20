import React, { useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import styled from "styled-components";
import { Header } from "./Components/Header";
import { Homepage } from "./Components/Homepage";
import { Login } from "./Components/Login";
import { Profile } from "./Components/Profile";
import { Register } from "./Components/Register";
import { Search } from "./Components/Search";
import { Book } from "./Components/Book";
import { ReviewPage } from "./Components/ReviewPage";
import { UserContext } from "./Components/UserContext";
import GlobalStyle from "./GlobalStyle";
import { Community } from "./Components/Community";
import { SubjectSearch } from "./Components/SubjectSearch";

const App = () => {
    const { user } = useContext(UserContext);

    return (
        <BrowserRouter>
            <GlobalStyle />
            <Wrapper>
                {user && <Header />}
                <Switch>
                    <Route exact path="/">
                        {user ? <Homepage /> : <Login />}
                    </Route>
                    <Route path="/profile/:_id">
                        {user ? <Profile /> : <Login />}
                    </Route>
                    <Route path="/login">
                        <Login />
                    </Route>
                    <Route path="/register">
                        <Register />
                    </Route>
                    <Route path="/search">
                        {user ? <Search /> : <Login />}
                    </Route>
                    <Route path="/community">
                        {user ? <Community /> : <Login />}
                    </Route>
                    <Route path="/book/:id">
                        {user ? <Book /> : <Login />}
                    </Route>
                    <Route path="/review/:id">
                        {user ? <ReviewPage /> : <Login />}
                    </Route>
                    <Route path="/subjectsearch/:query*">
                        {user ? <SubjectSearch /> : <Login />}
                    </Route>
                </Switch>
            </Wrapper>
        </BrowserRouter>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    height: 100%;
    margin: auto;
`;
export default App;
