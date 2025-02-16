import React, { useState } from 'react';
import {
	Table,
	TableBody,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	Paper,
	Select,
	MenuItem,
	TextField,
	IconButton,
	Dialog,
	DialogActions,
	Button,
	DialogContent,
	DialogTitle,
	Stack,
	TableFooter,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import TablePaginationActions from '@mui/material/TablePagination/TablePaginationActions';

const DEFAULT_FILTER: Omit<Filter, 'label'> = {
	key: 'default',
};

interface Filter {
	key: string;
	label: string;
}
interface FilterResult extends Omit<Filter, 'label'> {
	operator: 'contains' | 'equals';
	value: string | number;
}

interface FilterableTableProps<T> {
	filterableCols: Filter[];
	headers: JSX.Element;
	rows: T[];
	count: number;
	pageNumber?: number;
	pageSize?: number;
	addButtonText?: string;
	onPageChange: (newPage: TablePage) => void;
	getCell: (row: T) => React.JSX.Element;
	onAddClick?: () => void;
}

function FilterableTable<T>(props: FilterableTableProps<T>) {
	const {
		filterableCols,
		headers,
		rows,
		addButtonText,
		onAddClick: onAddFilter,
		count,
		onPageChange,
		getCell,
	} = props;
	const [filters, setFilters] = useState<FilterResult[]>([]);
	const [dialogOpen, setDialogOpen] = useState(false);
	const { t } = useTranslation('standard');
	const page = props.pageNumber ?? 0;
	const rowsPerPage = props.pageSize ?? 5;

	const resetFilter = () => {
		setFilters([]); // Reset bộ lọc về rỗng
		onPageChange({ pageNumber: 0, pageSize: rowsPerPage });
	};

	const addFilter = () => {
		setFilters([...filters, { key: '', operator: 'contains', value: '' }]);
	};

	const updateFilters = (
		index: number,
		key: keyof FilterResult,
		value: string | number,
	) => {
		const newFilters = [...filters];
		newFilters[index] = { ...newFilters[index], [key]: value };
		setFilters(newFilters);
	};

	const removeFilter = (index: number) => {
		setFilters(filters.filter((_, i) => i !== index));
	};

	const applyFilters = () => {
		setDialogOpen(false);
	};

	// // Avoid a layout jump when reaching the last page with empty rows.
	// const emptyRows =
	// 	rowsPerPage - rows.length > 0 ? rowsPerPage - rows.length : 0;

	const handleChangePage = (
		_event: React.MouseEvent<HTMLButtonElement> | null,
		newPage: number,
	) => {
		onPageChange({ pageNumber: newPage, pageSize: rowsPerPage });
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>,
	) => {
		onPageChange({ pageNumber: 0, pageSize: parseInt(event.target.value, 10) });
	};

	const columnCount = headers.props.children.length;

	return (
		<Paper>
			{/* Filter Dialog */}
			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
				<DialogTitle>{t('searchDeployDocument')}</DialogTitle>
				<DialogContent>
					{filters.map((filter, index) => (
						<div
							key={index}
							style={{
								display: 'flex',
								alignItems: 'center',
								marginBottom: '8px',
								gap: '10px',
							}}
						>
							<Select
								value={filter.key}
								onChange={(e) => {
									const key = e.target.value;
									const isExist = filters.find((f) => f.key === key);
									if (isExist) return;

									updateFilters(index, 'key', key);
								}}
								displayEmpty
								style={{ minWidth: '120px' }}
							>
								<MenuItem value={DEFAULT_FILTER.key}>{t('searchBy')}</MenuItem>
								{filterableCols.map((col) => (
									<MenuItem key={col.key} value={col.key}>
										{col.label}
									</MenuItem>
								))}
							</Select>
							<Select
								value={filter.operator}
								onChange={(e) =>
									updateFilters(index, 'operator', e.target.value)
								}
								style={{ minWidth: '120px' }}
							>
								<MenuItem value="contains">{t('contains')}</MenuItem>
								<MenuItem value="equals">{t('equals')}</MenuItem>
							</Select>
							<TextField
								value={filter.value}
								onChange={(e) => updateFilters(index, 'value', e.target.value)}
								placeholder={t('enterValue')}
							/>
							<IconButton onClick={() => removeFilter(index)}>
								<DeleteIcon />
							</IconButton>
						</div>
					))}
					{filters.length !== filterableCols.length && (
						<Button variant="contained" onClick={addFilter}>
							{t('add')}
						</Button>
					)}
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>{t('cancel')}</Button>
					<Button onClick={applyFilters}>{t('submit')}</Button>
				</DialogActions>
			</Dialog>

			{/* Filter Button */}
			<div
				style={{
					padding: '8px',
					display: 'flex',
					justifyContent: 'space-between',
				}}
			>
				<Stack direction={'row'}>
					<IconButton onClick={resetFilter}>
						<RefreshIcon />
					</IconButton>
					<IconButton color="primary" onClick={() => setDialogOpen(true)}>
						<FilterAltIcon />
					</IconButton>
				</Stack>

				{addButtonText && (
					<Button variant="contained" onClick={onAddFilter}>
						{addButtonText}
					</Button>
				)}
			</div>

			{/* Table Section */}
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

export { FilterableTable };
export type { FilterResult, FilterableTableProps };
