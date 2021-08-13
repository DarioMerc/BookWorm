import React, { useContext, useEffect, useState } from "react";
import styled from "styled-components";
import { SearchResult } from "./SearchResult";
import { Loading } from "./Loading";
import { themeVars } from "../GlobalStyle";
import { UserContext } from "./UserContext";
import { useParams } from "react-router";

export const SubjectSearch = () => {
    const [searchStatus, setSearchStatus] = useState("loading");
    const [searchResults, setSearchResults] = useState([]);
    let query = useParams().query;

    //pagination
    const [startIndex, setStartIndex] = useState(0);
    const [page, setPage] = useState(1);

    useEffect(() => {
        setSearchStatus("loading");
        fetch(`/api/books/subjectsearch`, {
            method: "POST",
            headers: {
                "Content-type": "application/json",
            },
            body: JSON.stringify({ search_query: query, startIndex }),
        })
            .then((res) => res.json())
            .then((data) => {
                setSearchResults(data.data.items);
                setSearchStatus("idle");
            });
    }, [startIndex]);

    return (
        <Wrapper>
            <h2 style={{ textAlign: "center" }}>
                More Books on{" "}
                <span style={{ color: `${themeVars.secondary}` }}>
                    "{query}"
                </span>
            </h2>
            <BlackLine />
            {searchStatus === "loading" ? (
                <Loading />
            ) : !searchResults ? (
                <p style={{ margin: "auto" }}>No Results</p>
            ) : (
                <ResultsWrapper>
                    {searchStatus === "idle" && (
                        <Pagination>
                            <button
                                disabled={page == 1}
                                onClick={() => {
                                    setPage(page - 1);
                                    setStartIndex(startIndex - 20);
                                }}
                            >
                                Previous
                            </button>
                            <p class="nomargin">Page {page}</p>
                            <button
                                onClick={() => {
                                    setPage(page + 1);
                                    setStartIndex(startIndex + 20);
                                }}
                            >
                                Next
                            </button>
                        </Pagination>
                    )}
                    {searchResults.map((result, k) => {
                        return <SearchResult result={result} key={k} />;
                    })}
                </ResultsWrapper>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    margin: 0px auto;
    width: 80%;
    height: 100%;
    background-color: ${themeVars.primary};
`;
const ResultsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;
const BlackLine = styled.hr`
    margin: 10px auto;
    background-color: black;
    border: none;
    height: 2px;
    width: 80%;
`;
const Pagination = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 30%;
`;
