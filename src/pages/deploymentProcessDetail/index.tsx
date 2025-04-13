import { Typography, Container, Stack, Box, Tab, Tabs } from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TabPanel } from '../../components';
import { useParams } from 'react-router-dom';
import {
	getDeploymentProcessStatusTransKey,
	HideDuration,
	PathHolders,
} from '../../utils';
import { useGetDeploymentProcess } from '../../services';
import { useNotifications } from '@toolpad/core';
import { useGetAllPhasesByProcessIdQuery } from '../../services/deployment-phase';
import PhaseTab from './PhaseTab';
import LicenseTab from './LicenseTab';
import ModuleTab from './ModuleTab';
import PersonnelTab from './PersonnelTab';

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const DeploymentProcessDetailPage = () => {
	const { t } = useTranslation();
	const [value, setValue] = React.useState(0);
	const notifications = useNotifications();
	const processId = useParams()[PathHolders.DEPLOYMENT_PROCESS_ID];
	const numericProcessId = processId ? Number(processId) : undefined;

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

	const phasesQuery = useGetAllPhasesByProcessIdQuery(
		{ processId: numericProcessId || 0 },
		{
			skip: !numericProcessId,
		}
	);
	useEffect(() => {
		if (phasesQuery.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, phasesQuery.isError, t]);

	return (
		<Container>
			<Typography variant="h5" align="center" gutterBottom>
				<strong>{t('deploymentProcessInfor')}</strong>
			</Typography>
			<Stack direction={'row'} justifyContent={'space-between'}>
				<Stack>
					<Typography>
						<strong>{t('customer')}:</strong>{' '}
						{deploymentProcess.data?.customer.name}
					</Typography>
					<Typography>
						<strong>{t('status')}:</strong>{' '}
						{deploymentProcess.data?.status &&
							t(
								getDeploymentProcessStatusTransKey(
									deploymentProcess.data?.status
								)
							)}
					</Typography>
				</Stack>
				<Stack>
					<Typography>
						<strong>{t('software')}:</strong>{' '}
						{deploymentProcess.data?.software.name}
					</Typography>
					<Typography>
						<strong>{t('version')}:</strong>{' '}
						{deploymentProcess.data?.software.version}
					</Typography>
				</Stack>
				<Stack>
					<Typography>
						<strong>{t('dateCreated')}:</strong>{' '}
						{deploymentProcess.data?.createdAt}
					</Typography>
					<Typography>
						<strong>{t('lastUpdated')}:</strong>{' '}
						{deploymentProcess.data?.updatedAt}
					</Typography>
				</Stack>
			</Stack>

			<Box sx={{ width: '100%' }}>
				<Box
					sx={{
						borderBottom: 1,
						borderColor: 'divider',
						display: 'flex',
						alignItems: 'center',
						justifyContent: 'center',
					}}
				>
					<Tabs
						value={value}
						onChange={handleChange}
						aria-label="basic tabs example "
					>
						<Tab label={t('currentStep')} {...a11yProps(0)} />
						<Tab label={t('moduleList')} {...a11yProps(1)} />
						<Tab label={t('personnelList')} {...a11yProps(2)} />
						<Tab label={t('licenseList')} {...a11yProps(3)} />
					</Tabs>
				</Box>
				<TabPanel value={value} index={0}>
					<PhaseTab
						processId={Number(processId)}
						phases={phasesQuery.data ?? []}
					/>
				</TabPanel>
				<TabPanel value={value} index={1}>
					<ModuleTab processId={Number(processId)} />
				</TabPanel>
				<TabPanel value={value} index={2}>
					<PersonnelTab processId={Number(processId)} />
				</TabPanel>
				<TabPanel value={value} index={3}>
					<LicenseTab
						processId={Number(processId)}
						phases={phasesQuery.data ?? []}
					/>
				</TabPanel>
			</Box>
		</Container>
	);
};

export default DeploymentProcessDetailPage;
