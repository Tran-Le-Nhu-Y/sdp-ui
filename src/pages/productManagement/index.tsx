import Button from '@mui/material/Button';
import {
	CollapsibleTable,
	CollapsibleTableRow,
	FilterableTable,
	FilterAction,
	TextEditor,
} from '../../components';
import { useTranslation } from 'react-i18next';
import { Box, IconButton, Stack, TableCell, Typography } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import {
	deleteProductById,
	selectAllProducts,
} from '../../redux/slices/ProductSlice';
import { useAppSelector } from '../../hooks/useRedux';
import { useDispatch } from 'react-redux';
import { selectAllProductVersions } from '../../redux/slices/ProductVersionSlice';
import { Column } from '../../components/FilterableTable';

export default function ProductManagementPage() {
	const { t } = useTranslation('standard');
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const products = useAppSelector(selectAllProducts);
	// const { data, error, isLoading } = useGetAllProductsByUserId(
	// 	'd28bf637-280e-49b5-b575-5278b34d1dfe',
	// );
	const productVersions = useAppSelector(selectAllProductVersions);

	const handleDelete = (id: string) => {
		dispatch(deleteProductById(id));
		alert(`Đã xóa sản phẩm ${id}`);
	};

	const columns: Column[] = [
		{ key: 'version', label: 'Phiên bản', filterable: true },
		{ key: 'createdAt', label: 'Thời gian tạo', filterable: true },
		{ key: 'updatedAt', label: 'Cập nhật lần cuối', filterable: true },
		{ key: 'status', label: 'Trạng thái', filterable: true },
	];
	const handleAction = (action: string, rowData: object) => {
		console.log(action, rowData);
	};

	// if (data == undefined) return <></>;

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
				<Button variant="contained" onClick={() => navigate('/create-product')}>
					{t('addProduct')}
				</Button>
			</Stack>

			<CollapsibleTable
				headers={
					<>
						<TableCell>{t('productName')}</TableCell>
						<TableCell align="center">{t('dateCreated')}</TableCell>
						<TableCell align="center">{t('lastUpdated')}</TableCell>
						<TableCell align="center">{t('status')}</TableCell>
						<TableCell />
						<TableCell />
					</>
				}
				rows={products}
				getCell={(row) => (
					<CollapsibleTableRow
						key={row.id}
						cells={
							<>
								<TableCell align="justify" component="th" scope="row">
									{row.name}
								</TableCell>
								<TableCell align="center">
									{row.dateCreated.toLocaleString()}
								</TableCell>
								<TableCell align="center">
									{row.lastUpdated.toLocaleString()}
								</TableCell>
								<TableCell align="center">{row.status}</TableCell>
								<TableCell align="center">
									<IconButton
										onClick={() => navigate(`/modify-product/${row.id}`)}
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
										<TextEditor value={row.description} readOnly />
									</Stack>

									<div>
										<FilterableTable
											columns={columns}
											data={productVersions.filter(
												(version) => version.productId === row.id,
											)}
											onAction={handleAction}
											onButtonAdd={() =>
												navigate(`/product/${row.id}/create-version`)
											}
											addButtonText={t('addVersion')}
											filterableColumns={['version', 'status']}
										/>
									</div>
								</Box>
							</>
						}
					/>
				)}
			/>
		</Box>
	);
}
