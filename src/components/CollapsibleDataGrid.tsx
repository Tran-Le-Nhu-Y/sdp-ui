import {
	Accordion,
	AccordionDetails,
	AccordionProps,
	AccordionSummary,
	Stack,
	Typography,
} from '@mui/material';
import { DataGridProps } from '@mui/x-data-grid';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CustomDataGrid from './CustomDataGrid';

interface CollapsibleDataGridProps extends Omit<AccordionProps, 'children'> {
	label: string;
	dataProps: DataGridProps;
}

function CollapsibleDataGrid(props: CollapsibleDataGridProps) {
	const { label, title, dataProps } = props;
	return (
		<Accordion {...props}>
			<AccordionSummary expandIcon={<ExpandMoreIcon />}>
				<Stack direction={'row'} gap={1}>
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
				</Stack>
			</AccordionSummary>
			<AccordionDetails>
				<CustomDataGrid
					// autoPageSize
					paginationMode="server"
					keepNonExistentRowsSelected
					{...dataProps}
				/>
			</AccordionDetails>
		</Accordion>
	);
}

export { CollapsibleDataGrid };
export type { CollapsibleDataGridProps };
