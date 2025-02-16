import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { AppProvider } from '@toolpad/core/react-router-dom';
import { Outlet } from 'react-router';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import LogoutIcon from '@mui/icons-material/Logout';
import DnsIcon from '@mui/icons-material/Dns';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TopicIcon from '@mui/icons-material/Topic';
import LabelIcon from '@mui/icons-material/Label';
import TypeSpecimenIcon from '@mui/icons-material/TypeSpecimen';
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
					segment: 'deploy',
					title: t('deploy'),
					icon: <DnsIcon />,
					pattern: `deploy{/:${PathHolders.DEPLOY_PROCESS_ID}}*`,
				},
				{
					segment: 'document',
					title: t('document'),
					icon: <TopicIcon />,
					children: [
						{
							segment: 'label',
							title: t('documentLabel'),
							icon: <LabelIcon />,
						},
						{
							segment: 'product-design',
							title: t('documentType'),
							icon: <TypeSpecimenIcon />,
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
