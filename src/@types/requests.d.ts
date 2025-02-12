declare interface ProductCreatingRequest {
	name: string;
	description?: string?;
	userId: string;
}

declare interface ProductUpdatingRequest {
	name: string;
	description?: string?;
}

declare interface DocumentLabelCreatingRequest {
	name: string;
	description?: string?;
	color?: string?;
	userId: string;
}

declare interface DocumentLabelUpdatingRequest {
	name: string;
	description?: string?;
	color: string;
}
