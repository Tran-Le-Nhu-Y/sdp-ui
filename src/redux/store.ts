import { configureStore } from '@reduxjs/toolkit';
import documentLabelReducer from './slices/DocumentLabelSlice';
import fileReducer from './slices/FileSlice';
import productReducer from './slices/ProductSlice';
import productVersionReducer from './slices/ProductVersionSlice';
import deployDocumentReducer from './slices/DeployDocumentSlice';
import moduleReducer from './slices/ModuleSlice';
import instanceReducer from './slices/InstanceSlice';
import { documentLabelApi, productApi, productVersionApi } from '../services';

export const store = configureStore({
	reducer: {
		labels: documentLabelReducer,
		products: productReducer,
		productVersions: productVersionReducer,
		files: fileReducer,
		deployDocuments: deployDocumentReducer,
		modules: moduleReducer,
		instances: instanceReducer,
		[productApi.reducerPath]: productApi.reducer,
		[productVersionApi.reducerPath]: productVersionApi.reducer,
		[documentLabelApi.reducerPath]: documentLabelApi.reducer,
	},
	// Adding the api middleware enables caching, invalidation, polling,
	// and other useful features of `rtk-query`.
	middleware(getDefaultMiddleware) {
		return getDefaultMiddleware().concat(
			productApi.middleware,
			productVersionApi.middleware,
			documentLabelApi.middleware,
		);
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
