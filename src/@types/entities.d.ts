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
declare interface ProductVersion extends Record<string, string> {
	id: string;
	productId: string;
	version: string;
	changelog: string;
	createdAt: string;
	updatedAt: string;
	status: string;
	// files: File[];
}
declare interface Product {
	id: string;
	name: string;
	description: string;
	dateCreated: Date;
	lastUpdated: Date;
	status: 'ACTIVE' | 'INACTIVE';
}
