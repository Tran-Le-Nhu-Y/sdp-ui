import React, { useState } from 'react';
import {
	Table,
	TableBody,
	TableCell,
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
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';

export interface Column {
	key: string;
	label: string;
	filterable?: boolean;
}

export interface Filter {
	columnKey: string;
	operator: 'contains' | 'equals';
	value: string | number;
}

export interface FilterableTableProps {
	columns: Column[];
	data: Record<string, string | boolean | Date | number>[];
	onAction?: (
		action: string,
		rowData: Record<string, string | boolean | number | Date>
	) => void;
	onButtonAdd?: () => void;
	addButtonText?: string;
	filterableColumns?: string[]; // Danh sách các key cột có thể lọc
}

function FilterableTable({
	columns,
	data,
	onAction,
	onButtonAdd,
	addButtonText,
}: FilterableTableProps) {
	const [filters, setFilters] = useState<Filter[]>([]);
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [dialogOpen, setDialogOpen] = useState(false);
	const { t } = useTranslation('standard');

	const resetFilter = () => {
		setFilters([]); // Reset bộ lọc về rỗng
		//setPage(0); // Quay về trang đầu
	};

	const addFilter = () => {
		setFilters([
			...filters,
			{ columnKey: '', operator: 'contains', value: '' },
		]);
	};

	const updateFilter = (
		index: number,
		key: keyof Filter,
		value: string | number
	) => {
		const newFilters = [...filters];
		newFilters[index] = { ...newFilters[index], [key]: value };
		setFilters(newFilters);
	};

	const removeFilter = (index: number) => {
		setFilters(filters.filter((_, i) => i !== index));
	};

	const handleChangePage = (_event: unknown, newPage: number) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const applyFilters = () => {
		setDialogOpen(false);
	};

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
								value={filter.columnKey}
								onChange={(e) =>
									updateFilter(index, 'columnKey', e.target.value)
								}
								displayEmpty
								style={{ minWidth: '120px' }}
							>
								<MenuItem value="">{t('searchBy')}</MenuItem>
								{columns.map((col) => (
									<MenuItem key={col.key} value={col.key}>
										{col.label}
									</MenuItem>
								))}
							</Select>
							<Select
								value={filter.operator}
								onChange={(e) =>
									updateFilter(index, 'operator', e.target.value)
								}
								style={{ minWidth: '120px' }}
							>
								<MenuItem value="contains">{t('contains')}</MenuItem>
								<MenuItem value="equals">{t('equals')}</MenuItem>
							</Select>
							<TextField
								value={filter.value}
								onChange={(e) => updateFilter(index, 'value', e.target.value)}
								placeholder={t('enterValue')}
							/>
							<IconButton onClick={() => removeFilter(index)}>
								<DeleteIcon />
							</IconButton>
						</div>
					))}
					<Button variant="contained" onClick={addFilter}>
						{t('add')}
					</Button>
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

				<Button variant="contained" onClick={onButtonAdd}>
					{addButtonText || t('add')}
				</Button>
			</div>

			{/* Table Section */}
			<TableContainer>
				<Table>
					<TableHead>
						<TableRow>
							{columns.map((col) => (
								<TableCell key={col.key}>{col.label}</TableCell>
							))}
							{onAction && <TableCell></TableCell>}
						</TableRow>
					</TableHead>
					<TableBody>
						{data
							.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
							.map((row, rowIndex) => (
								<TableRow key={rowIndex}>
									{columns.map((col) => (
										<TableCell key={col.key}>
											{row[col.key]?.toString() || ''}
										</TableCell>
									))}
									{onAction && (
										<TableCell>
											<Stack>
												<Button
													size="small"
													onClick={() => onAction('view', row)}
												>
													{t('seeDetail')}
												</Button>
												<Button
													size="small"
													onClick={() => onAction('edit', row)}
												>
													{t('edit')}
												</Button>
												<Button
													size="small"
													onClick={() => onAction('delete', row)}
												>
													{t('delete')}
												</Button>
											</Stack>
										</TableCell>
									)}
								</TableRow>
							))}
					</TableBody>
				</Table>
			</TableContainer>

			{/* Pagination */}
			<TablePagination
				rowsPerPageOptions={[5, 10, 25]}
				component="div"
				count={data.length}
				rowsPerPage={rowsPerPage}
				page={page}
				onPageChange={handleChangePage}
				onRowsPerPageChange={handleChangeRowsPerPage}
			/>
		</Paper>
	);
}

export default FilterableTable;
