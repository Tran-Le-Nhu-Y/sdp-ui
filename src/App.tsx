import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import { AppProvider } from '@toolpad/core/react-router-dom';
import { Outlet } from 'react-router';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import DnsIcon from '@mui/icons-material/Dns';
import DashboardIcon from '@mui/icons-material/Dashboard';
import LabelIcon from '@mui/icons-material/Label';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AssignmentLateIcon from '@mui/icons-material/AssignmentLate';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import { useTranslation } from 'react-i18next';
import theme from './themes/theme';
import {
	Authentication,
	DashboardLayout,
	Navigation,
	PageContainer,
	Session,
} from '@toolpad/core';
import { checkRoles, PathHolders } from './utils';
import { useEffect, useMemo, useState } from 'react';
import keycloak from './services/keycloak';
import { HydrateFallback } from './components';
import {
	Badge,
	Divider,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Pagination,
	Popover,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import CloudCircleIcon from '@mui/icons-material/CloudCircle';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import NotificationsIcon from '@mui/icons-material/Notifications';

function CustomAppTitle() {
	return (
		<Stack direction="row" alignItems="center" spacing={2}>
			<CloudCircleIcon fontSize="large" color="primary" />
			<Typography variant="h6">SDP</Typography>
			{/* <Chip size="small" label="BETA" color="info" /> */}
			<Tooltip title="Connected to production">
				<CheckCircleIcon color="success" fontSize="small" />
			</Tooltip>
		</Stack>
	);
}

function CustomToolbarActions() {
	const { t } = useTranslation('standard');
	const [anchorEl, setAnchorEl] = useState<Element>();
	const open = Boolean(anchorEl);
	const totalNewNotifications = 10;
	const pageSize = 3;

	const data = [
		{
			isRead: false,
			title:
				'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum nesciunt qui, ipsa odit, a excepturi cum, ullam error reiciendis obcaecati voluptatem! Explicabo voluptatum atque nulla odit similique in dicta eaque!',
			description:
				'Lorem ipsum, dolor sit amet consectetur adipisicing elit. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Lorem ipsum, dolor sit amet consectetur adipisicing elit. Dolorum nesciunt qui, ipsa odit, a excepturi cum, ullam error reiciendis obcaecati voluptatem! Explicabo voluptatum atque nulla odit similique in dicta eaque!',
		},
		{
			isRead: true,
			title: 'reiciendis obcaecati voluptatem!que in dicta eaque!',
			description: 'Lore nulla odit similique in dicta eaque!',
		},
	];

	return (
		<>
			<IconButton
				size="large"
				aria-label="show new notifications"
				color="primary"
				onClick={(e) => {
					setAnchorEl(e.currentTarget);
				}}
			>
				{totalNewNotifications !== undefined ? (
					<Badge badgeContent={totalNewNotifications} color="error">
						<NotificationsIcon />
					</Badge>
				) : (
					<NotificationsIcon />
				)}
			</IconButton>
			<Popover
				id={open ? 'notifications-popover' : undefined}
				open={open}
				anchorEl={anchorEl}
				onClose={() => setAnchorEl(undefined)}
				anchorOrigin={{
					vertical: 'center',
					horizontal: 'left',
				}}
				transformOrigin={{
					vertical: 'top',
					horizontal: 'right',
				}}
			>
				<Stack padding={1.5} alignItems="center" gap={1}>
					<Typography variant="h5">{t('notification')}</Typography>
					<List
						sx={{
							maxWidth: 400,
							bgcolor: 'background.paper',
						}}
					>
						{data.map(({ title, description }, idx) => (
							<>
								<ListItem key={idx} alignItems="flex-start">
									<ListItemText
										primary={
											<Typography
												component="h6"
												variant="body2"
												sx={{
													color: 'text.primary',
													fontWeight: 600,
												}}
											>
												{title}
											</Typography>
										}
										secondary={
											<Typography
												component="p"
												variant="caption"
												sx={{
													color: 'text.primary',
													display: 'inline',
												}}
											>
												{description}
											</Typography>
										}
									/>
								</ListItem>
								{idx < data.length - 1 && (
									<Divider key={`${idx}-divider`} component="li" />
								)}
							</>
						))}
					</List>
					<Pagination
						count={10}
						variant="outlined"
						shape="rounded"
						onChange={(_e, page) => {}}
					/>
				</Stack>
			</Popover>
		</>
	);
}

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

		if (keycloak.authenticated) return await retrieveSession();

		await keycloak.login();
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

	const navigation: Navigation = useMemo(() => {
		const globalNavs = [
			{
				segment: 'overview',
				title: t('overview'),
				icon: <DashboardIcon />,
			},
		];

		if (checkRoles({ requiredRoles: ['software_admin'] }))
			return [
				...globalNavs,
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
					segment: 'notification',
					title: t('notification'),
					icon: <NotificationsActiveIcon />,
				},
			];
		else if (checkRoles({ requiredRoles: ['deployment_person'] }))
			return [
				...globalNavs,
				{
					segment: 'deployment/process',
					title: t('deploymentProcess'),
					icon: <DnsIcon />,
					pattern: `deployment/process{/:${PathHolders.DEPLOYMENT_PROCESS_ID}}*`,
				},
				{
					segment: 'notification',
					title: t('notification'),
					icon: <NotificationsActiveIcon />,
				},
			];
		else return [];
	}, [t]);

	const authentication: Authentication = useMemo(() => {
		return {
			signIn: () => {},
			signOut: () => {
				if (!keycloak.authenticated) return;
				setSession(undefined);
				keycloak.logout({ redirectUri: `${location.origin}` });
			},
		};
	}, []);

	if (!session) return <HydrateFallback />;
	return (
		<AppProvider
			theme={theme}
			authentication={authentication}
			session={session}
			navigation={navigation}
		>
			<DashboardLayout
				slots={{
					appTitle: CustomAppTitle,
					toolbarActions: CustomToolbarActions,
				}}
			>
				<PageContainer breadcrumbs={[]}>
					<Outlet />
				</PageContainer>
			</DashboardLayout>
		</AppProvider>
	);
}

export default App;
