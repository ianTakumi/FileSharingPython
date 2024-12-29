import { configureStore } from "@reduxjs/toolkit"; // Import Redux Toolkit
import userReducer from "./reducers/userRecuder"; // Import your reducer (e.g., user reducer)

const store = configureStore({
  reducer: {
    user: userReducer, // Add the userReducer to manage user state
  },
  // middleware: (getDefaultMiddleware) => getDefaultMiddleware(),  // Optional, you can add middleware here
});

export default store;
