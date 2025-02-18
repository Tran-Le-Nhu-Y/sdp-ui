import {
	CollapsibleTable,
	CollapsibleTableRow,
	FilterDialog,
	PaginationTable,
	TextEditor,
} from '../../components';
import { useTranslation } from 'react-i18next';
import {
	Box,
	Button,
	IconButton,
	LinearProgress,
	Stack,
	TableCell,
	TableRow,
	Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import {
	useDeleteSoftware,
	useDeleteSoftwareVersion,
	useGetAllSoftwareByUserId,
	useGetAllVersionsBySoftwareId,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hideDuration, PathHolders, RoutePaths } from '../../utils';

function SoftwareVersionInner({
	softwareId,
	versionQuery,
	onQueryChange,
}: {
	softwareId: string;
	versionQuery: GetAllSoftwareVersionQuery | null;
	onQueryChange: (query: GetAllSoftwareVersionQuery | null) => void;
}) {
	const navigate = useNavigate();
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const dialogs = useDialogs();
	const [filterVersionDialogOpen, setFilterVersionDialogOpen] = useState(false);

	const versions = useGetAllVersionsBySoftwareId(versionQuery!, {
		skip: !versionQuery,
	});
	useEffect(() => {
		if (versions.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		// else if (software.isSuccess && software.data?.content.length === 0)
		// 	notifications.show(t('noProduct'), { severity: 'info' });
	}, [notifications, versions.isError, t]);

	const [deleteSoftwareVersionTrigger, deleteSoftwareVersion] =
		useDeleteSoftwareVersion();
	useEffect(() => {
		if (deleteSoftwareVersion.isError)
			notifications.show(t('deleteSoftwareVersionError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		else if (deleteSoftwareVersion.isSuccess)
			notifications.show(t('deleteSoftwareVersionSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
	}, [
		deleteSoftwareVersion.isError,
		deleteSoftwareVersion.isSuccess,
		notifications,
		t,
	]);
	const handleDelete = async (versionId: string) => {
		const confirmed = await dialogs.confirm(t('deleteSoftwareVersionConfirm'), {
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;

		await deleteSoftwareVersionTrigger(versionId);
	};

	return (
		<Box>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{ marginBottom: 1 }}
			>
				<FilterDialog
					filters={[
						{
							key: 'versionName',
							label: t('softwareVersionName'),
						},
					]}
					open={filterVersionDialogOpen}
					onClose={() => setFilterVersionDialogOpen(false)}
					onOpen={() => setFilterVersionDialogOpen(true)}
					onApply={(filters) => {
						const query: object = filters.reduce((pre, curr) => {
							return { ...pre, [curr.key]: curr.value };
						}, {});
						onQueryChange({ ...versionQuery, softwareId, ...query });
					}}
					onReset={() => {
						onQueryChange({
							softwareId,
							...versionQuery,
							versionName: '',
						});
					}}
				/>
				<Button
					variant="contained"
					onClick={() =>
						navigate(
							`${RoutePaths.CREATE_SOFTWARE_VERSION.replace(`:${PathHolders.SOFTWARE_ID}`, softwareId)}`
						)
					}
				>
					{t('addSoftwareVersion')}
				</Button>
			</Stack>
			{deleteSoftwareVersion.isLoading && <LinearProgress />}
			<PaginationTable
				headers={
					<>
						<TableCell key={`software-${softwareId}-name`}>
							{t('softwareVersionName')}
						</TableCell>
						<TableCell key={`software-${softwareId}-createdAt`} align="center">
							{t('dateCreated')}
						</TableCell>
						<TableCell key={`software-${softwareId}-updatedAt`} align="center">
							{t('lastUpdated')}
						</TableCell>
						<TableCell />
					</>
				}
				count={versions?.data?.totalElements ?? 0}
				rows={versions?.data?.content ?? []}
				onPageChange={(newPage) =>
					onQueryChange({
						softwareId,
						versionName: versionQuery?.versionName ?? '',
						...newPage,
					})
				}
				getCell={(row) => (
					<TableRow key={`software_verion-${row.id}`}>
						<TableCell>{row.name}</TableCell>
						<TableCell align="center">{row.createdAt}</TableCell>
						<TableCell align="center">{row.updatedAt}</TableCell>
						<TableCell>
							<Stack direction="row">
								<IconButton
									size="small"
									onClick={() =>
										navigate(
											RoutePaths.SOFTWARE_VERSION_DETAIL.replace(
												`:${PathHolders.SOFTWARE_VERSION_ID}`,
												row.id
											)
										)
									}
								>
									<RemoveRedEyeIcon color="info" />
								</IconButton>
								<IconButton
									size="small"
									onClick={() =>
										navigate(
											RoutePaths.MODIFY_SOFTWARE_VERSION.replace(
												`:${PathHolders.SOFTWARE_VERSION_ID}`,
												row.id
											)
										)
									}
								>
									<EditIcon color="info" />
								</IconButton>
								<IconButton
									size="small"
									onClick={async () => handleDelete(row.id)}
								>
									<DeleteIcon color="error" />
								</IconButton>
							</Stack>
						</TableCell>
					</TableRow>
				)}
			/>
		</Box>
	);
}

export default function SoftwarePage() {
	const { t } = useTranslation('standard');
	const navigate = useNavigate();
	const notifications = useNotifications();
	const dialogs = useDialogs();
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);

	const [softwareQuery, setSoftwareQuery] = useState<GetAllSoftwareQuery>({
		userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
		softwareName: '',
		pageNumber: 0,
		pageSize: 6,
	});
	const software = useGetAllSoftwareByUserId(softwareQuery!, {
		skip: !softwareQuery,
	});
	useEffect(() => {
		if (software.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		// else if (software.isSuccess && software.data?.content.length === 0)
		// 	notifications.show(t('noProduct'), { severity: 'info' });
	}, [notifications, software.isError, t]);

	const [deleteSoftwareTrigger, deleteSoftware] = useDeleteSoftware();
	useEffect(() => {
		if (deleteSoftware.isError)
			notifications.show(t('deleteProductError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		else if (deleteSoftware.isSuccess)
			notifications.show(t('deleteProductSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
	}, [deleteSoftware.isError, deleteSoftware.isSuccess, notifications, t]);
	const handleDelete = async (productId: string) => {
		const confirmed = await dialogs.confirm(t('deleteProductConfirm'), {
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;

		await deleteSoftwareTrigger(productId);
	};

	const [versionQuery, setVersionQuery] =
		useState<GetAllSoftwareVersionQuery | null>(null);

	return (
		<Box>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{ marginBottom: 1 }}
			>
				<FilterDialog
					filters={[
						{
							key: 'softwareName',
							label: t('softwareName'),
						},
					]}
					open={filterDialogOpen}
					onClose={() => setFilterDialogOpen(false)}
					onOpen={() => setFilterDialogOpen(true)}
					onApply={(filters) => {
						const query: object = filters.reduce((pre, curr) => {
							return { ...pre, [curr.key]: curr.value };
						}, {});
						setSoftwareQuery((prev) => ({ ...prev, ...query }));
					}}
					onReset={() => {
						setSoftwareQuery((prev) => ({ ...prev, softwareName: '' }));
					}}
				/>
				<Button
					variant="contained"
					onClick={() => navigate(RoutePaths.CREATE_SOFTWARE)}
				>
					{t('addSoftware')}
				</Button>
			</Stack>

			{(software.isLoading || deleteSoftware.isLoading) && <LinearProgress />}
			<CollapsibleTable
				headers={
					<>
						<TableCell key="name">{t('softwareName')}</TableCell>
						<TableCell key="createdAt" align="center">
							{t('dateCreated')}
						</TableCell>
						<TableCell key="updatedAt" align="center">
							{t('lastUpdated')}
						</TableCell>
						<TableCell />
						<TableCell />
					</>
				}
				rows={software.data?.content ?? []}
				count={software.data?.totalElements ?? 0}
				pageNumber={softwareQuery?.pageNumber}
				pageSize={softwareQuery?.pageSize}
				onPageChange={(newPage) =>
					setSoftwareQuery((prev) => {
						return { ...prev, ...newPage };
					})
				}
				getCell={(row) => (
					<CollapsibleTableRow
						key={row.id}
						cells={
							<>
								<TableCell align="justify" component="th" scope="row">
									{row.name}
								</TableCell>
								<TableCell align="center">{row.createdAt}</TableCell>
								<TableCell align="center">{row.updatedAt ?? ''}</TableCell>
								{/* <TableCell align="center">{t(row.status)}</TableCell> */}
								<TableCell align="center">
									<IconButton
										onClick={() =>
											navigate(
												RoutePaths.MODIFY_SOFTWARE.replace(
													`:${PathHolders.SOFTWARE_ID}`,
													row.id
												)
											)
										}
									>
										<EditIcon color="info" />
									</IconButton>
									<IconButton onClick={async () => handleDelete(row.id)}>
										<DeleteIcon color="error" />
									</IconButton>
								</TableCell>
							</>
						}
						inner={
							<>
								<Typography variant="caption" gutterBottom component="div">
									ID: {row.id}
								</Typography>
								<Box
									component="form"
									sx={{
										'& .MuiTextField-root': {
											marginBottom: 1,
											marginTop: 1,
											width: '100%',
										},
									}}
									noValidate
									autoComplete="off"
								>
									<Stack
										mt={1}
										mb={2}
										sx={{
											width: '100%',
										}}
									>
										<TextEditor value={row.description ?? ''} readOnly />
									</Stack>
								</Box>
								<SoftwareVersionInner
									softwareId={row.id}
									versionQuery={versionQuery}
									onQueryChange={(query) => setVersionQuery(query)}
								/>
							</>
						}
						onExpand={() => {
							setVersionQuery({
								softwareId: row.id,
								versionName: '',
								pageNumber: 0,
								pageSize: 5,
							});
						}}
					/>
				)}
			/>
		</Box>
	);
}
