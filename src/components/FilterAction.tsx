import { IconButton, MenuItem, Stack, TextField } from '@mui/material';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

interface FilterEntry {
	value: string;
	label: string;
}

interface FilterActionProps {
	entries: FilterEntry[];
	defaultValue?: string;
	onFilterClick: (value: string, entry: FilterEntry) => void;
}

export default function FilterAction(props: FilterActionProps) {
	const { t } = useTranslation('standard');
	const { entries, defaultValue, onFilterClick } = props;
	const [filter, setFilter] = useState(defaultValue);
	const [value, setValue] = useState('');

	return (
		<Stack direction="row" spacing={1} alignItems="center">
			<TextField
				value={value}
				label={t('search')}
				fullWidth
				size="small"
				variant="outlined"
				onChange={(e) => setValue(e.target.value as string)}
			/>
			<TextField
				id="outlined-select-currency"
				select
				label="Select"
				value={filter}
				size="small"
				fullWidth
				onChange={(e) => setFilter(e.target.value as string)}
			>
				{entries.map((option) => (
					<MenuItem key={option.value} value={option.value}>
						{option.label}
					</MenuItem>
				))}
			</TextField>
			<IconButton
				aria-label="filter"
				color="primary"
				onClick={() => {
					const entry = entries.find((f) => f.value === filter);
					if (!entry) {
						console.error(`Cannot find entry value ${filter}.`);
						return;
					}
					onFilterClick(value, entry);
				}}
			>
				<FilterAltIcon />
			</IconButton>
		</Stack>
	);
}
