import {
	IconButton,
	Stack,
	Box,
	TableCell,
	TableRow,
	Button,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useTranslation } from 'react-i18next';
import { PaginationTable, FilterDialog } from '../../components';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
	useDeleteModuleDocument,
	useGetAllModuleDocumentByVersionId,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { HideDuration, PathHolders, RoutePaths } from '../../utils';

export default function DocumentsOfVersionTable({
	versionId,
	documentQuery,
	onQueryChange,
}: {
	versionId: string;
	documentQuery: GetAllModuleDocumentQuery | null;
	onQueryChange: (query: GetAllModuleDocumentQuery | null) => void;
}) {
	const navigate = useNavigate();
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const dialogs = useDialogs();
	const [filterVersionDialogOpen, setFilterVersionDialogOpen] = useState(false);

	const documents = useGetAllModuleDocumentByVersionId(documentQuery!, {
		skip: !documentQuery,
	});
	useEffect(() => {
		if (documents.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		// else if (software.isSuccess && software.data?.content.length === 0)
		// 	notifications.show(t('noProduct'), { severity: 'info' });
	}, [notifications, documents.isError, t]);

	const [deleteModuleDocumentTrigger, deleteModuleDocument] =
		useDeleteModuleDocument();
	useEffect(() => {
		if (deleteModuleDocument.isError)
			notifications.show(t('deleteSoftwareVersionError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (deleteModuleDocument.isSuccess)
			notifications.show(t('deleteSoftwareVersionSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
	}, [
		deleteModuleDocument.isError,
		deleteModuleDocument.isSuccess,
		notifications,
		t,
	]);
	const handleDelete = async (versionId: string) => {
		const confirmed = await dialogs.confirm(t('deleteModuleDocumentConfirm'), {
			title: t('deleteConfirm'),
			okText: t('yes'),
			cancelText: t('cancel'),
			severity: 'error',
		});
		if (!confirmed) return;

		await deleteModuleDocumentTrigger(versionId);
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
							key: 'documentTypeName',
							label: t('documentTypeName'),
						},
						{
							key: 'moduleDocumentName',
							label: t('documentName'),
						},
					]}
					open={filterVersionDialogOpen}
					onClose={() => setFilterVersionDialogOpen(false)}
					onOpen={() => setFilterVersionDialogOpen(true)}
					onApply={(filters) => {
						const query: object = filters.reduce((pre, curr) => {
							return { ...pre, [curr.key]: curr.value };
						}, {});
						const defaultProps: Omit<
							GetAllModuleDocumentQuery,
							'moduleVersionId'
						> = {
							...documentQuery,
							moduleDocumentName: undefined,
							documentTypeName: undefined,
						};
						onQueryChange({
							...defaultProps,
							moduleVersionId: versionId,
							...query,
						});
					}}
					onReset={() => {
						onQueryChange({
							moduleVersionId: versionId,
							...documentQuery,
							moduleDocumentName: '',
							documentTypeName: '',
						});
					}}
				/>
				<Button
					variant="contained"
					onClick={() =>
						navigate(
							`${RoutePaths.CREATE_MODULE_DOCUMENT.replace(`:${PathHolders.MODULE_VERSION_ID}`, versionId)}`
						)
					}
				>
					{t('addDocument')}
				</Button>
			</Stack>
			{/* {deleteSoftwareVersion.isLoading && <LinearProgress />} */}
			<PaginationTable
				headers={
					<>
						<TableCell key={`module-${versionId}-type`}>
							{t('documentType')}
						</TableCell>
						<TableCell key={`module-${versionId}-name`}>
							{t('documentName')}
						</TableCell>
						<TableCell key={`module-${versionId}-createdAt`} align="center">
							{t('dateCreated')}
						</TableCell>
						<TableCell key={`module-${versionId}-updatedAt`} align="center">
							{t('lastUpdated')}
						</TableCell>
						<TableCell />
					</>
				}
				count={documents?.data?.totalElements ?? 0}
				rows={documents?.data?.content ?? []}
				onPageChange={(newPage) =>
					onQueryChange({
						moduleVersionId: versionId,
						moduleDocumentName: documentQuery?.moduleDocumentName ?? '',
						...newPage,
					})
				}
				getCell={(row) => (
					<TableRow key={`module_verion-${row.id}`}>
						<TableCell>{row.typeName}</TableCell>
						<TableCell>{row.name}</TableCell>
						<TableCell align="center">{row.createdAt}</TableCell>
						<TableCell align="center">{row.updatedAt}</TableCell>
						<TableCell>
							<Stack direction="row">
								<IconButton
									size="small"
									onClick={() =>
										navigate(
											RoutePaths.MODULE_DOCUMENT.replace(
												`:${PathHolders.MODULE_DOCUMENT_ID}`,
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
											RoutePaths.MODIFY_MODULE_DOCUMENT.replace(
												`:${PathHolders.MODULE_DOCUMENT_ID}`,
												row.id
											)
										)
									}
								>
									<EditIcon color="info" />
								</IconButton>
								<IconButton size="small" onClick={() => handleDelete(row.id)}>
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
