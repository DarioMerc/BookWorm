import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { SearchResult } from "./SearchResult";
import { Loading } from "./Loading";
import { themeVars } from "../GlobalStyle";

export const Search = () => {
    //SEARCH
    const [search, setSearch] = useState("");
    const [searchStatus, setSearchStatus] = useState("initial");
    const [searchResults, setSearchResults] = useState([]);
    const [resultCount, setResultCount] = useState(0);

    //PAGINATION
    const [startIndex, setStartIndex] = useState(0);
    const [page, setPage] = useState(1);

    //API CAll - There is a delay setup so that a call doesn't get triggered for each letter.
    useEffect(() => {
        const delay = setTimeout(() => {
            if (search.trim() !== "") {
                setSearchStatus("loading");
                fetch(`/api/books/search/${search}/${startIndex}`)
                    .then((res) => res.json())
                    .then((data) => {
                        console.log(data.data.items);
                        setSearchResults(data.data.items);
                        setResultCount(data.data.totalItems);
                        setSearchStatus("idle");
                    });
            }
        }, 500);

        return () => clearTimeout(delay);
    }, [search, startIndex]);

    useEffect(() => {
        setStartIndex(0);
        setPage(1);
    }, [search]);

    return (
        <Wrapper>
            <SearchBar
                onChange={(e) => {
                    setSearch(e.target.value);
                }}
                placeholder="Search"
            />
            {searchStatus === "loading" ? (
                <Loading />
            ) : !searchResults ? (
                <p style={{ margin: "auto" }}>No Results</p>
            ) : (
                <ResultsWrapper>
                    {searchStatus === "idle" && (
                        <Pagination>
                            <button
                                disabled={page === 1}
                                onClick={() => {
                                    setPage(page - 1);
                                    setStartIndex(startIndex - 10);
                                }}
                            >
                                Previous
                            </button>
                            <div style={{ display: "block" }}>
                                <p class="nomargin">Page {page}</p>
                                <p class="nomargin">{resultCount} results</p>
                            </div>
                            <button
                                onClick={() => {
                                    setPage(page + 1);
                                    setStartIndex(startIndex + 10);
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
const SearchBar = styled.input`
    margin: 10px;
    width: 80%;
    align-self: center;
    height: 30px;
    border-style: none;
    border: 2px solid black;
    padding: 5px;
`;
const ResultsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const Pagination = styled.div`
    display: flex;
    justify-content: space-evenly;
    align-items: center;
    width: 30%;
`;
