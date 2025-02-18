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
	CreatDeployDocumentPage,
	CreateCustomerPage,
	CreateDeploymentPage,
	CreateSoftwarePage,
	CreateSoftwareVersionPage,
	CustomerManagementPage,
	ErrorPage,
	ModifySoftwarePage,
	ModifySoftwareVersioPage,
	OverviewPage,
	SoftwarePage,
	SoftwareVersionDetailPage,
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
			<Route path="customer" element={<CustomerManagementPage />} />
			<Route path="/create-customer" element={<CreateCustomerPage />} />
			<Route path={RoutePaths.SOFTWARE} element={<SoftwarePage />} />
			<Route
				path={RoutePaths.CREATE_SOFTWARE}
				element={<CreateSoftwarePage />}
			/>
			<Route
				path={RoutePaths.MODIFY_SOFTWARE}
				element={<ModifySoftwarePage />}
			/>
			<Route
				path={RoutePaths.CREATE_SOFTWARE_VERSION}
				element={<CreateSoftwareVersionPage />}
			/>
			<Route
				path={RoutePaths.MODIFY_SOFTWARE_VERSION}
				element={<ModifySoftwareVersioPage />}
			/>
			<Route
				path={RoutePaths.SOFTWARE_VERSION_DETAIL}
				element={<SoftwareVersionDetailPage />}
			/>

			<Route path="/create-deployment" element={<CreateDeploymentPage />} />
			<Route path="test" element={<CreatDeployDocumentPage />} />
		</Route>,
	),
);

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<RouterProvider router={router} />
		</Provider>
	</StrictMode>,
);
