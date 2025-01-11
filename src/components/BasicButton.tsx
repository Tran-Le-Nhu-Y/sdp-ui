import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface BasicButtonsProps {
	buttonText: string;
}

const BasicButtons: React.FC<BasicButtonsProps> = ({ buttonText }) => {
	return (
		<Stack spacing={2} direction="row" sx={{ marginBottom: 2 }}>
			<Button variant="contained">{buttonText}</Button>
		</Stack>
	);
};

export default BasicButtons;
