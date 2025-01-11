import Table from '../../components/Table';
import { useTranslation } from 'react-i18next';
import BasicButtons from '../../components/BasicButton';
import CustomTable from '../../components/CustomTable';

export default function ProductManagementPage() {
	const { t } = useTranslation();

	return (
		<div>
			<BasicButtons buttonText={t('addProduct')} />
			<Table />
			<CustomTable />
		</div>
	);
}
