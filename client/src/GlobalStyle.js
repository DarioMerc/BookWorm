import { createGlobalStyle } from "styled-components";
import "typeface-roboto";

export const themeVars = {
    primary: "#D2B5C3",
    secondary: "#9A5377",
    tri: "#A9738E",
    four: "#E289B6",
    five: "#DF5D9F",
};

export default createGlobalStyle`
    *{
        font-family: 'roboto';
        box-sizing: border-box;
    }
    body{
        margin: 0;
        background-color: ${themeVars.primary};
        height: 100%;
    }
    html{
        height: 100%;
    }   


    .normal{
        font-weight: normal;
    }
    .bold{
        font-weight: bold;
    }
    .nomargin{
        margin: 0px;
    }
    .centertext{
        text-align:center
    }
    .heightspacer{
        height: 100%;
    }
    .widthspacer{
        width: 100%;
    }

        //SCROLLBAR
        ::-webkit-scrollbar{
        width: 15px;
        height: 15px;
    }
    ::-webkit-scrollbar-track{
        background-color: white;
        box-shadow: inset 0 0 10px 10px white;
        border: solid 3px transparent;
    }
    ::-webkit-scrollbar-thumb {
        box-shadow: inset 0 0 10px 10px ${themeVars.tri};
        border: solid 3px transparent;
    }   
    ::-webkit-scrollbar-thumb:hover {
        box-shadow: inset 0 0 10px 10px ${themeVars.secondary};
    }
`;
