import React from "react";
import styled from "styled-components";

import { FiLoader } from "react-icons/fi";
import { themeVars } from "../GlobalStyle";

export const Loading = () => {
    return (
        <Wrapper>
            <Spinner />
        </Wrapper>
    );
};

const Wrapper = styled.div`
    width: auto;
    height: auto;
    margin: auto;
    /* background-color: ${themeVars.primary}; */
`;

const Spinner = styled(FiLoader)`
    height: 100px;
    width: 100px;
    margin: auto;
    animation: App-logo-spin infinite 5s linear;

    @keyframes App-logo-spin {
        from {
            transform: rotate(0deg);
        }
        to {
            transform: rotate(360deg);
        }
    }
`;
