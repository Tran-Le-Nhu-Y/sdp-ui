import { configureStore } from '@reduxjs/toolkit';
import documentLabelReducer from './slices/DocumentLabelSlice';
import productReducer from './slices/ProductSlice';

export const store = configureStore({
	reducer: {
		labels: documentLabelReducer,
		products: productReducer,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
