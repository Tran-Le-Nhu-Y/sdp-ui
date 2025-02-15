import { configureStore } from '@reduxjs/toolkit';
import { documentLabelApi, softwareApi, productVersionApi } from '../services';

export const store = configureStore({
	reducer: {
		[softwareApi.reducerPath]: softwareApi.reducer,
		[productVersionApi.reducerPath]: productVersionApi.reducer,
		[documentLabelApi.reducerPath]: documentLabelApi.reducer,
	},
	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
	middleware(getDefaultMiddleware) {
		return getDefaultMiddleware().concat(
			softwareApi.middleware,
			productVersionApi.middleware,
			documentLabelApi.middleware
		);
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
