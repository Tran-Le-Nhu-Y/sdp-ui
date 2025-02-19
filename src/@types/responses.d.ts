declare interface PagingWrapper<T> {
	content: Array<T>;
	first: boolean;
	last: boolean;
	number: number;
	numberOfElements: number;
	size: number;
	totalElements: number;
	totalPages: number;
}

declare interface CustomerResponse {
	id: string;
	name: string;
	email: string;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface SoftwareResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface SoftwareVersionResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface ErrorResponse {
	status: number;
	errorKey: string;
	severity?: 'warn' | 'error';
}

declare interface DocumentTypeResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface SoftwareDocumentResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
	type: { name: string };
	version: { name: string };
}
