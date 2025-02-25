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
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useTranslation } from 'react-i18next';
import theme from './themes/theme';
import { DashboardLayout, PageContainer } from '@toolpad/core';
import { PathHolders } from './utils';

function App() {
	const { t } = useTranslation();

	return (
		<AppProvider
			theme={theme}
			// branding={{
			// 	logo: <img src="https://mui.com/static/logo.png" alt="MUI logo" />,
			// 	title: 'MUI',
			// 	homeUrl: '/toolpad/core/introduction',
			// }}

			navigation={[
				{
					segment: 'notification',
					title: t('notification'),
					icon: <NotificationsActiveIcon />,
				},
				{
					segment: 'overview',
					title: t('overview'),
					icon: <DashboardIcon />,
				},
				{
					segment: 'customer',
					title: t('customer'),
					icon: <Diversity1Icon />,
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
					segment: 'mail-template',
					title: t('createMailTemplate'),
					icon: <ContactMailIcon />,
					children: [
						{
							segment: 'software-expiration',
							title: t('softwareExpiration'),
							icon: <AssignmentLateIcon />,
							pattern: `software-expiration{/:${PathHolders.TEMPLATE_SOFTWARE_EXPIRATION_ID}}*`,
						},
						{
							segment: 'complete-deployment',
							title: t('completeDeployment'),
							icon: <AssignmentTurnedInIcon />,
							pattern: `complete-deployment{/:${PathHolders.TEMPLATE_COMPLETE_DEPLOYMENT_ID}}*`,
						},
					],
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
