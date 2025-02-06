import { configureStore } from '@reduxjs/toolkit';
import documentLabelReducer from './slices/DocumentLabelSlice';
import fileReducer from './slices/FileSlice';
import productVersionReducer from './slices/ProductVersionSlice';
import { productApi } from '../services';

export const store = configureStore({
	reducer: {
		labels: documentLabelReducer,
		[productApi.reducerPath]: productApi.reducer,
		files: fileReducer,
		productVersions: productVersionReducer,
	},
	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
	middleware(getDefaultMiddleware) {
		return getDefaultMiddleware().concat(productApi.middleware);
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
