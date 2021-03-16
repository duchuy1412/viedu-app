import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  updateToPresentation,
  deleteFromPresentation,
} from "./../../util/APIUtils";
import { message } from "antd";

const initSlide = { current: {} };

export const updateSlide = createAsyncThunk(
  "slide/updateSlide",
  async (params, thunkAPI) => {
    await updateToPresentation(params.slide, params.id)
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
);

export const deleteOneSlide = createAsyncThunk(
  "slide/deleteOneSlide",
  async (params, thunkAPI) => {
    await deleteFromPresentation(params.slideId, params.id)
      .then((response) => {
        return Promise.resolve(response);
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  }
);

const slide = createSlice({
  name: "slide",
  initialState: initSlide,
  reducers: {
    currentSlide: (state, action) => {
      // console.log(action.payload);
      state.current = action.payload;
      // state.prev = action.payload;
    },
  },
  extraReducers: {
    [updateSlide.fulfilled]: (state, action) => {
      message.success("Saved");
    },
    [updateSlide.rejected]: (state, action) => {
      message.error("Error");
    },
    [deleteOneSlide.fulfilled]: (state, action) => {
      message.success("Deleted");
    },
    [deleteOneSlide.rejected]: (state, action) => {
      message.error("Error");
    },
  },
});

const { reducer, actions } = slide;
export const { currentSlide } = actions;
export default reducer;
