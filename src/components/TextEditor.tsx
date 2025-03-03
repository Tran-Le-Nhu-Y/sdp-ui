import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import { t } from 'i18next';
import { DeltaStatic, Sources } from 'quill';

export default function TextEditor({
	value,
	readOnly = false,
	onChange,
}: {
	value: string;
	readOnly?: boolean;
	onChange?: (
		value: string,
		delta: DeltaStatic,
		source: Sources,
		editor: ReactQuill.UnprivilegedEditor
	) => void;
}) {
	const toolbarOptions = [
		['bold', 'italic', 'underline', 'strike'], // toggled buttons
		['blockquote', 'code-block'],
		// ['link', 'image', 'video', 'formula'],
		['link', 'formula'],

		[{ header: 1 }, { header: 2 }], // custom button values
		[{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
		[{ script: 'sub' }, { script: 'super' }], // superscript/subscript
		[{ indent: '-1' }, { indent: '+1' }], // outdent/indent
		[{ direction: 'rtl' }], // text direction

		[{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
		[{ header: [1, 2, 3, 4, 5, 6, false] }],

		[{ color: [] }, { background: [] }], // dropdown with defaults from theme
		[{ font: [] }],
		[{ align: [] }],

		// ['clean'], // remove formatting button
	];

	return (
		<ReactQuill
			modules={{ toolbar: !readOnly ? toolbarOptions : [] }}
			theme="snow"
			value={value}
			onChange={onChange}
			readOnly={readOnly}
			placeholder={t('enterDescription')}
		/>
	);
}
