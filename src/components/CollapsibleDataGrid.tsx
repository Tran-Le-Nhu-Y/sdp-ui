import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import {
	Collapse,
	IconButton,
	Stack,
	StackProps,
	Tooltip,
	Typography,
} from '@mui/material';
import { DataGrid, DataGridProps } from '@mui/x-data-grid';
import { t } from 'i18next';

interface CollapsibleDataGridProps {
	sx?: StackProps;
	label: string;
	title: string;
	collapsible?: boolean;
	disableCollapsedHelperText?: string;
	open?: boolean;
	onOpenChange: (isOpen: boolean) => void;
	dataProps: DataGridProps;
}

function CollapsibleDataGrid({
	sx,
	open,
	collapsible = true,
	disableCollapsedHelperText,
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
				<Tooltip
					followCursor={!collapsible}
					title={
						collapsible ? t('expand/collapse') : disableCollapsedHelperText
					}
				>
					<IconButton
						size="small"
						onClick={() => {
							if (onOpenChange && collapsible) onOpenChange(!open);
						}}
					>
						{open ? (
							<KeyboardArrowUpIcon />
						) : (
							<KeyboardArrowDownIcon
								color={collapsible ? 'inherit' : 'disabled'}
							/>
						)}
					</IconButton>
				</Tooltip>
			</Stack>
			<Collapse in={collapsible && open} unmountOnExit>
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
