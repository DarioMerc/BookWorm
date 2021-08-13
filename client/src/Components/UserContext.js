import React, { createContext, useEffect, useState } from "react";

export const UserContext = createContext(null);

const UserContextProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [state, setState] = useState(""); //this is what i use to update the userContext after any action that modifies the db

    useEffect(() => {
        fetch(`/api/user/${localStorage.getItem("user")}`)
            .then((res) => res.json())
            .then((data) => {
                console.log(data.user);
                setUser(data.user);
            });
    }, [state]);

    return (
        <UserContext.Provider value={{ user, setUser, setState }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
