import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';

import 'dayjs/locale/vi';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AppProvider } from '@toolpad/core/react-router-dom';
import { Outlet } from 'react-router';
import WysiwygIcon from '@mui/icons-material/Wysiwyg';
import Diversity1Icon from '@mui/icons-material/Diversity1';
import DnsIcon from '@mui/icons-material/Dns';
// import DashboardIcon from '@mui/icons-material/Dashboard';
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
	useSession,
} from '@toolpad/core';
import { checkRoles, PathHolders, RoutePaths } from './utils';
import { useEffect, useMemo, useState } from 'react';
import keycloak from './services/keycloak';
import { HydrateFallback } from './components';
import {
	Badge,
	Button,
	Chip,
	Divider,
	IconButton,
	LinearProgress,
	List,
	ListItem,
	ListItemText,
	Popover,
	Stack,
	Tooltip,
	Typography,
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {
	subscribeNotification,
	useCountNotificationHistories,
	useGetNewestNotification,
} from './services';
import { useAppDispatch, useAppSelector } from './hooks/useRedux';
import { decreaseUnread, getNotificationState, increaseUnread } from './redux';
import DeveloperBoardIcon from '@mui/icons-material/DeveloperBoard';
import KeyIcon from '@mui/icons-material/Key';

function CustomAppTitle() {
	return (
		<Stack direction="row" alignItems="center" spacing={2}>
			<DeveloperBoardIcon fontSize="large" color="primary" />
			{/* <CloudCircleIcon fontSize="large" color="primary" /> */}
			<Typography variant="h6">SDP</Typography>
			{/* <Chip size="small" label="BETA" color="info" /> */}
			{/* <Tooltip title="Connected to production">
				<CheckCircleIcon color="success" fontSize="small" />
			</Tooltip> */}
		</Stack>
	);
}

function CustomToolbarActions() {
	const { t } = useTranslation('standard');
	const userId = useSession()?.user?.id;
	const [anchorEl, setAnchorEl] = useState<Element>();
	const open = Boolean(anchorEl);

	const dispatch = useAppDispatch();
	const { unread: unreadNotifs } = useAppSelector(getNotificationState);
	const [showIndicator, setShowIndicator] = useState(false);
	const [notifications, setNotifications] = useState<SdpNotification[]>([]);

	const [newestNotifTrigger, { isLoading: isNotifLoading }] =
		useGetNewestNotification();
	useEffect(() => {
		if (!userId) return;
		subscribeNotification(userId, (newNotificationId) => {
			newestNotifTrigger(newNotificationId)
				.unwrap()
				.then((newNotification) => {
					dispatch(increaseUnread(1));
					setShowIndicator(true);
					setNotifications((pre) => {
						const newList = [newNotification, ...pre];
						if (newList.length > 5) newList.pop();
						return newList;
					});
				})
				.catch((error) => {
					console.warn(error);
				});
		});
	}, [dispatch, newestNotifTrigger, userId]);

	return (
		<>
			<Tooltip arrow title={t('newNotification')}>
				<IconButton
					size="large"
					aria-label="show new notifications"
					color="primary"
					onClick={(e) => {
						setAnchorEl(e.currentTarget);
						setShowIndicator(false);
						dispatch(decreaseUnread(unreadNotifs));
					}}
				>
					<Badge
						badgeContent={unreadNotifs}
						max={99}
						invisible={!showIndicator}
						color="error"
					>
						<NotificationsIcon />
					</Badge>
				</IconButton>
			</Tooltip>
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
				<Stack>
					<Stack width={300} padding={1.5} gap={1}>
						<Typography variant="h5">{t('notification')}</Typography>
						{isNotifLoading && <LinearProgress />}
						{notifications.length == 0 && (
							<Typography alignSelf={'center'} component="h6" variant="caption">
								{t('noNewNotification')}
							</Typography>
						)}
						<List
							sx={{
								maxWidth: 400,
								bgcolor: 'background.paper',
							}}
						>
							{notifications.map(({ id, title, description }, idx) => (
								<>
									<ListItem key={id} alignItems="flex-start">
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
									{idx < notifications.length - 1 && (
										<Divider key={`${id}-divider`} component="li" />
									)}
								</>
							))}
						</List>
					</Stack>
					<Button href={RoutePaths.NOTIFICATION} sx={{ alignSelf: 'flex-end' }}>
						{t('seeMore')}
					</Button>
				</Stack>
			</Popover>
		</>
	);
}

const login = async () => {
	const retrieveSession = async () => {
		const { id, email, firstName, lastName } = await keycloak.loadUserProfile();

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

function App() {
	const { t } = useTranslation('standard');
	const [session, setSession] = useState<Session>();
	const { data: totalHistories } = useCountNotificationHistories(
		{
			userId: session?.user?.id ?? '',
			isRead: false,
		},
		{ skip: !session },
	);

	useEffect(() => {
		if (!session)
			login()
				.then((session) => {
					if (session) setSession(session);
				})
				.catch((error) => {
					console.error(error);
				});
	}, [session]);

	const navigation: Navigation = useMemo(() => {
		// const globalNavs = [
		// 	{
		// 		segment: 'overview',
		// 		title: t('overview'),
		// 		icon: <DashboardIcon />,
		// 	},
		// ];

		if (checkRoles({ requiredRoles: ['software_admin'] }))
			return [
				// ...globalNavs,
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
						{
							segment: 'expired-licenses',
							title: t('potentiallyExpiredLicense'),
							icon: <KeyIcon />,
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
							title: t('potentiallyExpiredLicense'),
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
					action: totalHistories && totalHistories > 0 && (
						<Tooltip arrow title={t('numOfUnreadNotification')}>
							<Chip
								label={totalHistories <= 99 ? totalHistories : '99+'}
								color="error"
								size="small"
							/>
						</Tooltip>
					),
				},
			];
		else if (checkRoles({ requiredRoles: ['deployment_person'] }))
			return [
				// ...globalNavs,
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
					action: totalHistories && totalHistories > 0 && (
						<Tooltip arrow title={t('numOfUnreadNotification')}>
							<Chip
								label={totalHistories <= 99 ? totalHistories : '99+'}
								color="error"
								size="small"
							/>
						</Tooltip>
					),
				},
			];
		else return [];
	}, [t, totalHistories]);

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
		<LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="vi">
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
		</LocalizationProvider>
	);
}

export default App;
