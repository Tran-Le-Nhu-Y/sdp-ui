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
	CreateCustomerPage,
	CreateDeploymentPage,
	CreateSoftwareDocumentPage,
	CreateSoftwarePage,
	CreateSoftwareVersionPage,
	CustomerManagementPage,
	DocumentTypePage,
	DeploymentProcessPage,
	ErrorPage,
	ModifySoftwareDocumentPage,
	ModifySoftwarePage,
	ModifySoftwareVersionPage,
	OverviewPage,
	SoftwareDocumentDetailPage,
	SoftwarePage,
	SoftwareVersionDetailPage,
} from './pages/index.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import { RoutePaths } from './utils/index.ts';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />} errorElement={<ErrorPage />}>
			<Route path={RoutePaths.OVERVIEW} element={<OverviewPage />} />

			<Route
				path={RoutePaths.CREATE_CUSTOMER}
				element={<CreateCustomerPage />}
			/>
			<Route path={RoutePaths.CUSTOMER} element={<CustomerManagementPage />} />

			<Route
				path={RoutePaths.CREATE_SOFTWARE}
				element={<CreateSoftwarePage />}
			/>
			<Route path={RoutePaths.SOFTWARE} element={<SoftwarePage />} />
			<Route
				path={RoutePaths.MODIFY_SOFTWARE}
				element={<ModifySoftwarePage />}
			/>

			<Route
				path={RoutePaths.CREATE_SOFTWARE_VERSION}
				element={<CreateSoftwareVersionPage />}
			/>
			<Route
				path={RoutePaths.SOFTWARE_VERSION}
				element={<SoftwareVersionDetailPage />}
			/>
			<Route
				path={RoutePaths.MODIFY_SOFTWARE_VERSION}
				element={<ModifySoftwareVersionPage />}
			/>

			<Route
				path={RoutePaths.CREATE_SOFTWARE_DOCUMENT}
				element={<CreateSoftwareDocumentPage />}
			/>
			<Route
				path={RoutePaths.SOFTWARE_DOCUMENT}
				element={<SoftwareDocumentDetailPage />}
			/>
			<Route
				path={RoutePaths.MODIFY_SOFTWARE_DOCUMENT}
				element={<ModifySoftwareDocumentPage />}
			/>

			<Route path={RoutePaths.DOCUMENT_TYPE} element={<DocumentTypePage />} />

			<Route
				path={RoutePaths.DEPLOYMENT_PROCESS}
				element={<DeploymentProcessPage />}
			/>
			<Route
				path={RoutePaths.CREATE_DEPLOYMENT_PROCESS}
				element={<CreateDeploymentPage />}
			/>

			<Route
				path={RoutePaths.DEPLOYMENT_PHASE_TYPE}
				element={<DeploymentProcessPage />}
			/>
			<Route
				path={RoutePaths.CREATE_DEPLOYMENT_PHASE_TYPE}
				element={<CreateDeploymentPage />}
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
