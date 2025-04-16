import {
	Typography,
	Stack,
	Box,
	Tab,
	Tabs,
	Select,
	MenuItem,
	FormControl,
	CircularProgress,
} from '@mui/material';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { TabPanel } from '../../components';
import { useParams } from 'react-router-dom';
import { HideDuration, PathHolders } from '../../utils';
import {
	useGetDeploymentProcess,
	useUpdateDeploymentProcess,
} from '../../services';
import { useNotifications } from '@toolpad/core';
import PhaseTab from './PhaseTab';
import ModuleTab from './ModuleTab';
import PersonnelTab from './PersonnelTab';

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const SetupDeploymentProcessPage = () => {
	const { t } = useTranslation('standard');
	const [value, setValue] = React.useState(0);
	const processId = useParams()[PathHolders.DEPLOYMENT_PROCESS_ID];
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

	const [updateProcessTrigger, { isLoading: isProcessUpdating }] =
		useUpdateDeploymentProcess();
	const handleUpdateProcess = async (data: DeploymentProcessUpdateRequest) => {
		try {
			await updateProcessTrigger(data).unwrap();

			notifications.show(t('updateDeploymentProcessSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('updateDeploymentProcessError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	return (
		<Box>
			<Typography variant="h4" align="center" gutterBottom>
				{t('deploymentProcessInfor')}
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
						<strong>{t('customer')}:</strong>{' '}
						{deploymentProcess.data?.customer.name}
					</Typography>
					<Typography>
						<strong>{t('status')}:</strong>
					</Typography>
					<FormControl>
						<Select
							id="select-deployment-process-status"
							value={deploymentProcess.data?.status ?? 'INIT'}
							size="small"
							onChange={(e) => {
								handleUpdateProcess({
									processId: Number(processId),
									status: e.target.value as DeploymentProcessStatus,
								});
							}}
						>
							<MenuItem value={'INIT'}>{t('init')}</MenuItem>
							<MenuItem value={'PENDING'}>{t('pending')}</MenuItem>
							<MenuItem value={'IN_PROGRESS'}>{t('inProgress')}</MenuItem>
							<MenuItem value={'DONE'}>{t('done')}</MenuItem>
						</Select>
					</FormControl>
				</Stack>
				<Stack spacing={1}>
					<Typography>
						<strong>{t('software')}:</strong>{' '}
						{deploymentProcess.data?.software.name}
					</Typography>
					<Typography>
						<strong>{t('version')}:</strong>{' '}
						{deploymentProcess.data?.software.version}
					</Typography>
					{isProcessUpdating && (
						<Stack direction={'row'} spacing={1}>
							<CircularProgress size={30} />
							<Typography variant="subtitle1">{t('loading')}</Typography>
						</Stack>
					)}
				</Stack>
				<Stack spacing={1}>
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
					<Tab label={t('phases')} {...a11yProps(0)} />
					<Tab label={t('moduleList')} {...a11yProps(1)} />
					<Tab label={t('personnelPerforms')} {...a11yProps(2)} />
				</Tabs>
				<TabPanel value={value} index={0}>
					<PhaseTab
						processId={Number(processId)}
						editable={deploymentProcess.data?.status === 'INIT'}
					/>
				</TabPanel>
				<TabPanel value={value} index={1}>
					<ModuleTab processId={Number(processId)} />
				</TabPanel>
				<TabPanel value={value} index={2}>
					<PersonnelTab
						processId={Number(processId)}
						editable={deploymentProcess.data?.status === 'INIT'}
					/>
				</TabPanel>
			</Box>
		</Box>
	);
};

export default SetupDeploymentProcessPage;
