import { useTranslation } from 'react-i18next';
import FilterableTable from '../../components/FilterableTable';
import { useNavigate } from 'react-router-dom';

export default function DeployManagementPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const columns = [
		{ key: 'id', label: 'ID', filterable: true },
		{ key: 'name', label: 'Tên tài liệu', filterable: true },
		{ key: 'product', label: 'Tên sản phẩm', filterable: true },
		{ key: 'version', label: 'Phiên bản sản phẩm', filterable: true },
		{ key: 'module', label: 'Tên module', filterable: true },
		{ key: 'moduleVersion', label: 'Phiên bản module', filterable: true },
		{ key: 'createdAt', label: 'Thời gian tạo', filterable: false },
		{ key: 'updatedAt', label: 'Cập nhật lần cuối', filterable: false },
	];

	const data = [
		{
			id: '1',
			name: 'Document A',
			product: 'TLNY',
			version: '1.0',
			module: 'Module A',
			moduleVersion: '2.1',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
		},
		{
			id: '2',
			name: 'Document C',
			product: 'ADADG X',
			version: '1.0',
			module: 'Module A',
			moduleVersion: '1.1',
			createdAt: '2024-01-20',
			updatedAt: '2025-01-21',
		},
		{
			id: '3',
			name: 'Document D',
			product: 'Product xyz',
			version: '1.0',
			module: 'Module A',
			moduleVersion: '1.5',
			createdAt: '2023-01-20',
			updatedAt: '2025-01-25',
		},
		{
			id: '14',
			name: 'Tran Le Nhu Y',
			product: 'Product X',
			version: '1.29.0',
			module: 'Module A',
			moduleVersion: '9.1',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
		},
		{
			id: '6',
			name: 'Document',
			product: 'Product Y',
			version: '1.0',
			module: 'Module A',
			moduleVersion: '6.9',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
		},
		{
			id: '88',
			name: 'A',
			product: 'Product abc',
			version: '1.0',
			module: 'Module A',
			moduleVersion: '1.1',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
		},
		{
			id: '9',
			name: 'Document b',
			product: 'Product X',
			version: '1.0',
			module: 'Module A',
			moduleVersion: '1.1',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
		},
		{
			id: '10',
			name: 'Document B',
			product: 'Product X',
			version: '1.0',
			module: 'Module A',
			moduleVersion: '1.1',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
		},
		{
			id: '6',
			name: 'Document',
			product: 'Product Y',
			version: '1.0',
			module: 'Module A',
			moduleVersion: '1.1',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
		},
	];
	const handleAction = (
		action: string,
		rowData: Record<string, string | number | boolean | Date>
	) => {
		console.log(action, rowData);
	};

	return (
		<div>
			<FilterableTable
				columns={columns}
				data={data}
				onAction={handleAction}
				onButtonAdd={() => navigate('/create-deploy-document')}
				addButtonText={t('addDocument')}
				filterableColumns={[
					'id',
					'name',
					'product',
					'version',
					'module',
					'moduleVersion',
				]}
			/>
		</div>
	);
}
