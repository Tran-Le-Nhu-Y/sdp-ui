import {
	Typography,
	Stack,
	Box,
	Tab,
	Tabs,
	LinearProgress,
	Tooltip,
	styled,
	Button,
} from '@mui/material';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { Attachment, TabPanel } from '../../components';
import { useParams } from 'react-router-dom';
import { HideDuration, parseToDayjs, PathHolders } from '../../utils';
import {
	useGetAllUsersByRole,
	useGetDeploymentProcess,
	useGetDeploymentPhaseMemberIds,
	useUpdateDeploymentProcess,
	useUpdateDeploymentPhaseMember,
	useGetPhaseById,
	useGetAllPhaseAttachments,
	useUpdateDeploymentPhaseAttachment,
	useCreateFile,
} from '../../services';
import { useDialogs, useNotifications, useSession } from '@toolpad/core';
import {
	DataGrid,
	GridActionsCellItem,
	GridColDef,
	GridToolbarColumnsButton,
	GridToolbarContainer,
	GridToolbarDensitySelector,
	GridToolbarFilterButton,
	GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

function a11yProps(index: number) {
	return {
		id: `simple-tab-${index}`,
		'aria-controls': `simple-tabpanel-${index}`,
	};
}

const VisuallyHiddenInput = styled('input')({
	clip: 'rect(0 0 0 0)',
	clipPath: 'inset(50%)',
	height: 1,
	overflow: 'hidden',
	position: 'absolute',
	bottom: 0,
	left: 0,
	whiteSpace: 'nowrap',
	width: 1,
});

function DetailTab({
	phaseId,
	description,
	plannedStartDate,
	plannedEndDate,
}: {
	phaseId?: string;
	description?: string | null;
	plannedStartDate?: string;
	plannedEndDate?: string;
}) {
	const { t } = useTranslation('standard');
	const dialogs = useDialogs();
	const notifications = useNotifications();
	const userId = useSession()?.user?.id;

	const attachments = useGetAllPhaseAttachments(phaseId!, {
		skip: !phaseId,
	});

	const [updateAttachmentTrigger, { isLoading: isAttachmentUpdating }] =
		useUpdateDeploymentPhaseAttachment();
	const [uploadFileTrigger] = useCreateFile();
	const addAttachments = async (fileList: FileList) => {
		if (!phaseId || !userId) return;

		const files: File[] = [];
		for (let index = 0; index < fileList.length; index++) {
			const file = fileList.item(index);
			if (file) files.push(file);
		}

		try {
			const attachmentIds = await Promise.all(
				files.map(async (file) => {
					return await uploadFileTrigger({
						userId: userId,
						file: file,
					}).unwrap();
				})
			);
			await Promise.all(
				attachmentIds.map(async (attachmentId) => {
					return await updateAttachmentTrigger({
						phaseId: phaseId,
						attachmentId: attachmentId,
						operator: 'ADD',
					}).unwrap();
				})
			);

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
	const deleteAttachment = async (attachmentId: string) => {
		if (!phaseId) return;

		const confirmed = await dialogs.confirm(t('deleteFileConfirm'), {
			title: t('deleteFile'),
			okText: t('yes'),
			cancelText: t('cancel'),
			severity: 'error',
		});
		if (!confirmed) return;

		try {
			await updateAttachmentTrigger({
				phaseId: phaseId,
				attachmentId: attachmentId,
				operator: 'REMOVE',
			}).unwrap();

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

	const [updateProcessTrigger, { isLoading: isProcessUpdating }] =
		useUpdateDeploymentProcess();
	const handleUpdateProcess = async (data: DeploymentProcessUpdateRequest) => {
		try {
			await updateProcessTrigger(data).unwrap();

			notifications.show(t('deleteFileSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		} catch (error) {
			notifications.show(t('deleteFileError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
			console.error(error);
		}
	};

	return (
		<Stack spacing={1}>
			{isAttachmentUpdating && <LinearProgress />}
			<Stack direction="row" alignItems="center" spacing={1}>
				<Typography variant="h6">{t('plannedStartDate')}:</Typography>
				<DatePicker
					value={plannedStartDate ? parseToDayjs(plannedStartDate) : dayjs()}
					slotProps={{ textField: { size: 'small' } }}
				/>
			</Stack>
			<Stack direction="row" alignItems="center" spacing={1}>
				<Typography variant="h6">{t('plannedEndDate')}:</Typography>
				<DatePicker
					value={plannedEndDate ? parseToDayjs(plannedEndDate) : dayjs()}
					slotProps={{ textField: { size: 'small' } }}
				/>
			</Stack>
			<Typography variant="h6">{t('description')}:</Typography>
			<Typography variant="body1">{description}</Typography>

			<Stack
				spacing={1}
				direction={'row'}
				alignItems={'center'}
				overflow={'auto'}
			>
				<Typography variant="h6">{t('uploadedFiles')}:</Typography>
				<Tooltip title={t('addFile')}>
					<Button
						component="label"
						role={undefined}
						variant="contained"
						tabIndex={-1}
						size="small"
						startIcon={<CloudUploadIcon />}
					>
						{t('add')}
						<VisuallyHiddenInput
							type="file"
							multiple
							onChange={(event) => {
								const files = event.target.files;
								if (files) addAttachments(files);
							}}
						/>
					</Button>
				</Tooltip>
			</Stack>
			<Stack spacing={1} direction={'row'}>
				{attachments?.data?.map((file) => (
					<Attachment
						key={file.id}
						file={{ ...file }}
						onRemoveClick={deleteAttachment}
					/>
				))}
			</Stack>
		</Stack>
	);
}

function PersonnelTab({ phaseId }: { phaseId: string }) {
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const userQuery = useGetAllUsersByRole('deployment_person');
	const memberIdQuery = useGetDeploymentPhaseMemberIds(phaseId);
	const [updateMemberTrigger, { isLoading: isUpdatingMember }] =
		useUpdateDeploymentPhaseMember();

	const updateMemberHandler = useCallback(
		async (
			request: DeploymentPhaseMemberUpdateRequest,
			successText: string,
			errorText: string
		) => {
			try {
				await updateMemberTrigger(request).unwrap();

				notifications.show(successText, {
					severity: 'success',
					autoHideDuration: HideDuration.fast,
				});
			} catch (error) {
				console.error(error);
				notifications.show(errorText, {
					severity: 'error',
					autoHideDuration: HideDuration.fast,
				});
			}
		},
		[notifications, updateMemberTrigger]
	);

	const findUsers = useCallback(
		(isSelected: boolean) => {
			const memberIds = memberIdQuery.data;
			if (!memberIds) return [];

			return (
				userQuery?.data?.filter((user) => {
					const selected = memberIds.includes(user.id);
					return isSelected ? selected : !selected;
				}) ?? []
			);
		},
		[memberIdQuery?.data, userQuery?.data]
	);

	const unselectedUsers = useMemo(() => findUsers(false), [findUsers]);
	const unselectedCols: GridColDef[] = useMemo(
		() => [
			{
				field: 'fullName',
				headerName: t('fullName'),
				editable: false,
				width: 200,
				type: 'string',
				valueGetter: (_value, row) => {
					return `${row.lastName || ''} ${row.firstName || ''}`;
				},
			},
			{
				field: 'email',
				editable: false,
				minWidth: 200,
				headerName: t('emailAddress'),
				type: 'string',
			},
			{
				field: 'actions',
				headerName: t('action'),
				type: 'actions',
				width: 40,
				getActions: (params) => [
					<GridActionsCellItem
						icon={
							<Tooltip title={t('add')}>
								<AddIcon />
							</Tooltip>
						}
						color="success"
						label={t('add')}
						onClick={() => {
							const memberId = params.id.toString();
							updateMemberHandler(
								{
									phaseId: phaseId,
									memberId: memberId,
									operator: 'ADD',
								},
								t('addMemberSuccess'),
								t('addMemberError')
							);
						}}
					/>,
				],
			},
		],
		[phaseId, t, updateMemberHandler]
	);

	const selectedUsers = useMemo(() => findUsers(true), [findUsers]);
	const selectedCols: GridColDef[] = useMemo(
		() => [
			{
				field: 'fullName',
				headerName: t('fullName'),
				editable: false,
				width: 200,
				valueGetter: (_value, row) => {
					return `${row.lastName || ''} ${row.firstName || ''}`;
				},
			},
			{
				field: 'email',
				editable: false,
				minWidth: 200,
				headerName: t('emailAddress'),
			},
			{
				field: 'actions',
				headerName: t('action'),
				type: 'actions',
				width: 40,
				getActions: (params) => [
					<GridActionsCellItem
						icon={
							<Tooltip title={t('delete')}>
								<DeleteIcon />
							</Tooltip>
						}
						color="error"
						label={t('delete')}
						onClick={() => {
							const memberId = params.id.toString();
							updateMemberHandler(
								{
									phaseId: phaseId,
									memberId: memberId,
									operator: 'REMOVE',
								},
								t('removeMemberSuccess'),
								t('removeMemberError')
							);
						}}
					/>,
				],
			},
		],
		[phaseId, t, updateMemberHandler]
	);

	if (userQuery.isLoading || memberIdQuery.isLoading) return <LinearProgress />;
	return (
		<>
			{isUpdatingMember && <LinearProgress />}
			<Stack
				direction={{
					xs: 'column',
					sm: 'row',
				}}
				justifyContent={'space-around'}
				spacing={2}
			>
				<Stack direction={'column'} spacing={1}>
					<Typography variant="h6">{t('unassignedPersonnel')}</Typography>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<DataGrid
							slots={{
								toolbar: () => (
									<GridToolbarContainer>
										<GridToolbarFilterButton />
										<GridToolbarDensitySelector />
										<GridToolbarColumnsButton />
										<GridToolbarQuickFilter />
									</GridToolbarContainer>
								),
							}}
							rows={unselectedUsers}
							columns={unselectedCols}
							pageSizeOptions={[5, 10, 15]}
							initialState={{
								pagination: {
									paginationModel: {
										page: 0,
										pageSize: 5,
									},
								},
							}}
						/>
					</div>
				</Stack>
				<Stack direction={'column'} spacing={1}>
					<Typography variant="h6">{t('assignedPersonnel')}</Typography>
					<div style={{ display: 'flex', flexDirection: 'column' }}>
						<DataGrid
							slots={{
								toolbar: () => (
									<GridToolbarContainer>
										<GridToolbarFilterButton />
										<GridToolbarDensitySelector />
										<GridToolbarColumnsButton />
										<GridToolbarQuickFilter />
									</GridToolbarContainer>
								),
							}}
							rows={selectedUsers}
							columns={selectedCols}
							pageSizeOptions={[5, 10, 15]}
							initialState={{
								pagination: {
									paginationModel: {
										page: 0,
										pageSize: 5,
									},
								},
							}}
						/>
					</div>
				</Stack>
			</Stack>
		</>
	);
}

const SetupDeploymentPhasePage = () => {
	const { t } = useTranslation('standard');
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
						description={deploymentPhase.data?.description}
						plannedStartDate={deploymentPhase.data?.plannedStartDate}
						plannedEndDate={deploymentPhase.data?.plannedEndDate}
					/>
				</TabPanel>
				<TabPanel value={value} index={1}>
					<PersonnelTab phaseId={phaseId} />
				</TabPanel>
			</Box>
		</Box>
	);
};

export default SetupDeploymentPhasePage;
