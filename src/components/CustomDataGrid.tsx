import { DataGrid, DataGridProps, GridValidRowModel } from '@mui/x-data-grid';
import React from 'react';

const CustomDataGrid = <R extends GridValidRowModel>(
	props: DataGridProps<R> & React.RefAttributes<HTMLDivElement>
) => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
			<DataGrid {...props} />
		</div>
	);
};

export default CustomDataGrid;
