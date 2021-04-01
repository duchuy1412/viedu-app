import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { message } from "antd";
import { updateGame } from "util/APIUtils";

const initGame = { current: {} };

export const updateGameStatus = createAsyncThunk(
  "game/updateGame",
  async (params, { getState }) => {
    await updateGame({
      ...getState().games.current,
      gameStatus: params.gameStatus,
    })
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
);

const game = createSlice({
  name: "hostGame",
  initialState: initGame,
  reducers: {
    currentGame: (state, action) => {
      state.current = action.payload;
    },
  },
  extraReducers: {
    [updateGameStatus.fulfilled]: (state, action) => {
      message.success("Updated");
    },
    [updateGameStatus.rejected]: (state, action) => {
      message.error("Error");
    },
  },
});

const { reducer, actions } = game;
export const { currentGame } = actions;
export default reducer;
