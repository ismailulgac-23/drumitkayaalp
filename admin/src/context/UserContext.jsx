import React, { createContext, useContext, useState } from 'react'

export const UserContext = createContext({});

export const useUserStore = () => useContext(UserContext);

const UserStore = ({ children }) => {
    const [user, setUser] = useState(null);

    const value = {
        user,
        setUser
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserStore
