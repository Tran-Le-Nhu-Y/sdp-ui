import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
	selectProductById,
	updateProduct,
} from '../../redux/slices/ProductSlice';
import { RootState } from '../../redux/store';

export default function ModifyModulePage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const dispatch = useDispatch();
	const { id } = useParams<{ id: string }>(); // get product id from URL

	const product = useSelector((state: RootState) =>
		selectProductById(state, id!),
	);

	if (!product) {
		alert(t('productNotFound')); // Thông báo nếu không tìm thấy sản phẩm
		navigate(-1); // back to previous page
		return null;
	}

	const handleSubmit = (data: {
		productNameProp: string;
		descriptionProp: string;
	}) => {
		const updatedProduct = {
			...product,
			name: data.productNameProp,
			description: data.descriptionProp,
			lastUpdated: new Date().toLocaleString(),
		};
		dispatch(updateProduct(updatedProduct));
		navigate(-1);
	};

	return (
		<div>
			<CreateOrModifyForm
				title={t('modifyModule')}
				label={`${t('moduleName')}`}
				showModifyValues={{
					productNameToShow: product.name,
					descriptionToShow: product.description,
				}}
				onSubmit={handleSubmit}
				onCancel={() => navigate(-1)}
			/>
		</div>
	);
}
