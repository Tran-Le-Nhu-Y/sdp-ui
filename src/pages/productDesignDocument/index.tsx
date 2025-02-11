import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FilterableTable } from '../../components';
import { useEffect, useState } from 'react';
import {
	deleteDeployDocumentById,
	selectAllDeployDocuments,
} from '../../redux/slices/DeployDocumentSlice';
// import { useNotifications } from '@toolpad/core';
import {
	IconButton,
	LinearProgress,
	Stack,
	TableCell,
	TableRow,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import { useDispatch, useSelector } from 'react-redux';
import { selectProductById } from '../../redux/slices/ProductSlice';
import { RootState } from '../../redux/store';

function useProductDetails(productId: string) {
	return useSelector((state: RootState) => selectProductById(state, productId));
}

export default function ProductDesignDocumentPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const [deployTablePage, setDeployTablePage] = useState<TablePage>({
		pageNumber: 0,
		pageSize: 5,
	});

	const deployDocuments = useSelector(selectAllDeployDocuments);
	const [loading, setLoading] = useState(true);

	// Giả lập API loading (nếu sau này có async API call thì thay bằng Redux Thunk hoặc RTK Query)
	useEffect(() => {
		setLoading(false); // Giả sử dữ liệu đã được lấy xong
	}, []);

	// const notifications = useNotifications();
	// useEffect(() => {
	// 	if (deployDocuments.error)
	// 		notifications.show(t('fetchError'), { severity: 'error' });
	// }, [notifications, deployDocuments.error, t]);

	const handleDelete = (id: string) => {
		const confirmDelete = window.confirm(
			`Bạn có chắc chắn muốn xóa deployment ${id}?`,
		);
		if (confirmDelete) {
			dispatch(deleteDeployDocumentById(id));
			alert(`Đã xóa deployment ${id}`);
		}
	};

	// useEffect(() => {
	// 	async function fetchData() {
	// 		const productRes = await fetch(`/api/products/${row.productId}`);
	// 		const product = await productRes.json();

	// 		const moduleRes = await fetch(`/api/modules/${row.moduleId}`);
	// 		const module = await moduleRes.json();

	// 		setProductName(product.name);
	// 		setProductVersion(product.version);
	// 		setModuleName(module.name);
	// 		setModuleVersion(module.version);
	// 	}

	// 	fetchData();
	// }, [row.productId, row.moduleId]);

	return (
		<div>
			{loading ? (
				<LinearProgress />
			) : (
				<FilterableTable
					filterableCols={[
						{
							key: 'name',
							label: 'Phiên bản',
						},
					]}
					headers={
						<>
							<TableCell key={`label`}>{t('documentLabel')}</TableCell>
							<TableCell key={`name`}>{t('documentName')}</TableCell>
							<TableCell key={`createAt`} align="center">
								{t('dateCreated')}
							</TableCell>
							<TableCell key={`updateAt`} align="center">
								{t('lastUpdated')}
							</TableCell>
							<TableCell key={`productName`} align="center">
								{t('productName')}
							</TableCell>
							<TableCell />
							<TableCell />
						</>
					}
					count={deployDocuments.length ?? 0}
					rows={deployDocuments.map((row) => {
						// eslint-disable-next-line react-hooks/rules-of-hooks
						const product = useProductDetails(row.productId);
						return { ...row, product };
					})}
					pageNumber={deployTablePage.pageNumber}
					pageSize={deployTablePage.pageSize}
					onPageChange={(newPage) => setDeployTablePage(newPage)}
					onAddFilter={() => navigate(`/create-deploy-document`)}
					addButtonText={t('addDocument')}
					getCell={(row) => (
						<TableRow key={row.id}>
							<TableCell key={`name`}>{row.name}</TableCell>
							<TableCell key={`productName`} align="center">
								{row.product.name || 'N/A'}
							</TableCell>
							<TableCell key={`productVer`} align="center">
								{/* {product?.version || 'N/A'} */}
							</TableCell>
							<TableCell key={`moduleName`} align="center">
								{/* {row.moduleName} */}
							</TableCell>
							<TableCell key={`moduleVer`} align="center">
								{/* {row.moduleVersion} */}
							</TableCell>
							<TableCell key={`createAt`} align="center">
								{row.createdAt}
							</TableCell>
							<TableCell key={`updateAt`} align="center">
								{row.updatedAt}
							</TableCell>
							<TableCell>
								<Stack direction="row">
									<IconButton size="small" onClick={() => {}}>
										<RemoveRedEyeIcon />
									</IconButton>
									<IconButton size="small" onClick={() => {}}>
										<EditIcon />
									</IconButton>
									<IconButton size="small" onClick={() => handleDelete(row.id)}>
										<DeleteIcon />
									</IconButton>
								</Stack>
							</TableCell>
						</TableRow>
					)}
				/>
			)}
		</div>
	);
}
