function toEntity(response: MailTemplateResponse): MailTemplate {
	const type: MailTemplate = {
		id: response.id,
		content: response.content,
		type: response.type,
		createdAt: new Date(response.createdAtMs).toLocaleString(),
		updatedAt: response.updatedAtMs
			? new Date(response.updatedAtMs).toLocaleString()
			: '',
	};
	return type;
}

export { toEntity };
