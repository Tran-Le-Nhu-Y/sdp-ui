import { useTranslation } from 'react-i18next';
import { CreateOrModifyForm } from '../../components';
import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '../../services';
import { Box, LinearProgress } from '@mui/material';
import { useNotifications } from '@toolpad/core';
import { useEffect } from 'react';
import { hideDuration } from '../../utils';

export default function CreateProductPage() {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [createProductTrigger, createProduct] = useCreateProduct();
	const notifications = useNotifications();

	useEffect(() => {
		if (createProduct.isError)
			notifications.show(t('createProductError'), {
				severity: 'error',
				autoHideDuration: hideDuration.fast,
			});
		else if (createProduct.isSuccess) {
			navigate(-1); // back to previous page
			notifications.show(t('createProductSuccess'), {
				severity: 'success',
				autoHideDuration: hideDuration.fast,
			});
		}
	}, [
		createProduct.isError,
		createProduct.isSuccess,
		navigate,
		notifications,
		t,
	]);
	const handleSubmit = async (data: {
		productNameProp: string;
		descriptionProp: string;
	}) => {
		const newProduct: ProductCreatingRequest = {
			name: data.productNameProp,
			description: data.descriptionProp,
			userId: 'd28bf637-280e-49b5-b575-5278b34d1dfe',
		};
		await createProductTrigger(newProduct);
	};

	return (
		<Box>
			{createProduct.isLoading && <LinearProgress />}
			<CreateOrModifyForm
				title={t('addProduct')}
				label={t('productName')}
				onSubmit={handleSubmit}
				onCancel={() => navigate(-1)}
			/>
		</Box>
	);
}
