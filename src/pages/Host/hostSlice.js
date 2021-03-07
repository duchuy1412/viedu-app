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
    addGuest: (state, action) => {
      state.current.guests = [...state.current.guests, action.payload];
    },
  },
  extraReducers: {},
});

const { reducer, actions } = game;
export const { currentGame, addGuest } = actions;
export default reducer;
