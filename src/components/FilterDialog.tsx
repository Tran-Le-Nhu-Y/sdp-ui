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
	SelectChangeEvent,
	Stack,
	TextField,
} from '@mui/material';
import { MouseEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import DeleteIcon from '@mui/icons-material/Delete';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterAltIcon from '@mui/icons-material/FilterAlt';

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

interface FilterDialogProps {
	filters: Array<Filter>;
	open: boolean;
	onOpen?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
	onClose?: (
		e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent> | undefined,
		reason: 'backdropClick' | 'escapeKeyDown' | undefined
	) => void;
	onReset?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
	onAppend?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
	onUpdate?: (
		e: SelectChangeEvent<unknown>,
		updatedFilter: FilterResult
	) => void;
	onRemove?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
	onApply?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
	onCancel?: (e: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => void;
}

function FilterDialog({
	filters,
	open,
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

	const updateFilters = (
		e: SelectChangeEvent<unknown>,
		index: number,
		key: keyof FilterResult,
		value: string | number
	) => {
		const newFilters = [...filterResults];
		newFilters[index] = { ...newFilters[index], [key]: value };
		setFilterResults(newFilters);
		if (onUpdate) onUpdate(e, newFilters[index]);
	};

	return (
		<Paper>
			<Dialog
				open={open}
				onClose={(_e, reason) => {
					if (onClose) onClose(undefined, reason);
				}}
			>
				<DialogTitle>{t('filter')}</DialogTitle>
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

									updateFilters(e, index, 'key', key);
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
							<Select
								value={filter.operator}
								onChange={(e) =>
									updateFilters(e, index, 'operator', e.target.value)
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
							<IconButton
								onClick={(e) => {
									setFilterResults(filterResults.filter((_, i) => i !== index));
									if (onRemove) onRemove(e);
								}}
							>
								<DeleteIcon />
							</IconButton>
						</div>
					))}
					{filterResults.length !== filters.length && (
						<Button
							variant="contained"
							onClick={(e) => {
								setFilterResults([
									...filterResults,
									{ key: DEFAULT_FILTER.key, operator: 'contains', value: '' },
								]);
								if (onAppend) onAppend(e);
							}}
						>
							{t('add')}
						</Button>
					)}
				</DialogContent>
				<DialogActions>
					<Button
						onClick={(e) => {
							if (onCancel) onCancel(e);
						}}
					>
						{t('cancel')}
					</Button>
					<Button
						onClick={(e) => {
							if (onApply) onApply(e);
							if (onClose) onClose(e, undefined);
						}}
					>
						{t('submit')}
					</Button>
				</DialogActions>
			</Dialog>

			<Stack direction={'row'}>
				<IconButton
					onClick={(e) => {
						if (!onReset) return;
						onReset(e);
						setFilterResults([]);
					}}
				>
					<RefreshIcon />
				</IconButton>
				<IconButton
					color="primary"
					onClick={(e) => {
						if (onOpen) onOpen(e);
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
