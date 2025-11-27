import React, { createContext, useContext, useEffect, useState } from 'react'

export const UserContext = createContext({});

export const useUserStore = () => useContext(UserContext);

const UserStore = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Otomatik giriş - mock user oluştur
        const mockUser = {
            id: "1",
            name: "Admin",
            email: "admin@example.com",
            phoneNumber: "0532 123 45 67",
            isAdmin: true,
            isModerator: false,
            userType: "ADMIN"
        };
        
        setUser(mockUser);
        setLoading(false);
    }, []);

    const value = {
        user,
        setUser
    }

    if (loading) {
        return <div className='flex items-center w-screen h-screen justify-center'>
            <h1 className='text-2xl font-bold'>GustoApp Admin Panel</h1>
        </div>;
    }

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}

export default UserStore