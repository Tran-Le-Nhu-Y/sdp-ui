function toEntity(response: DocumentLabelResponse): DocumentLabel {
	const label: DocumentLabel = {
		id: response.id,
		name: response.name,
		description: response.description,
		createdAt: new Date(response.createdAtMillis).toLocaleString(),
		updatedAt: response.updatedAtMillis
			? new Date(response.updatedAtMillis).toLocaleString()
			: '',
		color: response.color,
	};
	return label;
}

export { toEntity };
