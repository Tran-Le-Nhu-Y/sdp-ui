import { Typography, Stack, Box, Tab, Tabs, Button } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TabPanel } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { HideDuration, PathHolders, RoutePaths } from '../../utils';
import { useGetDeploymentProcess, useGetPhaseById } from '../../services';
import { useNotifications } from '@toolpad/core';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DetailTab from './DetailTab';
import PersonnelTab from './PersonnelTab';

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const SetupDeploymentPhasePage = () => {
	const { t } = useTranslation('standard');
	const navigate = useNavigate();
	const [value, setValue] = React.useState(0);
	const processId = useParams()[PathHolders.DEPLOYMENT_PROCESS_ID];
	const phaseId = useParams()[PathHolders.DEPLOYMENT_PHASE_ID] ?? '';
	const notifications = useNotifications();

	const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
		setValue(newValue);
	};

	const deploymentProcess = useGetDeploymentProcess(processId!, {
		skip: !processId,
	});
	useEffect(() => {
		if (deploymentProcess.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, deploymentProcess.isError, t]);

	const deploymentPhase = useGetPhaseById(phaseId!, {
		skip: !phaseId,
	});
	useEffect(() => {
		if (deploymentPhase.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, deploymentPhase.isError, t]);

	return (
		<Box>
			<Typography variant="h4" align="center" gutterBottom>
				{t('deploymentPhaseInfor')}
			</Typography>
			<Stack
				direction={{ xs: 'column', sm: 'row' }}
				spacing={{
					xs: 2,
					sm: 2,
					md: 0,
				}}
				justifyContent={{
					xs: 'normal',
					sm: 'space-between',
				}}
			>
				<Stack spacing={1}>
					<Typography>
						<strong>{t('software')}:</strong>{' '}
						{deploymentProcess.data?.software.name}
					</Typography>
					<Typography>
						<strong>{t('version')}:</strong>{' '}
						{deploymentProcess.data?.software.version}
					</Typography>
					<Typography>
						<strong>{t('customer')}:</strong>{' '}
						{deploymentProcess.data?.customer.name}
					</Typography>
				</Stack>
				<Stack spacing={1}>
					<Typography>
						<strong>{t('numOrder')}:</strong> {deploymentPhase.data?.numOrder}
					</Typography>
					<Typography>
						<strong>{t('deploymentPhaseType')}:</strong>{' '}
						{deploymentPhase.data?.type.name}
					</Typography>
				</Stack>
				<Stack spacing={1}>
					<Typography>
						<strong>{t('dateCreated')}:</strong>{' '}
						{deploymentPhase.data?.createdAt}
					</Typography>
					<Typography>
						<strong>{t('lastUpdated')}:</strong>{' '}
						{deploymentPhase.data?.updatedAt}
					</Typography>
					<Button
						variant="outlined"
						sx={{ width: 'fit-content' }}
						startIcon={<ArrowBackIcon />}
						onClick={() => {
							const path = RoutePaths.SETUP_DEPLOYMENT_PROCESS.replace(
								`:${PathHolders.DEPLOYMENT_PROCESS_ID}`,
								`${processId}`
							);
							navigate(path);
						}}
					>
						{t('return')}
					</Button>
				</Stack>
			</Stack>

			<Box>
				<Tabs
					sx={{
						borderBottom: 1,
						borderColor: 'divider',
					}}
					value={value}
					onChange={handleChange}
					variant={'fullWidth'}
				>
					<Tab label={t('detail')} {...a11yProps(0)} />
					<Tab label={t('personnelPerforms')} {...a11yProps(1)} />
				</Tabs>
				<TabPanel value={value} index={0}>
					<DetailTab
						phaseId={phaseId}
						numOrder={deploymentPhase.data?.numOrder ?? 0}
						description={deploymentPhase.data?.description}
						plannedStartDate={deploymentPhase.data?.plannedStartDate ?? ''}
						plannedEndDate={deploymentPhase.data?.plannedEndDate ?? ''}
					/>
				</TabPanel>
				<TabPanel value={value} index={1}>
					<PersonnelTab processId={Number(processId)} phaseId={phaseId} />
				</TabPanel>
			</Box>
		</Box>
	);
};

export default SetupDeploymentPhasePage;
