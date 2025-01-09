import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './i18n/i18n.ts';
import { BrowserRouter, Route, Routes } from 'react-router';
import RootLayout from './layouts/RootLayout.tsx';
import { ErrorPage, OverviewPage, Test } from './pages/index.tsx';
import HydrateFallback from './components/HydrateFallback.tsx';

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
						<Route path="test" element={<Test />} />
					</Route>
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>,
);
