import { configureStore } from "@reduxjs/toolkit";
import slideReducer from "./../pages/presentation/slideSlice";
import gameReducer from "pages/Host/hostSlice";

const store = configureStore({
  reducer: { slides: slideReducer, games: gameReducer },
});

export default store;
