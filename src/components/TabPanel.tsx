import { Box, BoxProps } from '@mui/material';

export interface TabPanelProps extends BoxProps {
	children?: React.ReactNode;
	index: number;
	value: number;
}

export function TabPanel(props: TabPanelProps) {
	const { children, value, index, ...other } = props;

	return (
		<Box
			role="tabpanel"
			hidden={value !== index}
			id={`simple-tabpanel-${index}`}
			aria-labelledby={`simple-tab-${index}`}
			p={3}
			{...other}
		>
			{children}
		</Box>
	);
}
