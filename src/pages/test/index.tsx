// import ReusableDataGrid from '../../components/TableWithFilter';
// import { GridRowsProp, GridColDef } from '@mui/x-data-grid';

// const ExamplePage = () => {
// 	const columns: GridColDef[] = [
// 		{ field: 'id', headerName: 'ID', flex: 1, filterable: true },
// 		{ field: 'name', headerName: 'Name', flex: 1, filterable: true },
// 		{
// 			field: 'rating',
// 			headerName: 'Rating',
// 			flex: 1,
// 			type: 'number',
// 			filterable: true,
// 		},
// 		{ field: 'country', headerName: 'Country', flex: 1, filterable: true },
// 		{
// 			field: 'dateCreated',
// 			headerName: 'Date Created',
// 			flex: 1,
// 			type: 'date',
// 			filterable: true,
// 			// Chuyển đổi từ chuỗi thành đối tượng Date
// 			valueGetter: (params: { row: { dateCreated?: string } }) => {
// 				if (!params || !params.row || !params.row.dateCreated) {
// 					return null; // Nếu không có `dateCreated`, trả về null
// 				}
// 				const date = new Date(params.row.dateCreated);
// 				return isNaN(date.getTime()) ? null : date; // Trả về null nếu không phải là ngày hợp lệ
// 			},
// 		},
// 		{
// 			field: 'isAdmin',
// 			headerName: 'Admin',
// 			flex: 1,
// 			type: 'boolean',
// 			filterable: true,
// 		},
// 	];

// 	const rows: GridRowsProp = [
// 		{
// 			id: 1,
// 			name: 'Alice',
// 			rating: 5,
// 			country: 'USA',
// 			dateCreated: '2023-01-01',
// 			isAdmin: true,
// 		},
// 		{
// 			id: 2,
// 			name: 'Bob',
// 			rating: 3,
// 			country: 'Canada',
// 			dateCreated: '2023-02-15',
// 			isAdmin: false,
// 		},
// 		{
// 			id: 3,
// 			name: 'Charlie',
// 			rating: 4,
// 			country: 'UK',
// 			dateCreated: '2023-03-10',
// 			isAdmin: true,
// 		},
// 		{
// 			id: 4,
// 			name: 'David',
// 			rating: 2,
// 			country: 'USA',
// 			dateCreated: '2023-04-05',
// 			isAdmin: false,
// 		},
// 		{
// 			id: 5,
// 			name: 'Emma',
// 			rating: 5,
// 			country: 'Canada',
// 			dateCreated: '2023-05-20',
// 			isAdmin: true,
// 		},
// 	];

// 	return (
// 		<div>
// 			<h1>Example Page</h1>
// 			<ReusableDataGrid
// 				columns={columns}
// 				rows={rows}
// 				initialPageSize={5}
// 				pageSizeOptions={[5, 10, 20]}
// 			/>
// 		</div>
// 	);
// };

// export default ExamplePage;

import FilterableTable from '../../components/FilterableTable';

const ExamplePage = () => {
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
		// Add more rows here
	];
	const handleAction = (
		action: string,
		rowData: Record<string, string | number | Date>,
	) => {
		console.log(action, rowData);
	};
	const handleAddProduct = () => {
		console.log('Thêm sản phẩm');
	};

	return (
		<div>
			<h1>Example Page</h1>
			<FilterableTable
				columns={columns}
				data={data}
				onAction={handleAction}
				onButtonAdd={handleAddProduct}
				addButtonText="Thêm sản phẩm"
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
};

export default ExamplePage;
