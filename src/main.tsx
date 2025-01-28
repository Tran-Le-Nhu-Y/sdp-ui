import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n/i18n.ts';
import { BrowserRouter, Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout.tsx';
import {
	CreatDeployDocumentPage,
	CreateProductPage,
	CreateVersionProductPage,
	CreatModuleDesignDocumentPage,
	CreatProductDesignDocumentPage,
	DeployManagementPage,
	DocumentLabelPage,
	ErrorPage,
	ModifyProductPage,
	ModuleDesignDocumentPage,
	OverviewPage,
	ProductDesignDocumentPage,
	ProductManagementPage,
} from './pages/index.tsx';
import HydrateFallback from './components/HydrateFallback.tsx';
import { Provider } from 'react-redux';
import { store } from './redux/store.ts';
//import CreateModifyVersionForm from './components/CreateModifyVersionForm.tsx';
import ExamplePage from './pages/test/index.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={<App />}>
						<Route
							element={<RootLayout />}
							errorElement={<ErrorPage />}
							hydrateFallbackElement={<HydrateFallback />}
						>
							<Route path="overview" element={<OverviewPage />} />
							<Route path="product" element={<ProductManagementPage />} />
							<Route path="/create-product" element={<CreateProductPage />} />
							<Route
								path="/create-version-product"
								element={<CreateVersionProductPage />}
							/>
							<Route
								path="/modify-product/:id"
								element={<ModifyProductPage />}
							/>
							<Route path="deploy" element={<DeployManagementPage />} />
							<Route
								path="/create-deploy-document"
								element={<CreatDeployDocumentPage />}
							/>
							<Route path="document">
								<Route path="label" element={<DocumentLabelPage />} />
								<Route
									path="product-design"
									element={<ProductDesignDocumentPage />}
								/>

								<Route
									path="module-design"
									element={<ModuleDesignDocumentPage />}
								/>
							</Route>
							<Route
								path="/create-product-design-document"
								element={<CreatProductDesignDocumentPage />}
							/>
							<Route
								path="/create-module-design-document"
								element={<CreatModuleDesignDocumentPage />}
							/>
							{/* <Route
								path="test"
								element={
									<CreateModifyVersionForm
										label="hahaha"
										title="ssss"
										onSubmit={() => App}
										onCancel={App}
									/>
								}
							/> */}
							<Route path="test" element={<ExamplePage />} />
						</Route>
					</Route>
				</Routes>
			</BrowserRouter>
		</Provider>
	</StrictMode>,
);
