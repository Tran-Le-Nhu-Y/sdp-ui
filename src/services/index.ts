import {
	productVersionApi,
	useGetAllVersionsByProductIdQuery as useGetAllVersionsByProductId,
} from './product-version';
import {
	productApi,
	useGetAllProductsByUserIdQuery as useGetAllProductsByUserId,
} from './product';

export { productApi, useGetAllProductsByUserId };
export { productVersionApi, useGetAllVersionsByProductId };
