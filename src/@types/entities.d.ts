declare interface File {
	id: string;
	name: string;
	size: number;
	status: string;
}
declare interface DocumentLabel {
	id: string;
	name: string;
	description: string;
	color: string;
}
declare interface ProductVersion {
	id: string;
	productId: string;
	name: string;
	createdAt: string;
	updatedAt: string?;
	status: 'ACTIVE' | 'INACTIVE';
}

declare interface ProductVersionChangelog {
	id: string;
	versionId: string;
	name: string;
}

declare interface Product {
	id: string;
	name: string;
	description: string;
	createdAt: string;
	updatedAt: string?;
	status: 'ACTIVE' | 'INACTIVE';
}
