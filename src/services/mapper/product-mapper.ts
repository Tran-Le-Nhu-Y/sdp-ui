function toEntity(response: ProductResponse): Product {
	const product: Product = {
		id: response.id,
		name: response.name,
		description: response.description,
		createdAt: new Date(response.createdAtMillis).toLocaleString(),
		updatedAt: response.updatedAtMillis
			? new Date(response.updatedAtMillis).toLocaleString()
			: '',
		status: response.isUsed ? 'ACTIVE' : 'INACTIVE',
	};
	return product;
}

export { toEntity };
