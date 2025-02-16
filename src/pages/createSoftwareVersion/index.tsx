import { useTranslation } from 'react-i18next';
import { CreateModifyVersionForm } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createProductVersion } from '../../redux/slices/ProductVersionSlice';
import { PathHolders } from '../../utils';

export default function CreateSoftwareVersionPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const softwareId = useParams()[PathHolders.SOFTWARE_ID];

	const handleSubmit = (data: {
		productNameProp: string;
		descriptionProp: string;
		files: File[];
	}) => {
		// TODO(CREATE SOFTWARE VERSION)
		navigate(-1);
	};

	return (
		<CreateModifyVersionForm
			title={t('addSoftwareVersion')}
			label={`${t('version')}`}
			onSubmit={handleSubmit}
			onCancel={() => navigate(-1)}
		/>
	);
}
