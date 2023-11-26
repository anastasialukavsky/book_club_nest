import React, { useEffect, useState } from 'react';

export interface IGlobalContextProps {
  user: any;
  loading: boolean;
  setUser: (user: any) => void;
  setLoading: (loading: boolean) => void;
}

export const AuthContext = React.createContext<IGlobalContextProps>({
  user: {},
  loading: true,
  setUser: () => {},
  setLoading: () => {},
});

export const AuthContextProvider = ({ props }: any) => {
  const [user, setUser] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  //check if the user is logged in checl headers
  //if headers user is logged in
  // const login = async (credentials: any) => {
  //   try {
  //     const response = await fetch('your-backend-login-api-endpoint', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(credentials),
  //     });

  //     if (response.ok) {
  //       const data = await response.json();
  //       setUser(data.user);
  //       // Set access token or perform other actions
  //     } else {
  //       // Handle login failure, e.g., display error message
  //     }
  //   } catch (error) {
  //     console.error('Error during login', error);
  //     // Handle error, e.g., display generic error message
  //   }
  // };

  // useEffect(() => {
  //   login();
  // }, []);
  console.log('user', user);

  return (
    <AuthContext.Provider
      value={{
        user: user,
        loading: isLoading,
        setUser: setUser,
        setLoading: setIsLoading,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
