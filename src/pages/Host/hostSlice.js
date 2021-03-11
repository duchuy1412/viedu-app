import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initGame = { current: {} };

const game = createSlice({
  name: "hostGame",
  initialState: initGame,
  reducers: {
    currentGame: (state, action) => {
      state.current = action.payload;
    },
  },
  extraReducers: {},
});

const { reducer, actions } = game;
export const { currentGame } = actions;
export default reducer;
