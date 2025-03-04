import { Box, LinearProgress, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function HydrateFallback() {
	const { t } = useTranslation('standard');

	return (
		<Box>
			<LinearProgress />
			<Typography variant="h6" textAlign="center">
				{t('loading')}
			</Typography>
		</Box>
	);
}
