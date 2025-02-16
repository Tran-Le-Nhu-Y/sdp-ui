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
	useGetAllSoftwareByUserId,
	useGetAllVersionsByProductId,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { hideDuration, PathHolders, RoutePaths } from '../../utils';

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

	const [currVerProps, setCurrVerProps] = useState<{
		productId: string;
		versionName: string;
		status: boolean;
		pageNumber: number;
		pageSize: number;
	} | null>(null);
	const versions = useGetAllVersionsByProductId(currVerProps!, {
		skip: !currVerProps,
	});

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

			{/* <Box width="100%" display="flex" justifyContent="end">
				<Button
					variant="contained"
					onClick={() => navigate(RoutePaths.CREATE_SOFTWARE)}
				>
					{t('addSoftware')}
				</Button>
			</Box> */}

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
						{/* <TableCell key="status" align="center">
							{t('status')}
						</TableCell> */}
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

									<div>
										<PaginationTable
											// filterableCols={[
											// 	{
											// 		key: 'name',
											// 		label: 'Phiên bản',
											// 	},
											// 	{
											// 		key: 'status',
											// 		label: 'Trạng thái',
											// 	},
											// ]}
											headers={
												<>
													<TableCell key={`product-${row.id}-name`}>
														{t('softwareName')}
													</TableCell>
													<TableCell
														key={`product-${row.id}-createdAt`}
														align="center"
													>
														{t('dateCreated')}
													</TableCell>
													<TableCell
														key={`product-${row.id}-updatedAt`}
														align="center"
													>
														{t('lastUpdated')}
													</TableCell>
													<TableCell
														key={`product-${row.id}-status`}
														align="center"
													>
														{t('status')}
													</TableCell>
													<TableCell />
													<TableCell />
												</>
											}
											getCell={(row) => (
												<TableRow key={`product_verion-${row.id}`}>
													<TableCell>{row.name}</TableCell>
													<TableCell align="center">{row.createdAt}</TableCell>
													<TableCell align="center">{row.updatedAt}</TableCell>
													<TableCell align="center">{t(row.status)}</TableCell>
													<TableCell>
														<Stack direction="row">
															<IconButton size="small" onClick={() => {}}>
																<RemoveRedEyeIcon color="info" />
															</IconButton>
															<IconButton size="small" onClick={() => {}}>
																<EditIcon color="info" />
															</IconButton>
															<IconButton size="small" onClick={() => {}}>
																<DeleteIcon color="error" />
															</IconButton>
														</Stack>
													</TableCell>
												</TableRow>
											)}
											count={versions?.data?.totalElements ?? 0}
											rows={versions?.data?.content ?? []}
											// onAddClick={() =>
											// 	navigate(`/product/${row.id}/create-version`)
											// }
											addButtonText={t('addVersion')}
											onPageChange={(newPage) =>
												setCurrVerProps({
													productId: row.id,
													versionName: currVerProps?.versionName ?? '',
													status: currVerProps?.status ?? false,
													...newPage,
												})
											}
										/>
									</div>
								</Box>
							</>
						}
						onExpand={() => {
							setCurrVerProps({
								productId: row.id,
								versionName: '',
								status: false,
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
