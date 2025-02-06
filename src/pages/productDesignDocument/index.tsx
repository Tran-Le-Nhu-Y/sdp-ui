import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { FilterableTable } from '../../components';

export default function ProductDesignDocumentPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const columns = [
		{ key: 'id', label: 'ID', filterable: false },
		{ key: 'label', label: 'Nhãn tài liệu', filterable: false },
		{ key: 'name', label: 'Tên tài liệu', filterable: true },
		{ key: 'createdAt', label: 'Thời gian tạo', filterable: false },
		{ key: 'updatedAt', label: 'Cập nhật lần cuối', filterable: false },
		{ key: 'product', label: 'Tên sản phẩm', filterable: true },
	];

	const data = [
		{
			id: '1',
			label: 'aaa',
			name: 'Document A',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
			product: 'TLNY',
		},
		{
			id: '1',
			label: 'aaa',
			name: 'Document A',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
			product: 'TLNY',
		},
		{
			id: '1',
			label: 'aaa',
			name: 'Document A',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
			product: 'TLNY',
		},
		{
			id: '1',
			label: 'aaa',
			name: 'Document A',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
			product: 'TLNY',
		},
		{
			id: '1',
			label: 'aaa',
			name: 'Document A',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
			product: 'TLNY',
		},
		{
			id: '1',
			label: 'aaa',
			name: 'Document A',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
			product: 'TLNY',
		},
		{
			id: '1',
			label: 'aaa',
			name: 'Document A',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
			product: 'TLNY',
		},
		{
			id: '1',
			label: 'aaa',
			name: 'Document A',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
			product: 'TLNY',
		},
		{
			id: '1',
			label: 'aaa',
			name: 'Document A',
			createdAt: '2025-01-20',
			updatedAt: '2025-01-21',
			product: 'TLNY',
		},
	];
	const handleAction = (
		action: string,
		rowData: Record<string, string | number | Date>,
	) => {
		console.log(action, rowData);
	};

	return (
		<div>
			{/* <FilterableTable
				columns={columns}
				data={data}
				onAction={handleAction}
				onAddFilter={() => navigate('/create-product-design-document')}
				addButtonText={t('addDocument')}
				filterableColumns={['id', 'label', 'name', 'product']}
			/> */}
		</div>
	);
}
