import { configureStore } from "@reduxjs/toolkit";
import slideReducer from "./../pages/presentation/slideSlice";

const store = configureStore({
  reducer: { slides: slideReducer },
});

export default store;
