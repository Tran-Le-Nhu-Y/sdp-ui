import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';
import { viVN } from '@mui/x-data-grid/locales';

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
	viVN
);

export default theme;
