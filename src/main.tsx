import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n/i18n.ts';
import {
	createBrowserRouter,
	createRoutesFromElements,
	Route,
	RouterProvider,
} from 'react-router-dom';
import {
	CreateSoftwarePage,
	ErrorPage,
	ModifySoftwarePage,
	OverviewPage,
	SoftwarePage,
} from './pages/index.tsx';
import HydrateFallback from './components/HydrateFallback.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import { RoutePaths } from './utils/index.ts';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route
			path="/"
			element={<App />}
			errorElement={<ErrorPage />}
			hydrateFallbackElement={<HydrateFallback />}
		>
			<Route path={RoutePaths.OVERVIEW} element={<OverviewPage />} />
			<Route path={RoutePaths.SOFTWARE} element={<SoftwarePage />} />
			<Route
				path={RoutePaths.CREATE_SOFTWARE}
				element={<CreateSoftwarePage />}
			/>
			<Route
				path={RoutePaths.MODIFY_SOFTWARE}
				element={<ModifySoftwarePage />}
			/>
		</Route>
	)
);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</StrictMode>
);
