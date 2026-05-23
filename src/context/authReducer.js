export const initialState = {
  user: null,
  isLoading: true,
  error: "",
};

export const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_USER":
      return { ...state, user: action.payload, isLoading: false, error: "" };
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "LOGOUT":
      return { ...state, user: null, isLoading: false, error: "" };
    default:
      return state;
  }
};
