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
