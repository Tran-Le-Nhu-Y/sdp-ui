import { Outlet } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { PageContainer } from '@toolpad/core/PageContainer';

export default function RootLayout() {
	return (
		<DashboardLayout>
			<PageContainer>
				<Outlet />
			</PageContainer>
		</DashboardLayout>
	);
}
