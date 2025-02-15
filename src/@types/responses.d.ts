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

declare interface SoftwareResponse {
	id: string;
	name: string;
	description: string?;
	createdAtMs: number;
	updatedAtMs: number?;
}

declare interface ProductVersionResponse {
	id: string;
	versionName: string;
	isUsed: boolean;
	createdAtMillis: number;
	updatedAtMillis: number?;
}

declare interface ErrorResponse {
	status: number;
	errorKey: string;
	severity?: 'warn' | 'error';
}

declare interface DocumentLabelResponse {
	id: string;
	name: string;
	description: string;
	createdAtMillis: number;
	updatedAtMillis: number?;
	color: string;
}
