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
	CreateDeploymentProcessPage,
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
	CreateModulePage,
	ModifyModulePage,
	CreateModuleVersionPage,
	ModuleVersionDetailPage,
	ModifyModuleVersionPage,
	TemplateCompleteDeploymentPage,
	TemplateSoftwareExpirationPage,
	CreateModuleDocumentPage,
	ModifyModuleDocumentPage,
	ModuleDocumentDetailPage,
	DeploymentPhaseTypePage,
	DeploymentProcessDetailPage,
	SetupDeploymentProcessPage,
	SetupDeploymentPhasePage,
} from './pages/index.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
import { RoutePaths } from './utils/index.ts';

const router = createBrowserRouter(
	createRoutesFromElements(
		<Route path="/" element={<App />} errorElement={<ErrorPage />}>
			<Route path={RoutePaths.NOTIFICATION} element={<OverviewPage />} />
			<Route path={RoutePaths.OVERVIEW} element={<OverviewPage />} />

			<Route path={RoutePaths.CUSTOMER} element={<CustomerManagementPage />} />

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
				path={RoutePaths.SOFTWARE_VERSION}
				element={<SoftwareVersionDetailPage />}
			/>
			<Route
				path={RoutePaths.MODIFY_SOFTWARE_VERSION}
				element={<ModifySoftwareVersionPage />}
			/>

			<Route path={RoutePaths.CREATE_MODULE} element={<CreateModulePage />} />
			<Route path={RoutePaths.MODIFY_MODULE} element={<ModifyModulePage />} />

			<Route
				path={RoutePaths.MODULE_VERSION}
				element={<ModuleVersionDetailPage />}
			/>
			<Route
				path={RoutePaths.CREATE_MODULE_VERSION}
				element={<CreateModuleVersionPage />}
			/>
			<Route
				path={RoutePaths.MODIFY_MODULE_VERSION}
				element={<ModifyModuleVersionPage />}
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

			<Route
				path={RoutePaths.CREATE_MODULE_DOCUMENT}
				element={<CreateModuleDocumentPage />}
			/>
			<Route
				path={RoutePaths.MODULE_DOCUMENT}
				element={<ModuleDocumentDetailPage />}
			/>
			<Route
				path={RoutePaths.MODIFY_MODULE_DOCUMENT}
				element={<ModifyModuleDocumentPage />}
			/>

			<Route path={RoutePaths.DOCUMENT_TYPE} element={<DocumentTypePage />} />

			<Route
				path={RoutePaths.DEPLOYMENT_PROCESS}
				element={<DeploymentProcessPage />}
			/>
			<Route
				path={RoutePaths.SETUP_DEPLOYMENT_PROCESS}
				element={<SetupDeploymentProcessPage />}
			/>
			<Route
				path={RoutePaths.DEPLOYMENT_PROCESS_DETAIL}
				element={<DeploymentProcessDetailPage />}
			/>
			<Route
				path={RoutePaths.CREATE_DEPLOYMENT_PROCESS}
				element={<CreateDeploymentProcessPage />}
			/>

			<Route
				path={RoutePaths.DEPLOYMENT_PHASE_TYPE}
				element={<DeploymentPhaseTypePage />}
			/>
			<Route
				path={RoutePaths.SETUP_DEPLOYMENT_PHASE}
				element={<SetupDeploymentPhasePage />}
			/>

			<Route
				path={RoutePaths.TEMPLATE_SOFTWARE_EXPIRATION}
				element={<TemplateSoftwareExpirationPage />}
			/>
			<Route
				path={RoutePaths.TEMPLATE_COMPLETE_DEPLOYMENT}
				element={<TemplateCompleteDeploymentPage />}
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
