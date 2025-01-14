export enum TextLength {
	Short = 6,
	Medium = 100,
	Long = 150,
	VeryLong = 255,
	ExtremeLong = 60000,
}

export const isValidLength = (text: string, length: TextLength) =>
	text.length <= length;
