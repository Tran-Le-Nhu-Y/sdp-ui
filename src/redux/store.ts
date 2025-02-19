import { configureStore } from '@reduxjs/toolkit';
import {
	softwareApi,
	softwareDocumentApi,
	softwareVersionApi,
	documentTypeApi,
	customerApi,
	deploymentPhaseApi,
	deploymentPhaseTypeApi,
	deploymentProcessApi,
} from '../services';

export const store = configureStore({
	reducer: {
		[softwareApi.reducerPath]: softwareApi.reducer,
		[softwareVersionApi.reducerPath]: softwareVersionApi.reducer,
		[documentTypeApi.reducerPath]: documentTypeApi.reducer,
		[softwareDocumentApi.reducerPath]: softwareDocumentApi.reducer,
		[deploymentProcessApi.reducerPath]: deploymentProcessApi.reducer,
		[customerApi.reducerPath]: customerApi.reducer,
		[deploymentPhaseApi.reducerPath]: deploymentPhaseApi.reducer,
		[deploymentPhaseTypeApi.reducerPath]: deploymentPhaseTypeApi.reducer,
	},
	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
	middleware(getDefaultMiddleware) {
		return getDefaultMiddleware().concat(
			softwareApi.middleware,
			softwareVersionApi.middleware,
			documentTypeApi.middleware,
			softwareDocumentApi.middleware,
			deploymentProcessApi.middleware,
			customerApi.middleware,
			deploymentPhaseApi.middleware,
			deploymentPhaseTypeApi.middleware
		);
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
