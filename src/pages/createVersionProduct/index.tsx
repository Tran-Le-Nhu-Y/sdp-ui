import { useTranslation } from 'react-i18next';
import { CreateModifyVersionForm } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createProductVersion } from '../../redux/slices/ProductVersionSlice';

export default function CreateVersionProductPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { productId } = useParams();

	const handleSubmit = (data: {
		productNameProp: string;
		descriptionProp: string;
		files: File[];
	}) => {
		if (!productId) {
			alert('Lỗi: Không tìm thấy productId!');
			return;
		}

		const newProductVersion: ProductVersion = {
			id: crypto.randomUUID(),
			productId: productId,
			version: data.productNameProp,
			changelog: data.descriptionProp,
			createdAt: new Date().toLocaleString(),
			updatedAt: new Date().toLocaleString(),
			status: 'Đang hoạt động',
			// files: data.files,
		};

		dispatch(createProductVersion(newProductVersion));
		navigate(-1);
	};

	return (
		<div>
			<CreateModifyVersionForm
				title={t('addVersionProduct')}
				label={`${t('version')}`}
				onSubmit={handleSubmit}
				onCancel={() => navigate(-1)}
			/>
		</div>
	);
}
