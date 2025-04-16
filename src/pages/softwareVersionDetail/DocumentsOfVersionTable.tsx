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
	useDeleteSoftwareDocument,
	useGetAllSoftwareDocumentByVersionId,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { HideDuration, PathHolders, RoutePaths } from '../../utils';

export default function DocumentsOfVersionTable({
	versionId,
	documentQuery,
	onQueryChange,
}: {
	versionId: string;
	documentQuery: GetAllSoftwareDocumentQuery | null;
	onQueryChange: (query: GetAllSoftwareDocumentQuery | null) => void;
}) {
	const navigate = useNavigate();
	const { t } = useTranslation('standard');
	const notifications = useNotifications();
	const dialogs = useDialogs();
	const [filterVersionDialogOpen, setFilterVersionDialogOpen] = useState(false);

	const documents = useGetAllSoftwareDocumentByVersionId(documentQuery!, {
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

	const [deleteSoftwareDocumentTrigger, deleteSoftwareDocument] =
		useDeleteSoftwareDocument();
	useEffect(() => {
		if (deleteSoftwareDocument.isError)
			notifications.show(t('deleteSoftwareVersionError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (deleteSoftwareDocument.isSuccess)
			notifications.show(t('deleteSoftwareVersionSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
	}, [
		deleteSoftwareDocument.isError,
		deleteSoftwareDocument.isSuccess,
		notifications,
		t,
	]);
	const handleDelete = async (versionId: string) => {
		const confirmed = await dialogs.confirm(
			t('deleteSoftwareDocumentConfirm'),
			{
				title: t('deleteConfirm'),
				okText: t('yes'),
				cancelText: t('cancel'),
			},
		);
		if (!confirmed) return;

		await deleteSoftwareDocumentTrigger(versionId);
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
							key: 'softwareDocumentName',
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
							GetAllSoftwareDocumentQuery,
							'softwareVersionId'
						> = {
							...documentQuery,
							softwareDocumentName: undefined,
							documentTypeName: undefined,
						};
						onQueryChange({
							...defaultProps,
							softwareVersionId: versionId,
							...query,
						});
					}}
					onReset={() => {
						onQueryChange({
							softwareVersionId: versionId,
							...documentQuery,
							documentTypeName: '',
							softwareDocumentName: '',
						});
					}}
				/>
				<Button
					variant="contained"
					onClick={() =>
						navigate(
							`${RoutePaths.CREATE_SOFTWARE_DOCUMENT.replace(`:${PathHolders.SOFTWARE_VERSION_ID}`, versionId)}`,
						)
					}
				>
					{t('addDocument')}
				</Button>
			</Stack>
			{(deleteSoftwareDocument.isLoading || documents.isFetching) && (
				<LinearProgress />
			)}
			<PaginationTable
				headers={
					<>
						<TableCell key={`software-${versionId}-type`}>
							{t('documentType')}
						</TableCell>
						<TableCell key={`software-${versionId}-name`}>
							{t('documentName')}
						</TableCell>
						<TableCell key={`software-${versionId}-createdAt`} align="center">
							{t('dateCreated')}
						</TableCell>
						<TableCell key={`software-${versionId}-updatedAt`} align="center">
							{t('lastUpdated')}
						</TableCell>
						<TableCell />
					</>
				}
				count={documents?.data?.totalElements ?? 0}
				rows={documents?.data?.content ?? []}
				onPageChange={(newPage) =>
					onQueryChange({
						softwareVersionId: versionId,
						softwareDocumentName: documentQuery?.softwareDocumentName ?? '',
						...newPage,
					})
				}
				getCell={(row) => (
					<TableRow key={`software_verion-${row.id}`}>
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
											RoutePaths.SOFTWARE_DOCUMENT.replace(
												`:${PathHolders.SOFTWARE_DOCUMENT_ID}`,
												row.id,
											),
										)
									}
								>
									<RemoveRedEyeIcon color="info" />
								</IconButton>
								<IconButton
									size="small"
									onClick={() =>
										navigate(
											RoutePaths.MODIFY_SOFTWARE_DOCUMENT.replace(
												`:${PathHolders.SOFTWARE_DOCUMENT_ID}`,
												row.id,
											),
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
