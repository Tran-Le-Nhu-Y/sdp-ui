import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { viVN } from '@mui/material/locale';
import { viVN as viVNDataGrid } from '@mui/x-data-grid/locales';
import { viVN as viVNDatePickers } from '@mui/x-date-pickers/locales';

// A custom theme for this app
const theme = createTheme(
	{
		cssVariables: true,
		palette: {
			primary: {
				main: '#556cd6',
			},
			secondary: {
				main: '#19857b',
			},
			error: {
				main: red.A400,
			},
		},
	},
	viVN,
	viVNDataGrid,
	viVNDatePickers
);

export default theme;
