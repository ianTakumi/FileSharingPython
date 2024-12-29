const initialState = {
  user: null,
  loggedIn: false,
};

const userReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_USER":
      return {
        ...state,
        user: action.payload.user,
        loggedIn: action.payload.loggedIn,
      };
    case "CLEAR_USER":
      return {
        ...state,
        user: null,
        loggedIn: false,
      };
    default:
      return state;
  }
};

export default userReducer;
