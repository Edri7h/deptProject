import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  isMember: false,
  memberDetails: [],
  team: null,
  pendingRequests: [],
  mentoredTeams: [],
  stats: null,
  isLoading: true,
  isAuthenticated: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.user = action.payload.user;
      state.isMember = action.payload.isMember || false;
      state.memberDetails = action.payload.memberDetails || [];
      state.team = action.payload.team || null;
      state.pendingRequests = action.payload.pendingRequests || [];
      state.mentoredTeams = action.payload.mentoredTeams || [];
      state.stats = action.payload.stats || null;
      state.isAuthenticated = true;
      
    },
    login: (state, action) => {
      state.isAuthenticated = true;
      state.user = action.payload,
        state.isLoading = false
    },

    logout: (state) => {
      state.user = null;
      state.isMember = false;
      state.memberDetails = [];
      state.team = null;
      state.pendingRequests = [];
      state.mentoredTeams = [];
      state.stats = null;
      state.isAuthenticated = false;
      state.isLoading = false
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    setTeamData: (state, action) => {
      state.team = action.payload;
      state.isMember = true;
      state.memberDetails = action.payload?.members || state.memberDetails;
    }
  },
});

export const { setUserData, logout, login, setTeamData, setLoading } = authSlice.actions;

export default authSlice.reducer;
