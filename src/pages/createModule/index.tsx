import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate } from 'react-router-dom';

export default function CreateModulePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const handleSubmit = () => {
		navigate(-1); // back to previous page
	};

	return (
		<div>
			<CreateOrModifyForm
				title={t('addModule')}
				label={`${t('moduleName')}`}
				onSubmit={handleSubmit}
				onCancel={() => navigate(-1)}
			/>
		</div>
	);
}
