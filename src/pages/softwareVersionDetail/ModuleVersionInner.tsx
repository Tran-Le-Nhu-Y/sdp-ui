import {
	IconButton,
	Stack,
	Box,
	TableCell,
	TableRow,
	Button,
	LinearProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useTranslation } from 'react-i18next';
import { PaginationTable, FilterDialog } from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	useDeleteModuleVersion,
	useGetAllModuleVersionsByModuleId,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { HideDuration, PathHolders, RoutePaths } from '../../utils';

export default function ModuleVersionInner({
	moduleId,
	moduleVersionQuery,
	onQueryChange,
}: {
	moduleId: string;
	moduleVersionQuery: GetAllModuleVersionQuery | null;
	onQueryChange: (query: GetAllModuleVersionQuery | null) => void;
}) {
	const navigate = useNavigate();
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const dialogs = useDialogs();
	const [filterVersionDialogOpen, setFilterVersionDialogOpen] = useState(false);

	const moduleVersions = useGetAllModuleVersionsByModuleId(
		moduleVersionQuery!,
		{
			skip: !moduleVersionQuery,
		}
	);
	useEffect(() => {
		if (moduleVersions.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		// else if (software.isSuccess && software.data?.content.length === 0)
		// 	notifications.show(t('noProduct'), { severity: 'info' });
	}, [notifications, moduleVersions.isError, t]);

	const [deleteModuleVersionTrigger, deleteModuleVersion] =
		useDeleteModuleVersion();
	useEffect(() => {
		if (deleteModuleVersion.isError)
			notifications.show(t('deleteModuleVersionError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (deleteModuleVersion.isSuccess)
			notifications.show(t('deleteModuleVersionSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
	}, [
		deleteModuleVersion.isError,
		deleteModuleVersion.isSuccess,
		notifications,
		t,
	]);
	const handleDelete = async (moduleVersionId: string) => {
		const confirmed = await dialogs.confirm(t('deleteModuleVersionConfirm'), {
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;

		await deleteModuleVersionTrigger(moduleVersionId);
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
							key: 'moduleVersionName',
							label: t('versionName'),
						},
					]}
					open={filterVersionDialogOpen}
					onClose={() => setFilterVersionDialogOpen(false)}
					onOpen={() => setFilterVersionDialogOpen(true)}
					onApply={(filters) => {
						const query: object = filters.reduce((pre, curr) => {
							return { ...pre, [curr.key]: curr.value };
						}, {});
						onQueryChange({ ...moduleVersionQuery, moduleId, ...query });
					}}
					onReset={() => {
						onQueryChange({
							moduleId,
							...moduleVersionQuery,
							moduleVersionName: '',
						});
					}}
				/>
				<Button
					variant="contained"
					onClick={() =>
						navigate(
							`${RoutePaths.CREATE_MODULE_VERSION.replace(`:${PathHolders.MODULE_ID}`, moduleId)}`
						)
					}
				>
					{t('addModuleVersion')}
				</Button>
			</Stack>
			{(deleteModuleVersion.isLoading || moduleVersions.isFetching) && (
				<LinearProgress />
			)}
			<PaginationTable
				headers={
					<>
						<TableCell key={`module-version-${moduleId}-name`}>
							{t('versionName')}
						</TableCell>
						<TableCell
							key={`module-version-${moduleId}-createdAt`}
							align="center"
						>
							{t('dateCreated')}
						</TableCell>
						<TableCell
							key={`module-version-${moduleId}-updatedAt`}
							align="center"
						>
							{t('lastUpdated')}
						</TableCell>
						<TableCell />
					</>
				}
				count={moduleVersions?.data?.totalElements ?? 0}
				rows={moduleVersions?.data?.content ?? []}
				onPageChange={(newPage) =>
					onQueryChange({
						moduleId,
						moduleVersionName: moduleVersionQuery?.moduleVersionName ?? '',
						...newPage,
					})
				}
				getCell={(row) => (
					<TableRow key={`module_verion-${row.id}`}>
						<TableCell>{row.name}</TableCell>
						<TableCell align="center">{row.createdAt}</TableCell>
						<TableCell align="center">{row.updatedAt}</TableCell>
						<TableCell>
							<Stack direction="row">
								<IconButton
									size="small"
									onClick={() =>
										navigate(
											RoutePaths.MODULE_VERSION.replace(
												`:${PathHolders.MODULE_ID}`,
												moduleId
											).replace(`:${PathHolders.MODULE_VERSION_ID}`, row.id)
										)
									}
								>
									<RemoveRedEyeIcon color="info" />
								</IconButton>
								<IconButton
									size="small"
									onClick={() =>
										navigate(
											RoutePaths.MODIFY_MODULE_VERSION.replace(
												`:${PathHolders.MODULE_VERSION_ID}`,
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
