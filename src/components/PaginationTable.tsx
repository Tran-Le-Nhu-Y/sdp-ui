import React from 'react';
import {
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
	TableFooter,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';

interface PaginationTableProps<T> {
	headers: JSX.Element;
	rows: T[];
	count: number;
	pageNumber?: number;
	pageSize?: number;
	addButtonText?: string;
	onPageChange: (newPage: TablePage) => void;
	getCell: (row: T) => React.JSX.Element;
}

function PaginationTable<T>(props: PaginationTableProps<T>) {
	const { headers, rows, count, onPageChange, getCell } = props;
	const { t } = useTranslation('standard');
	const page = props.pageNumber ?? 0;
	const rowsPerPage = props.pageSize ?? 5;

	// // Avoid a layout jump when reaching the last page with empty rows.
	// const emptyRows =
	// 	rowsPerPage - rows.length > 0 ? rowsPerPage - rows.length : 0;

	const handleChangePage = (
		_event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number
	) => {
		onPageChange({ pageNumber: newPage, pageSize: rowsPerPage });
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		onPageChange({ pageNumber: 0, pageSize: parseInt(event.target.value, 10) });
	};

	const columnCount = headers.props.children.length;

	return (
		<Paper>
			<TableContainer aria-label="filterable table">
				<Table>
					<TableHead>
						<TableRow>{headers}</TableRow>
					</TableHead>
					<TableBody>
						{rows.map(getCell)}
						{/* {emptyRows > 0 && (
							<TableRow style={{ height: 32 * emptyRows }}>
								<TableCell colSpan={columnCount} />
							</TableRow>
						)} */}
					</TableBody>
					<TableFooter>
						<TableRow>
							{/* Pagination */}
							<TablePagination
								rowsPerPageOptions={[5, 10, 25, { label: 'Tất cả', value: -1 }]}
								colSpan={columnCount}
								count={count}
								rowsPerPage={rowsPerPage}
								page={page}
								slotProps={{
									select: {
										inputProps: {
											'aria-label': 'rows per page',
										},
										native: true,
									},
								}}
								labelRowsPerPage={t('rowsPerPage')}
								onPageChange={handleChangePage}
								onRowsPerPageChange={handleChangeRowsPerPage}
								ActionsComponent={TablePaginationActions}
							/>
						</TableRow>
					</TableFooter>
				</Table>
			</TableContainer>
		</Paper>
	);
}

export { PaginationTable };
export type { PaginationTableProps };
