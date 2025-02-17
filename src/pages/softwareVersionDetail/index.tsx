/* eslint-disable @typescript-eslint/no-unused-vars */
// import { useEffect, useState } from 'react';
import {
	Typography,
	IconButton,
	Stack,
	Box,
	TableCell,
	TableRow,
	Button,
	Divider,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useTranslation } from 'react-i18next';
import {
	CollapsibleTable,
	CollapsibleTableRow,
	PaginationTable,
	FilterAction,
	TextEditor,
	FilterDialog,
} from '../../components';
import { Delete, Edit } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	useDeleteSoftwareVersion,
	useGetSoftwareVersionById,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { hideDuration, PathHolders, RoutePaths } from '../../utils';
// import { useDispatch, useSelector } from 'react-redux';
// import { selectAllFiles } from '../../redux/slices/FileSlice';
// import { useNavigate } from 'react-router-dom';
// import {
// 	deleteModuleById,
// 	selectAllModules,
// } from '../../redux/slices/ModuleSlice';

function DocumentsOfVersionTable({
	versionId,
	documentQuery,
	onQueryChange,
}: {
	versionId: string;
	documentQuery: GetAllSoftwareVersionQuery | null;
	onQueryChange: (query: GetAllSoftwareVersionQuery | null) => void;
}) {
	//const navigate = useNavigate();
	const { t } = useTranslation('standard');
	//const notifications = useNotifications();
	//const dialogs = useDialogs();
	const [filterVersionDialogOpen, setFilterVersionDialogOpen] = useState(false);

	const documents = [
		{
			id: '1',
			type: 'DTYC',
			name: 'A',
			createAt: '01/01/2025',
			updateAt: '01/01/2025',
		},
		{
			id: '2',
			type: 'DTYC',
			name: 'B',
			createAt: '01/01/2025',
			updateAt: '01/01/2025',
		},
		{
			id: '3',
			type: 'DTYC',
			name: 'C',
			createAt: '01/01/2025',
			updateAt: '01/01/2025',
		},
	];

	const handleDelete = (id: string) => {
		alert(`Xóa khách hàng có ID: ${id}`);
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
						onQueryChange({
							...documentQuery,
							softwareId: versionId,
							...query,
						});
					}}
					onReset={() => {
						onQueryChange({
							softwareId: versionId,
							...documentQuery,
							versionName: '',
						});
					}}
				/>
				<Button
					variant="contained"
					onClick={
						() => {}
						// navigate(
						// 	`${RoutePaths.CREATE_SOFTWARE_VERSION.replace(`:${PathHolders.SOFTWARE_ID}`, softwareId)}`,
						// )
					}
				>
					{t('addSoftwareVersion')}
				</Button>
			</Stack>
			{/* {deleteSoftwareVersion.isLoading && <LinearProgress />} */}
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
				count={documents.length ?? 0}
				rows={documents}
				onPageChange={(newPage) =>
					onQueryChange({
						softwareId: versionId,
						versionName: documentQuery?.versionName ?? '',
						...newPage,
					})
				}
				getCell={(row) => (
					<TableRow key={`software_verion-${row.id}`}>
						<TableCell>{row.type}</TableCell>
						<TableCell>{row.name}</TableCell>
						<TableCell align="center">{row.createAt}</TableCell>
						<TableCell align="center">{row.updateAt}</TableCell>
						<TableCell>
							<Stack direction="row">
								<IconButton
									size="small"
									onClick={
										() => {}
										// navigate(
										// 	RoutePaths.SOFTWARE_VERSION_DETAIL.replace(
										// 		`:${PathHolders.SOFTWARE_VERSION_ID}`,
										// 		row.id,
										// 	),
										// )
									}
								>
									<RemoveRedEyeIcon color="info" />
								</IconButton>
								<IconButton
									size="small"
									onClick={
										() => {}
										// navigate(
										// 	RoutePaths.MODIFY_SOFTWARE_VERSION.replace(
										// 		`:${PathHolders.SOFTWARE_VERSION_ID}`,
										// 		row.id,
										// 	),
										// )
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

const SoftwareVersionDetailPage = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dialogs = useDialogs();
	// const dispatch = useDispatch();
	const [showDocumentTable, setShowDocumentTable] = useState(false);
	const notifications = useNotifications();
	const versionId = useParams()[PathHolders.SOFTWARE_VERSION_ID];
	const softwareVersion = useGetSoftwareVersionById(versionId!, {
		skip: !versionId,
	});
	useEffect(() => {
		if (softwareVersion.isError)
			notifications.show(t('fetchError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
	}, [notifications, softwareVersion.isError, t]);

	const [moduleTablePage, setModuleTablePage] = useState<TablePage>({
		pageNumber: 0,
		pageSize: 5,
	});

	const modules = [
		{
			id: '1',
			name: 'A',
			createAt: '01/01/2025',
			updateAt: '01/01/2025',
		},
		{
			id: '2',
			name: 'B',
			createAt: '01/01/2025',
			updateAt: '01/01/2025',
		},
		{
			id: '3',
			name: 'C',
			createAt: '01/01/2025',
			updateAt: '01/01/2025',
		},
	];

	const [deleteSoftwareVersionTrigger, deleteSoftwareVersion] =
		useDeleteSoftwareVersion();
	useEffect(() => {
		if (deleteSoftwareVersion.isError)
			notifications.show(t('deleteSoftwareVersionError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		else if (deleteSoftwareVersion.isSuccess) {
			navigate(-1);
			notifications.show(t('deleteSoftwareVersionSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
		}
	}, [
		deleteSoftwareVersion.isError,
		deleteSoftwareVersion.isSuccess,
		notifications,
		t,
		navigate,
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
		<Stack>
			<Stack alignItems={'center'}>
				<Typography variant="h5" textAlign="center">
					Tên sản phẩm ở đây
				</Typography>
				<Typography variant="caption" textAlign="center" color="textSecondary">
					ID: {softwareVersion.data?.id}
				</Typography>
				<Stack direction={'row'} spacing={2}>
					<Typography variant="body2">
						Ngày tạo: <strong>{softwareVersion.data?.createdAt}</strong>
					</Typography>
					<Typography variant="body2">
						Cập nhật lần cuối:{' '}
						<strong>{softwareVersion.data?.updatedAt}</strong>
					</Typography>
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
							<Typography variant="body2">Phiên bản:</Typography>
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
									onClick={async () => handleDelete(versionId || '')}
								>
									<Delete />
								</IconButton>
							</Box>
						</Box>
					</Stack>

					<Box>
						<Typography variant="body2">Mô tả:</Typography>
						<TextEditor
							value={softwareVersion.data?.description ?? ''}
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
									versionId={''}
									documentQuery={null}
									onQueryChange={function (
										_query: GetAllSoftwareVersionQuery | null,
									): void {
										throw new Error('Function not implemented.');
									}} // versionId={row.id}
									// documentQuery={versionQuery}
									// onQueryChange={(query) => setVersionQuery(query)}
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
						<FilterAction
							entries={[
								{ value: 'test', label: 'Test' },
								{ value: 'test2', label: 'Test2' },
							]}
							onFilterClick={(value, entry) => {
								console.log(value, entry);
							}}
						/>
						<Button
							variant="contained"
							// onClick={() => navigate(RoutePaths.CREATE_PRODUCT)}
							onClick={
								() => {}
								//navigate('/create-module')
							}
						>
							{t('addModule')}
						</Button>
					</Stack>

					{/* {loading ? (
						<LinearProgress />
					) : ( */}
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
						rows={modules}
						count={modules.length ?? 0}
						pageNumber={moduleTablePage.pageNumber}
						pageSize={moduleTablePage.pageSize}
						onPageChange={(newPage) => setModuleTablePage(newPage)}
						getCell={(row) => (
							<CollapsibleTableRow
								key={row.id}
								cells={
									<>
										<TableCell align="justify" component="th" scope="row">
											{row.name}
										</TableCell>
										<TableCell align="center">{row.createAt}</TableCell>
										<TableCell align="center">{row.updateAt ?? ''}</TableCell>
										<TableCell align="center">
											<IconButton
												onClick={
													() => {}
													//navigate(`${RoutePaths.MODIFY_PRODUCT}/${row.id}`)
												}
											>
												<EditIcon color="info" />
											</IconButton>
											<IconButton onClick={() => handleDelete(row.id)}>
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
												<TextEditor value={'row.description'} readOnly />
											</Stack>

											<PaginationTable
												// filterableCols={[
												// 	{
												// 		key: 'name',
												// 		label: 'Phiên bản',
												// 	},
												// ]}
												headers={
													<>
														<TableCell key={`name`}>
															{t('documentName')}
														</TableCell>
														<TableCell key={`productName`} align="center">
															{t('productName')}
														</TableCell>
														<TableCell key={`productVer`} align="center">
															{t('version')}
														</TableCell>
														<TableCell key={`moduleName`} align="center">
															{t('moduleName')}
														</TableCell>
														<TableCell key={`moduleVer`} align="center">
															{t('version')}
														</TableCell>
														<TableCell key={`createAt`} align="center">
															{t('dateCreated')}
														</TableCell>
														<TableCell key={`updateAt`} align="center">
															{t('lastUpdated')}
														</TableCell>
														<TableCell />
														<TableCell />
													</>
												}
												count={modules.length ?? 0}
												rows={modules}
												pageNumber={moduleTablePage.pageNumber}
												pageSize={moduleTablePage.pageSize}
												onPageChange={(newPage) => setModuleTablePage(newPage)}
												//onAddClick={() => navigate(`/create-deploy-document`)}
												//addButtonText={t('addDocument')}
												getCell={(row) => (
													<TableRow key={row.id}>
														<TableCell key={`moduleName`}>{row.name}</TableCell>
														<TableCell key={`createAt`} align="center">
															"row.createdAt"
														</TableCell>
														<TableCell key={`updateAt`} align="center">
															"row.updatedAt"
														</TableCell>
														<TableCell
															key={`moduleStatus`}
															align="center"
														></TableCell>
														<TableCell>
															<Stack direction="row">
																<IconButton size="small" onClick={() => {}}>
																	<RemoveRedEyeIcon />
																</IconButton>
																<IconButton size="small" onClick={() => {}}>
																	<EditIcon />
																</IconButton>
																<IconButton
																	size="small"
																	onClick={() => handleDelete(row.id)}
																>
																	<DeleteIcon />
																</IconButton>
															</Stack>
														</TableCell>
													</TableRow>
												)}
											/>
										</Box>
									</>
								}
								// onExpand={() => {
								// 	setCurrVerProps({
								// 		productId: row.id,
								// 		versionName: '',
								// 		status: false,
								// 		pageNumber: 0,
								// 		pageSize: 5,
								// 	});
								// }}
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
