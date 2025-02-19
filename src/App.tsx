import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import { AppProvider } from '@toolpad/core/react-router-dom';
import { Outlet } from 'react-router';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import LogoutIcon from '@mui/icons-material/Logout';
import DnsIcon from '@mui/icons-material/Dns';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LabelIcon from '@mui/icons-material/Label';
import { useTranslation } from 'react-i18next';
import theme from './themes/theme';
import { DashboardLayout, PageContainer, Session } from '@toolpad/core';
import { PathHolders } from './utils';
import { useEffect, useState } from 'react';
import keycloak from './services/keycloak';
import { HydrateFallback } from './components';

function App() {
	const { t } = useTranslation();
	const [session, setSession] = useState<Session>();

	const login = async () => {
		const retrieveSession = async () => {
			const { id, email, firstName, lastName } =
				await keycloak.loadUserProfile();

			const session: Session = {
				user: {
					id: id,
					name: `${lastName} ${firstName}`,
					email: email,
				},
			};
			return session;
		};

		if (keycloak.didInitialize) return await retrieveSession();

		const authenticated = await keycloak.init({ onLoad: 'login-required' });
		if (!authenticated) return null;

		return await retrieveSession();
	};

	useEffect(() => {
		login()
			.then((session) => {
				if (session) setSession(session);
			})
			.catch((error) => {
				console.error(error);
			});
	}, []);

	if (!session) return <HydrateFallback />;

	return (
		<AppProvider
			theme={theme}
			session={session}
			// branding={{
			// 	logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
			// 	title: 'MUI',
			// 	homeUrl: '/toolpad/core/introduction',
			// }}

			navigation={[
				{
					segment: 'overview',
					title: t('overview'),
					icon: <DashboardIcon />,
				},
				{
					segment: 'customer',
					title: t('customer'),
					icon: <Diversity1Icon />,
					pattern: `customer{/:${PathHolders.CUSTOMER_ID}}*`,
				},
				{
					segment: 'software',
					title: t('software'),
					icon: <WysiwygIcon />,
					pattern: `software{/:${PathHolders.SOFTWARE_ID}}*`,
				},
				{
					segment: 'deployment',
					title: t('deployment'),
					icon: <DnsIcon />,
					children: [
						{
							segment: 'process',
							title: t('deploymentProcess'),
							icon: <DnsIcon />,
							pattern: `process{/:${PathHolders.DEPLOYMENT_PROCESS_ID}}*`,
						},
						{
							segment: 'phase-type',
							title: t('deploymentPhaseType'),
							icon: <LabelIcon />,
							pattern: `phase-type{/:${PathHolders.DEPLOYMENT_PHASE_TYPE_ID}}*`,
						},
					],
				},
				{
					segment: 'document-type',
					title: t('documentType'),
					icon: <LabelIcon />,
				},
				{
					segment: 'logout',
					title: t('logOut'),
					icon: <LogoutIcon />,
				},
			]}
		>
			<DashboardLayout>
				<PageContainer>
					<Outlet />
				</PageContainer>
			</DashboardLayout>
		</AppProvider>
	);
}

export default App;
