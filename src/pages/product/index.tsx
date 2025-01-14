import Button from '@mui/material/Button';
import { Table } from '../../components';
import { useTranslation } from 'react-i18next';

export default function ProductManagementPage() {
	const { t } = useTranslation();

	return (
		<div>
			<Button variant="contained">{t('addProduct')}</Button>
			<Table />
		</div>
	);
}
