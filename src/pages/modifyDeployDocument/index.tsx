import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createProduct } from '../../redux/slices/ProductSlice';

export default function CreateProductPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleSubmit = (data: {
		productNameProp: string;
		descriptionProp: string;
	}) => {
		const newProduct = {
			id: `${Math.random()}`,
			name: data.productNameProp,
			description: data.descriptionProp,
			dateCreated: new Date().toLocaleString(),
			lastUpdated: new Date().toLocaleString(),
			status: 'Đang hoạt động',
		};
		dispatch(createProduct(newProduct));

		navigate(-1); // back to previous page
	};

	return (
		<div>
			<CreateOrModifyForm
				title={t('addProduct')}
				label={`${t('productName')}`}
				onSubmit={handleSubmit}
				onCancel={() => navigate(-1)}
			/>
		</div>
	);
}
