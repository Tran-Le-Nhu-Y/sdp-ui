import Button from '@mui/material/Button';
import {
	CollapsibleTable,
	CollapsibleTableRow,
	FilterAction,
} from '../../components';
import { useTranslation } from 'react-i18next';
import {
	Box,
	IconButton,
	Stack,
	TableCell,
	TextField,
	Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from 'react-router-dom';
import {
	deleteProductById,
	selectAllProducts,
} from '../../redux/slices/ProductSlice';
import { useAppSelector } from '../../hooks/useRedux';
import { useDispatch } from 'react-redux';

function InnerTable() {
	const { t } = useTranslation('standard');
	function createData(
		version: string,
		dateCreated: string,
		lastUpdated: string,
		status: string,
	) {
		return { version, dateCreated, lastUpdated, status };
	}

	const rows = [
		createData(
			'1.0',
			'12:30:45 10/12/2024',
			'12:30:45 10/12/2024',
			'Đang hoạt động',
		),
	].sort((a, b) => (a.version < b.version ? -1 : 1));

	return (
		<CollapsibleTable
			headers={
				<>
					<TableCell align="center">{t('version')}</TableCell>
					<TableCell align="center">{t('dateCreated')}</TableCell>
					<TableCell align="center">{t('lastUpdated')}</TableCell>
					<TableCell align="center">{t('status')}</TableCell>
					<TableCell />
				</>
			}
			rows={rows}
			getCell={(row) => (
				<CollapsibleTableRow
					key={row.version}
					cells={
						<>
							<TableCell align="center" component="th" scope="row">
								{row.version}
							</TableCell>
							<TableCell align="center">{row.dateCreated}</TableCell>
							<TableCell align="center">{row.lastUpdated}</TableCell>
							<TableCell align="center">{row.status}</TableCell>
							<TableCell align="right">
								<Stack direction="row" justifyContent={'flex-end'}>
									<Button>{t('seeDetail')}</Button>
									<Button>{t('edit')}</Button>
									<Button>{t('delete')}</Button>
								</Stack>
							</TableCell>
						</>
					}
				/>
			)}
		/>
	);
}

export default function ProductManagementPage() {
	const { t } = useTranslation('standard');
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const products = useAppSelector(selectAllProducts);

	const handleDelete = (id: string) => {
		dispatch(deleteProductById(id));
		alert(`Đã xóa sản phẩm ${id}`);
	};

	// const handleModifyProduct = () => {

	// }

	return (
		<Box>
			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				sx={{ marginBottom: 1 }}
			>
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
								<TableCell align="center">{row.dateCreated}</TableCell>
								<TableCell align="center">{row.lastUpdated}</TableCell>
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
									ID: 3b5af8db-09ed-4e92-910b-f6889c55cdef
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
									<TextField
										id="outlined-multiline-static"
										label={t('description')}
										multiline
										rows={10}
										defaultValue={row.description}
										sx={{
											width: '100%',
										}}
										disabled
									/>
									<Stack
										direction="row"
										alignItems={'center'}
										justifyContent={'space-between'}
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
										{/* <TableInDetail /> */}
										<Button
											variant="contained"
											size="large"
											onClick={() => navigate('/create-version-product')}
										>
											{t('addVersion')}
										</Button>
									</Stack>
									<InnerTable />
								</Box>
							</>
						}
					/>
				)}
			/>
		</Box>
	);
}
