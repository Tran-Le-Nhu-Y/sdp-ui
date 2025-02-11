import Button from '@mui/material/Button';
import {
	CollapsibleTable,
	CollapsibleTableRow,
	FilterableTable,
	FilterAction,
	TextEditor,
} from '../../components';
import { useTranslation } from 'react-i18next';
import {
	Box,
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
	useDeleteProduct,
	useGetAllProductsByUserId,
	useGetAllVersionsByProductId,
} from '../../services';
import { useDialogs, useNotifications } from '@toolpad/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function ProductManagementPage() {
	const { t } = useTranslation('standard');
	const navigate = useNavigate();
	const notifications = useNotifications();
	const dialogs = useDialogs();

	const [productTablePage, setProductTablePage] = useState<TablePage>({
		pageNumber: 0,
		pageSize: 5,
	});
	const products = useGetAllProductsByUserId({
		userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
		...productTablePage,
	});
	useEffect(() => {
		if (products.isError)
			notifications.show(t('fetchError'), { severity: 'error' });
	}, [notifications, products.isError, t]);

	const [currVerProps, setCurrVerProps] = useState({
		productId: '',
		versionName: '',
		status: false,
		pageNumber: 0,
		pageSize: 5,
	});
	const versions = useGetAllVersionsByProductId(currVerProps);

	const [deleteProductTrigger, deleteProduct] = useDeleteProduct();
	useEffect(() => {
		if (deleteProduct.isError)
			notifications.show(t('deleteProductError'), { severity: 'error' });
		else if (deleteProduct.isSuccess)
			notifications.show(t('deleteProductSuccess'), { severity: 'success' });
	}, [deleteProduct.isError, deleteProduct.isSuccess, notifications, t]);
	const handleDelete = async (productId: string) => {
		const confirmed = await dialogs.confirm(t('deleteProductConfirm'), {
			okText: t('yes'),
			cancelText: t('cancel'),
		});
		if (!confirmed) return;

		await deleteProductTrigger(productId);
	};

	return (
		<Box>
			<Stack
				direction="row"
				justifyContent="space-between"
				alignItems="center"
				sx={{ marginBottom: 1 }}
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
					onClick={() => navigate('/create-product')}
				>
					{t('addProduct')}
				</Button>
			</Stack>

			{products.isLoading || (deleteProduct.isLoading && <LinearProgress />)}
			<CollapsibleTable
				headers={
					<>
						<TableCell key="name">{t('productName')}</TableCell>
						<TableCell key="createdAt" align="center">
							{t('dateCreated')}
						</TableCell>
						<TableCell key="updatedAt" align="center">
							{t('lastUpdated')}
						</TableCell>
						<TableCell key="status" align="center">
							{t('status')}
						</TableCell>
						<TableCell />
						<TableCell />
					</>
				}
				rows={products.data?.content ?? []}
				count={products.data?.totalElements ?? 0}
				pageNumber={productTablePage.pageNumber}
				pageSize={productTablePage.pageSize}
				onPageChange={(newPage) => setProductTablePage(newPage)}
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
								<TableCell align="center">{t(row.status)}</TableCell>
								<TableCell align="center">
									<IconButton
										onClick={() =>
											navigate(`${RoutePaths.MODIFY_PRODUCT}/${row.id}`)
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
										<TextEditor value={row.description} readOnly />
									</Stack>

									<div>
										<FilterableTable
											filterableCols={[
												{
													key: 'name',
													label: 'Phiên bản',
												},
												// {
												// 	key: 'createdAt',
												// 	label: 'Thời gian tạo',
												// },
												// {
												// 	key: 'updatedAt',
												// 	label: 'Cập nhật lần cuối',
												// },
												{
													key: 'status',
													label: 'Trạng thái',
												},
											]}
											headers={
												<>
													<TableCell key={`product-${row.id}-name`}>
														{t('productName')}
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
																<RemoveRedEyeIcon />
															</IconButton>
															<IconButton size="small" onClick={() => {}}>
																<EditIcon />
															</IconButton>
															<IconButton size="small" onClick={() => {}}>
																<DeleteIcon />
															</IconButton>
															{/* <Button size="small" onClick={() => {}}>
																	{t('seeDetail')}
																</Button>
																<Button size="small" onClick={() => {}}>
																	{t('edit')}
																</Button>
																<Button size="small" onClick={() => {}}>
																	{t('delete')}
																</Button> */}
														</Stack>
													</TableCell>
												</TableRow>
											)}
											count={versions?.data?.totalElements ?? 0}
											rows={versions?.data?.content ?? []}
											onAddFilter={() =>
												navigate(`/product/${row.id}/create-version`)
											}
											addButtonText={t('addVersion')}
											onPageChange={(newPage) =>
												setCurrVerProps({
													...currVerProps,
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
