import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

import { AppProvider } from '@toolpad/core/react-router-dom';
import { Outlet } from 'react-router';
import LogoutIcon from '@mui/icons-material/Logout';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DnsIcon from '@mui/icons-material/Dns';
import ArticleIcon from '@mui/icons-material/Article';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DescriptionIcon from '@mui/icons-material/Description';
import BookmarksIcon from '@mui/icons-material/Bookmarks';
import { useTranslation } from 'react-i18next';
import theme from './themes/theme';

function App() {
	const { t } = useTranslation();

	return (
		<AppProvider
			theme={theme}
			// branding={}
			navigation={[
				{
					segment: 'overview',
					title: t('overview'),
					icon: <DashboardIcon />,
				},

				{
					segment: 'product',
					title: t('productManagement'),
					icon: <Inventory2Icon />,
				},
				{
					segment: 'deploy',
					title: t('deployManagement'),
					icon: <DnsIcon />,
				},
				{
					segment: 'document',
					title: t('documentManagement'),
					icon: <ArticleIcon />,
					children: [
						{
							segment: 'label',
							title: t('documentLabel'),
							icon: <BookmarksIcon />,
						},
						{
							segment: 'design',
							title: t('designDocument'),
							icon: <DescriptionIcon />,
						},
					],
				},
				{
					segment: 'test',
					title: 'Test',
					icon: <DescriptionIcon />,
				},
				{
					segment: 'logout',
					title: t('logOut'),
					icon: <LogoutIcon />,
				},
			]}
		>
			<Outlet />
		</AppProvider>
	);
}

export default App;
