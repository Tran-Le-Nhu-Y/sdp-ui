export enum TextLength {
	Short = 6,
	Medium = 100,
	Long = 150,
	VeryLong = 255,
	ExtremeLong = 60000,
}

export const isValidLength = (text: string, length: TextLength) =>
	text.length <= length;

export enum RoutePaths {
	CREATE_PRODUCT = '/create-product',
	MODIFY_PRODUCT = '/modify-product',
}

export enum hideDuration {
	fast = 3000,
	slow = 5000,
}
