import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
	Collapse,
	IconButton,
	Stack,
	StackProps,
	Typography,
} from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';

interface CollapsibleDataGridProps {
	sx?: StackProps | undefined;
	label: string;
	title: string;
	open?: boolean | undefined;
	onOpenChange: (isOpen: boolean) => void;
	dataProps: DataGridProps;
}

function CollapsibleDataGrid({
	sx,
	open,
	label,
	title,
	dataProps,
	onOpenChange,
}: CollapsibleDataGridProps) {
	return (
		<Stack {...sx}>
			<Stack direction={'row'} spacing={1} width={'auto'}>
				<Typography variant="h6" sx={{ opacity: 0.8 }}>
					{label}:
				</Typography>
				<Typography
					variant="h6"
					overflow={'hidden'}
					textOverflow={'ellipsis'}
					sx={{ maxWidth: 600, fontWeight: 10, opacity: 0.8 }}
				>
					{title}
				</Typography>
				<IconButton
					size="small"
					onClick={() => {
						if (onOpenChange) onOpenChange(!open);
					}}
				>
					{open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
				</IconButton>
			</Stack>
			<Collapse in={open} unmountOnExit>
				<DataGrid
					autoPageSize
					rowSelection
					paginationMode="server"
					keepNonExistentRowsSelected
					{...dataProps}
				/>
			</Collapse>
		</Stack>
	);
}

export { CollapsibleDataGrid };
export type { CollapsibleDataGridProps };
