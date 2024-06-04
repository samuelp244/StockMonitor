import { createSlice } from "@reduxjs/toolkit";

interface AuthState {
  user: {
    userId: string | null;
    name: {
      first: string;
      last: string;
    } | null;
    role: "admin" | "user" | null;
    email: string | null;
  };
  accessToken: string | null;
}

const initialState: AuthState = {
  user: {
    name: null,
    role: null,
    email: null,
    userId: null,
  },
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAccessToken(state, action) {
      state.accessToken = action.payload.accessToken;
    },
    setUserData(state, action) {
      state.user.name = action.payload.user.name;
      state.user.role = action.payload.user.role;
      state.user.email = action.payload.user.email;
	  state.user.userId = action.payload.user.userId;
    },
    resetAuthSlice(state) {
      state = initialState;
    },
  },
});

export const { setAccessToken, setUserData, resetAuthSlice } =
  authSlice.actions;
export default authSlice.reducer;
