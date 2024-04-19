import { configureStore } from "@reduxjs/toolkit";
import nodeSlice from "./features/nodeSlice";
const store = configureStore({
	reducer: { 
        node: nodeSlice
     },
});
export default store;