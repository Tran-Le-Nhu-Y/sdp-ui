import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n/i18n.ts';
import { BrowserRouter, Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout.tsx';
import { ErrorPage, OverviewPage, Test } from './pages/index.tsx';
import HydrateFallback from './components/HydrateFallback.tsx';
import ProductManagementPage from './pages/product/index.tsx';
import DeployManagementPage from './pages/deploy/index.tsx';
import DocumentLabelPage from './pages/documentlabel/index.tsx';
import DesignDocumentPage from './pages/designdocument/index.tsx';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
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
						<Route path="deploy" element={<DeployManagementPage />} />
						<Route path="document">
							<Route path="label" element={<DocumentLabelPage />} />
							<Route path="design" element={<DesignDocumentPage />} />
						</Route>
						<Route path="test" element={<Test />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
