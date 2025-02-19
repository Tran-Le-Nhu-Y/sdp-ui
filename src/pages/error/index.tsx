import { Box, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { RoutePaths } from '../../utils';

const ErrorPage = () => {
	const { t } = useTranslation('standard');
	return (
		<Box textAlign="center" marginY={30}>
			<Typography
				component="h1"
				marginBottom="1rem"
				fontSize="3.75rem"
				lineHeight="1"
				fontWeight="600"
				color="#EF4444"
			>
				404
			</Typography>
			<Typography
				component="p"
				marginBottom="1rem "
				fontSize="1.125rem"
				lineHeight="1.75rem"
				color="#4B5563"
			>
				{t('pageNotFound')}
			</Typography>
			<Box sx={{ animation: 'bounce 1s infinite' }}>
				<svg
					width="4rem "
					height="4rem"
					color="#EF4444"
					fill="none"
					viewBox="0 0 24 24"
					stroke="currentColor"
				>
					<path
						strokeLinecap="round"
						strokeLinejoin="round"
						strokeWidth="2"
						d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
					/>
				</svg>
			</Box>
			<Typography component="p" marginTop=" 1rem" color="#4B5563 ">
				{t('goBack')}{' '}
				<Link to={RoutePaths.OVERVIEW} color="#3B82F6">
					<Button variant="text">{t('home')}</Button>
				</Link>
			</Typography>
		</Box>
	);
};

export default ErrorPage;
