import {
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	IconButton,
	MenuItem,
	Paper,
	Select,
	Stack,
	TextField,
} from '@mui/material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

const DEFAULT_FILTER: Omit<Filter, 'label'> = {
	key: 'default',
	type: 'text',
};

interface Filter {
	key: string;
	label: string;
	type?: 'select' | 'text';
	selectOptions?: Array<{ key: string | number; value: string | number }>;
}
interface FilterResult extends Omit<Filter, 'label'> {
	// operator: 'contains' | 'equals';
	value: string | number;
}

interface FilterDialogProps {
	filters: Array<Filter>;
	open: boolean;
	title?: string | undefined;
	onOpen?: () => void;
	onClose?: (
		reason: 'backdropClick' | 'escapeKeyDown' | 'applyClick' | 'cancelClick'
	) => void;
	onReset?: () => void;
	onAppend?: () => void;
	onUpdate?: (updatedFilter: Readonly<FilterResult>) => void;
	onRemove?: (filter: Readonly<FilterResult>) => void;
	onApply?: (filters: Readonly<FilterResult[]>) => void;
	onCancel?: (prevFilters: Readonly<FilterResult[]>) => void;
}

function FilterDialog({
	filters,
	open,
	title,
	onOpen,
	onClose,
	onReset,
	onAppend,
	onUpdate,
	onRemove,
	onApply,
	onCancel,
}: FilterDialogProps) {
	const { t } = useTranslation('standard');
	const [filterResults, setFilterResults] = useState<FilterResult[]>([]);

	const updateFilters = (index: number, newFilter: FilterResult) => {
		const newFilters = [...filterResults];
		newFilters[index] = newFilter;
		setFilterResults(newFilters);
		if (onUpdate) onUpdate(newFilters[index]);
	};

	return (
		<Paper>
			<Dialog
				open={open}
				onClose={(_e, reason) => {
					if (onClose) onClose(reason);
				}}
			>
				<DialogTitle>{title ? title : t('filter')}</DialogTitle>
				<DialogContent>
					{filterResults.map((filter, index) => (
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
									const isExist = filterResults.find((f) => f.key === key);
									if (isExist) return;

									const addedFilter = filters.find((f) => f.key === key);
									if (!addedFilter) return;
									switch (addedFilter.type) {
										case 'select':
											updateFilters(index, {
												...addedFilter,
												value: addedFilter.selectOptions?.[0].key ?? '',
											});
											break;
										default:
											updateFilters(index, {
												...addedFilter,
												value: '',
											});
									}
								}}
								displayEmpty
								style={{ minWidth: '120px' }}
							>
								<MenuItem value={DEFAULT_FILTER.key}>{t('searchBy')}</MenuItem>
								{filters.map((filter) => (
									<MenuItem key={filter.key} value={filter.key}>
										{filter.label}
									</MenuItem>
								))}
							</Select>
							{/* <Select
								value={filter.operator}
								onChange={(e) =>
									updateFilters(index, 'operator', e.target.value)
								}
								style={{ minWidth: '120px' }}
							>
								<MenuItem value="contains">{t('contains')}</MenuItem>
								<MenuItem value="equals">{t('equals')}</MenuItem>
							</Select> */}

							{filter.type === 'select' ? (
								<Select
									value={filter.value}
									onChange={(e) =>
										updateFilters(index, { ...filter, value: e.target.value })
									}
									displayEmpty
									style={{ minWidth: '150px' }}
								>
									{filter.selectOptions?.map(({ key, value }) => (
										<MenuItem value={key}>{value}</MenuItem>
									))}
								</Select>
							) : (
								<TextField
									value={filter.value}
									onChange={(e) =>
										updateFilters(index, { ...filter, value: e.target.value })
									}
									placeholder={t('enterValue')}
								/>
							)}

							<IconButton
								onClick={() => {
									const removed = filterResults[index];
									setFilterResults((prev) =>
										prev.filter((_, i) => i !== index)
									);
									if (onRemove) onRemove(removed);
								}}
							>
								<DeleteIcon />
							</IconButton>
						</div>
					))}
					{filterResults.length !== filters.length && (
						<Button
							variant="contained"
							onClick={() => {
								setFilterResults([
									...filterResults,
									{
										key: DEFAULT_FILTER.key,
										// operator: 'contains',
										type: DEFAULT_FILTER.type,
										value: '',
									},
								]);
								if (onAppend) onAppend();
							}}
						>
							{t('add')}
						</Button>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={() => {
							if (onCancel) onCancel(filterResults);
							if (onClose) onClose('cancelClick');
						}}
					>
						{t('cancel')}
					</Button>
					<Button
						onClick={() => {
							if (onApply) onApply(filterResults);
							if (onClose) onClose('applyClick');
						}}
					>
						{t('submit')}
					</Button>
				</DialogActions>
			</Dialog>

			<Stack direction="row">
				<IconButton
					title={t('resetFilter')}
					onClick={() => {
						setFilterResults([]);
						if (onReset) onReset();
					}}
				>
					<RefreshIcon />
				</IconButton>
				<IconButton
					title={t('openFilter')}
					color="primary"
					onClick={() => {
						if (onOpen) onOpen();
					}}
				>
					<FilterAltIcon />
				</IconButton>
			</Stack>
		</Paper>
	);
}

export { FilterDialog };
export type { Filter, FilterResult, FilterDialogProps };
