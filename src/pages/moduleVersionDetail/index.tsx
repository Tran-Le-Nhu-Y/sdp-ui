import {
	Typography,
	IconButton,
	Stack,
	Box,
	TableCell,
	TableRow,
	Button,
	Divider,
	LinearProgress,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useTranslation } from 'react-i18next';
import { PaginationTable, TextEditor, FilterDialog } from '../../components';
import { Delete, Edit } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	useDeleteModuleDocument,
	useDeleteModuleVersion,
	useGetAllModuleDocumentByVersionId,
	useGetModuleById,
	useGetModuleVersionById,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { HideDuration, PathHolders, RoutePaths } from '../../utils';

function DocumentsOfVersionTable({
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
			okText: t('yes'),
			cancelText: t('cancel'),
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
							`${RoutePaths.CREATE_MODULE_DOCUMENT.replace(`:${PathHolders.MODULE_VERSION_ID}`, versionId)}`,
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
											RoutePaths.MODIFY_MODULE_DOCUMENT.replace(
												`:${PathHolders.MODULE_DOCUMENT_ID}`,
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

const ModuleVersionDetailPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dialogs = useDialogs();
	// const dispatch = useDispatch();
	const [showDocumentTable, setShowDocumentTable] = useState(false);
	const notifications = useNotifications();
	const versionId = useParams()[PathHolders.MODULE_VERSION_ID];

	//moduleVersion
	const moduleVersion = useGetModuleVersionById(versionId!, {
		skip: !versionId,
	});
	useEffect(() => {
		if (moduleVersion.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, moduleVersion.isError, t]);

	const [deleteModuleVersionTrigger, deleteModuleVersion] =
		useDeleteModuleVersion();
	useEffect(() => {
		if (deleteModuleVersion.isError)
			notifications.show(t('deleteModuleVersionError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (deleteModuleVersion.isSuccess) {
			navigate(-1);
			notifications.show(t('deleteModuleVersionSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		}
	}, [
		deleteModuleVersion.isError,
		deleteModuleVersion.isSuccess,
		notifications,
		t,
		navigate,
	]);
	const handleDeleteModuleVersion = async (versionId: string) => {
		const confirmed = await dialogs.confirm(t('deleteModuleVersionConfirm'), {
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;

		await deleteModuleVersionTrigger(versionId);
	};

	//document
	const [documentQuery, setDocumentQuery] =
		useState<GetAllModuleDocumentQuery | null>({
			moduleVersionId: versionId!,
			moduleDocumentName: '',
			pageSize: 5,
			pageNumber: 0,
		});

	const moduleId = useParams()[PathHolders.MODULE_ID];
	const module = useGetModuleById(moduleId!, { skip: !moduleId });

	if (moduleVersion.isLoading) return <LinearProgress />;
	return (
		<Stack>
			<Stack alignItems={'center'}>
				<Typography variant="h5" textAlign="center">
					{module.data?.name ?? ''}
				</Typography>
				<Stack direction={'row'} spacing={3}>
					<Stack direction={'row'} spacing={1} alignItems={'center'}>
						<Typography variant="body2">{t('dateCreated')}:</Typography>
						<Typography variant="body2">
							{moduleVersion.data?.createdAt}
						</Typography>
					</Stack>
					<Stack direction={'row'} spacing={1} alignItems={'center'}>
						<Typography variant="body2">{t('lastUpdated')}: </Typography>
						<Typography variant="body2">
							{moduleVersion.data?.updatedAt}
						</Typography>
					</Stack>
				</Stack>
			</Stack>
			<Stack spacing={5} justifyContent={'space-between'}>
				<Stack>
					<Stack
						direction="row"
						alignItems="center"
						justifyContent={'space-between'}
					>
						<Box display="flex" alignItems="center">
							<Typography variant="body2">{t('version')}:</Typography>
							<Typography variant="body2" marginLeft={1}>
								{moduleVersion.data?.name}
							</Typography>
						</Box>

						<Box display="flex" alignItems="center">
							<Box>
								<IconButton
									color="primary"
									onClick={() =>
										navigate(
											RoutePaths.MODIFY_MODULE_VERSION.replace(
												`:${PathHolders.MODULE_VERSION_ID}`,
												versionId || '',
											),
										)
									}
								>
									<Edit />
								</IconButton>
								<IconButton
									color="error"
									onClick={async () =>
										handleDeleteModuleVersion(versionId || '')
									}
								>
									<Delete />
								</IconButton>
							</Box>
						</Box>
					</Stack>

					<Box>
						<Typography variant="body2">{t('description')}:</Typography>
						<TextEditor
							value={moduleVersion.data?.description ?? ''}
							readOnly
						/>
					</Box>
				</Stack>

				<Stack>
					<Stack
						direction={'row'}
						alignItems={'center'}
						justifyContent={'space-between'}
					>
						<Typography
							variant="body2"
							color="textSecondary"
							sx={{ opacity: 0.8 }}
						>
							{t('documentsOfVersion')}
						</Typography>
						<IconButton
							onClick={() => setShowDocumentTable(!showDocumentTable)}
						>
							{showDocumentTable ? (
								<KeyboardArrowUpIcon />
							) : (
								<KeyboardArrowDownIcon />
							)}
						</IconButton>
					</Stack>
					{!showDocumentTable && <Divider />}
					<Stack>
						{showDocumentTable && (
							<Stack mt={1}>
								<DocumentsOfVersionTable
									versionId={versionId ?? ''}
									documentQuery={documentQuery}
									onQueryChange={(query) => setDocumentQuery(query)}
								/>
							</Stack>
						)}
					</Stack>
				</Stack>
			</Stack>
		</Stack>
	);
};

export default ModuleVersionDetailPage;
