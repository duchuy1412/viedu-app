import { createSlice } from "@reduxjs/toolkit";
import { message } from "antd";

const initGame = { current: {}, guests: [] };

const game = createSlice({
  name: "hostGame",
  initialState: initGame,
  reducers: {
    currentGame: (state, action) => {
      state.current = action.payload;
    },
    addGuest: (state, action) => {
      state.guests = [...state.guests, action.payload];
      // console.log(action.payload);
    },
  },
  extraReducers: {},
});

const { reducer, actions } = game;
export const { currentGame, addGuest } = actions;
export default reducer;
