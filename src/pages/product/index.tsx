import Button from '@mui/material/Button';
import { Table } from '../../components';
import { useTranslation } from 'react-i18next';
import { Stack } from '@mui/material';

export default function ProductManagementPage() {
	const { t } = useTranslation();

	return (
		<div>
			<Stack
				direction="row"
				justifyContent="flex-end"
				alignItems="center"
				sx={{ marginBottom: 1 }}
			>
				<Button variant="contained">{t('addProduct')}</Button>
			</Stack>

			<Table />
		</div>
	);
}
