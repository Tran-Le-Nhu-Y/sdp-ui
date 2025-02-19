function toEntity(response: CustomerResponse): Customer {
	const customer: Customer = {
		id: response.id,
		name: response.name,
		email: response.email,
		createdAt: new Date(response.createdAtMs).toLocaleString(),
		updatedAt: response.updatedAtMs
			? new Date(response.updatedAtMs).toLocaleString()
			: null,
	};
	return customer;
}

export { toEntity };
