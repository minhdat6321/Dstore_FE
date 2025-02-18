import { createContext, useEffect, useReducer } from "react";
import apiService from "../app/apiService";
import { isValidToken } from "../utils/jwt";
import { useSelector } from "react-redux";

const initialState = {
  isInitialized: false,
  isAuthenticated: false,
  user: null,
};

const INITIALIZE = "AUTH.INITIALIZE";
const LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS";
const REGISTER_SUCCESS = "AUTH.REGISTER_SUCCESS";
const LOGOUT = "AUTH.LOGOUT";
const UPDATE_PROFILE = "AUTH.UPDATE_PROFILE";

const reducer = (state, action) => {
  switch (action.type) {
    case INITIALIZE:
      const { isAuthenticated, user } = action.payload;
      return {
        ...state,
        isInitialized: true,
        isAuthenticated,
        user,
      };
    case LOGIN_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };

    case REGISTER_SUCCESS:
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
      };
    case LOGOUT:
      return {
        ...state,
        isAuthenticated: false,
        user: null,
      };
    case UPDATE_PROFILE:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.payload, // Only updates the fields provided in action.payload
        },
      }

    default:
      return state;
  }
};


const AuthContext = createContext({ ...initialState });

// SAVE accessToken
const setSession = (accessToken) => {
  if (accessToken) {
    window.localStorage.setItem("accessToken", accessToken);
    apiService.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
  } else {
    window.localStorage.removeItem("accessToken");
    delete apiService.defaults.headers.common.Authorization;
  }
};

function AuthProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  // const updatedProfile = useSelector((state) => state.user.updatedProfile);

  // Save accessToken and user in Local Storage
  useEffect(() => {
    const initialize = async () => {
      try {
        const accessToken = window.localStorage.getItem("accessToken");

        if (accessToken && isValidToken(accessToken)) {
          setSession(accessToken);

          const response = await apiService.get("/users/me");
          const user = response.data.data;

          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: true, user },
          });
        } else {
          setSession(null);

          dispatch({
            type: INITIALIZE,
            payload: { isAuthenticated: false, user: null },
          });
        }
      } catch (err) {
        console.error(err);

        setSession(null);
        dispatch({
          type: INITIALIZE,
          payload: {
            isAuthenticated: false,
            user: null,
          },
        });
      }
    };

    initialize();
  }, []);

  // Update Profile when it has a change
  // useEffect(() => {
  //   if (updatedProfile)
  //     dispatch({ type: UPDATE_PROFILE, payload: updatedProfile });
  // }, [updatedProfile]);



  const login = async ({ email, password }, callback) => {
    const response = await apiService.post("/auth/login", { email, password });
    const { user, accessToken } = response.data.data;

    setSession(accessToken);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: { user },
    });

    if (callback) callback();

    return user // Return user object with purpose is Check the role to navigate the link
  };

  const register = async ({ firstName, lastName, phone, email, password }, callback) => {
    const response = await apiService.post("/users", { firstName, lastName, phone, email, password });
    const { user, accessToken } = response.data;

    setSession(accessToken);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: { user },
    });

    callback();
  };

  const logout = (callback) => {
    setSession(null)
    dispatch({ type: LOGOUT })
    callback()
  }

  return (
    <AuthContext.Provider
      value={{ ...state, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };

// import { createContext, useEffect, useReducer } from "react";
// import apiService from "../app/apiService";
// import { isValidToken } from "../utils/jwt";
// import { useSelector } from "react-redux";

// const initialState = {
//   isInitialized: false,
//   isAuthenticated: false,
//   user: null,
// };

// const INITIALIZE = "AUTH.INITIALIZE";
// const LOGIN_SUCCESS = "AUTH.LOGIN_SUCCESS";
// const REGISTER_SUCCESS = "AUTH.REGISTER_SUCCESS";
// const LOGOUT = "AUTH.LOGOUT";
// const UPDATE_PROFILE = "AUTH.UPDATE_PROFILE";

// const reducer = (state, action) => {
//   switch (action.type) {
//     case INITIALIZE:
//       const { isAuthenticated, user } = action.payload;
//       return {
//         ...state,
//         isInitialized: true,
//         isAuthenticated,
//         user,
//       };
//     case LOGIN_SUCCESS:
//       return {
//         ...state,
//         isAuthenticated: true,
//         user: action.payload.user,
//       };
//     case REGISTER_SUCCESS:
//       return {
//         ...state,
//         isAuthenticated: true,
//         user: action.payload.user,
//       };
//     case LOGOUT:
//       return {
//         ...state,
//         isAuthenticated: false,
//         user: null,
//       };

//     case UPDATE_PROFILE:
//       const {
//         firstName,
//         lastName,
//         email,
//         phone,

//         password,

//         avatarUrl,
//         coverUrl,

//         city,
//         country,
//         state,
//         zipCode,
//         address,
//       } = action.payload;
//       return {
//         ...state,
//         user: {
//           ...state.user,
//           firstName,
//           lastName,
//           email,
//           phone,

//           password,

//           avatarUrl,
//           coverUrl,

//           city,
//           country,
//           state,
//           zipCode,
//           address,
//         },
//       };

//     default:
//       return state;
//   }
// };

// const setSession = (accessToken) => {
//   if (accessToken) {
//     window.localStorage.setItem("accessToken", accessToken);
//     apiService.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
//   } else {
//     window.localStorage.removeItem("accessToken");
//     delete apiService.defaults.headers.common['Authorization'];
//   }
// };
// const AuthContext = createContext({ ...initialState });

// function AuthProvider({ children }) {
//   const [state, dispatch] = useReducer(reducer, initialState);
//   const updatedProfile = useSelector((state) => state.user.updatedProfile);

//   useEffect(() => {
//     const initialize = async () => {
//       try {
//         const accessToken = window.localStorage.getItem("accessToken");

//         if (accessToken && isValidToken(accessToken)) {
//           setSession(accessToken);

//           const response = await apiService.get("/users/me");
//           const user = response.data.data;

//           dispatch({
//             type: INITIALIZE,
//             payload: { isAuthenticated: true, user },
//           });
//         } else {
//           setSession(null);

//           dispatch({
//             type: INITIALIZE,
//             payload: { isAuthenticated: false, user: null },
//           });
//         }
//       } catch (err) {
//         console.error(err);

//         setSession(null);
//         dispatch({
//           type: INITIALIZE,
//           payload: {
//             isAuthenticated: false,
//             user: null,
//           },
//         });
//       }
//     };

//     initialize();
//   }, []);



//   const login = async ({ email, password }, callback) => {
//     const response = await apiService.post("/auth/login", { email, password });
//     const { user, accessToken } = response.data.data;

//     setSession(accessToken);
//     dispatch({
//       type: LOGIN_SUCCESS,
//       payload: { user },
//     });

//     callback();
//   };


//   const register = async ({ firstName, lastName, phone, email, password }, callback) => {
//     const response = await apiService.post("/users", { firstName, lastName, phone, email, password });
//     const { user, accessToken } = response.data;

//     setSession(accessToken);
//     dispatch({
//       type: REGISTER_SUCCESS,
//       payload: { user },
//     });

//     callback();
//   };

//   const logout = (callback) => {
//     setSession(null)
//     dispatch({ type: LOGOUT })
//     callback()
//   }

//   const updatedProfile = useSelector((state) => state.user.updatedProfile);

//   useEffect(() => {
//     if (updatedProfile)
//       dispatch({ type: UPDATE_PROFILE, payload: updatedProfile });
//   }, [updatedProfile]);


//   return (
//     <AuthContext.Provider
//       value={{ ...state, login, register, logout }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export { AuthContext, AuthProvider };   