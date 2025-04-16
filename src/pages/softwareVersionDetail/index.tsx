import {
	Typography,
	IconButton,
	Stack,
	Box,
	TableCell,
	Button,
	Divider,
	LinearProgress,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useTranslation } from 'react-i18next';
import {
	CollapsibleTable,
	CollapsibleTableRow,
	FilterDialog,
	ReadonlyTextEditor,
} from '../../components';
import { Delete, Edit } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	useDeleteModule,
	useDeleteSoftwareVersion,
	useGetAllModuleBySoftwareVersionId,
	useGetSoftwareById,
	useGetSoftwareVersionById,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { HideDuration, PathHolders, RoutePaths } from '../../utils';
import DocumentsOfVersionTable from './DocumentsOfVersionTable';
import ModuleVersionInner from './ModuleVersionInner';

const SoftwareVersionDetailPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dialogs = useDialogs();
	const [showDocumentTable, setShowDocumentTable] = useState(false);
	const notifications = useNotifications();
	const versionId = useParams()[PathHolders.SOFTWARE_VERSION_ID];
	const [filterDialogOpen, setFilterDialogOpen] = useState(false);

	//softwareVersion
	const softwareVersion = useGetSoftwareVersionById(versionId!, {
		skip: !versionId,
	});
	useEffect(() => {
		if (softwareVersion.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
	}, [notifications, softwareVersion.isError, t]);

	const [deleteSoftwareVersionTrigger, deleteSoftwareVersion] =
		useDeleteSoftwareVersion();
	useEffect(() => {
		if (deleteSoftwareVersion.isError)
			notifications.show(t('deleteSoftwareVersionError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (deleteSoftwareVersion.isSuccess) {
			navigate(-1);
			notifications.show(t('deleteSoftwareVersionSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
		}
	}, [
		deleteSoftwareVersion.isError,
		deleteSoftwareVersion.isSuccess,
		notifications,
		t,
		navigate,
	]);
	const handleDeleteSoftwareVersion = async (versionId: string) => {
		const confirmed = await dialogs.confirm(t('deleteSoftwareVersionConfirm'), {
			title: t('deleteConfirm'),
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;

		await deleteSoftwareVersionTrigger(versionId);
	};

	const softwareId = useParams()[PathHolders.SOFTWARE_ID];
	const software = useGetSoftwareById(softwareId!, { skip: !softwareId });

	//document
	const [documentQuery, setDocumentQuery] =
		useState<GetAllSoftwareDocumentQuery | null>({
			softwareVersionId: versionId!,
			softwareDocumentName: '',
			pageSize: 5,
			pageNumber: 0,
		});

	//module
	const [moduleQuery, setModuleQuery] = useState<GetAllModuleQuery>({
		softwareVersionId: versionId!,
		moduleName: '',
		pageNumber: 0,
		pageSize: 6,
	});
	const modules = useGetAllModuleBySoftwareVersionId(moduleQuery!, {
		skip: !moduleQuery,
	});
	useEffect(() => {
		if (modules.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		// else if (software.isSuccess && software.data?.content.length === 0)
		// 	notifications.show(t('noProduct'), { severity: 'info' });
	}, [notifications, modules.isError, t]);

	const [moduleVersionQuery, setModuleVersionQuery] =
		useState<GetAllModuleVersionQuery | null>(null);

	const [deleteModuleTrigger, deleteModule] = useDeleteModule();
	useEffect(() => {
		if (deleteModule.isError)
			notifications.show(t('deleteModuleError'), {
				severity: 'error',
				autoHideDuration: HideDuration.fast,
			});
		else if (deleteModule.isSuccess)
			notifications.show(t('deleteModuleSuccess'), {
				severity: 'success',
				autoHideDuration: HideDuration.fast,
			});
	}, [deleteModule.isError, deleteModule.isSuccess, notifications, t]);
	const handleDeleteModule = async (moduleId: string) => {
		const confirmed = await dialogs.confirm(t('deleteModuleConfirm'), {
			title: t('deleteConfirm'),
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;

		await deleteModuleTrigger(moduleId);
	};

	if (softwareVersion.isLoading) return <LinearProgress />;
	return (
		<Stack>
			<Stack alignItems={'center'}>
				<Typography variant="h5" textAlign="center">
					{software.data?.name ?? ''}
				</Typography>
				<Stack direction={'row'} spacing={3}>
					<Stack direction={'row'} spacing={1} alignItems={'center'}>
						<Typography variant="body2">{t('dateCreated')}:</Typography>
						<Typography variant="body2">
							{softwareVersion.data?.createdAt}
						</Typography>
					</Stack>
					<Stack direction={'row'} spacing={1} alignItems={'center'}>
						<Typography variant="body2">{t('lastUpdated')}: </Typography>
						<Typography variant="body2">
							{softwareVersion.data?.updatedAt}
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
								{softwareVersion.data?.name}
							</Typography>
						</Box>

						<Box display="flex" alignItems="center">
							<Box>
								<IconButton
									color="primary"
									onClick={() =>
										navigate(
											RoutePaths.MODIFY_SOFTWARE_VERSION.replace(
												`:${PathHolders.SOFTWARE_VERSION_ID}`,
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
										handleDeleteSoftwareVersion(versionId || '')
									}
								>
									<Delete />
								</IconButton>
							</Box>
						</Box>
					</Stack>

					<Box>
						<Typography variant="body2">{t('description')}:</Typography>
						<ReadonlyTextEditor
							data={softwareVersion.data?.description ?? ''}
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

				<Box>
					<Stack
						direction="row"
						justifyContent="space-between"
						alignItems="center"
						sx={{ marginBottom: 2 }}
					>
						<FilterDialog
							filters={[
								{
									key: 'moduleName',
									label: t('moduleName'),
								},
							]}
							open={filterDialogOpen}
							onClose={() => setFilterDialogOpen(false)}
							onOpen={() => setFilterDialogOpen(true)}
							onApply={(filters) => {
								const query: object = filters.reduce((pre, curr) => {
									return { ...pre, [curr.key]: curr.value };
								}, {});
								setModuleQuery((prev) => ({ ...prev, ...query }));
							}}
							onReset={() => {
								setModuleQuery((prev) => ({ ...prev, moduleName: '' }));
							}}
						/>
						<Button
							variant="contained"
							onClick={() =>
								navigate(
									RoutePaths.CREATE_MODULE.replace(
										`:${PathHolders.SOFTWARE_VERSION_ID}`,
										versionId!,
									),
								)
							}
						>
							{t('addModule')}
						</Button>
					</Stack>

					<CollapsibleTable
						headers={
							<>
								<TableCell key="name">{t('moduleName')}</TableCell>
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
						rows={modules.data?.content ?? []}
						count={modules.data?.totalElements ?? 0}
						pageNumber={moduleQuery?.pageNumber}
						pageSize={moduleQuery?.pageSize}
						onPageChange={(newPage) =>
							setModuleQuery((prev) => {
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
										<TableCell align="center">{row.updatedAt}</TableCell>
										<TableCell align="center">
											<IconButton
												onClick={() =>
													navigate(
														RoutePaths.MODIFY_MODULE.replace(
															`:${PathHolders.MODULE_ID}`,
															row.id,
														),
													)
												}
											>
												<EditIcon color="info" />
											</IconButton>
											<IconButton onClick={() => handleDeleteModule(row.id)}>
												<DeleteIcon color="error" />
											</IconButton>
										</TableCell>
									</>
								}
								inner={
									<>
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
												<ReadonlyTextEditor data={row.description ?? ''} />
											</Stack>
										</Box>
										<ModuleVersionInner
											moduleId={row.id}
											moduleVersionQuery={moduleVersionQuery}
											onQueryChange={(query) => setModuleVersionQuery(query)}
										/>
									</>
								}
								onExpand={() => {
									setModuleVersionQuery({
										moduleId: row.id,
										moduleVersionName: '',
										pageNumber: 0,
										pageSize: 5,
									});
								}}
							/>
						)}
					/>
					{/* )} */}
				</Box>
			</Stack>
		</Stack>
	);
};

export default SoftwareVersionDetailPage;
