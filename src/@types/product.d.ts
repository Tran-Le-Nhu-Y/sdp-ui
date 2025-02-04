declare interface Product {
	id: string;
	name: string;
	description: string;
	dateCreated: Date;
	lastUpdated: Date;
	status: 'ACTIVE' | 'INACTIVE';
}
