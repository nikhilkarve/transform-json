import React, { useState, useEffect } from 'react';
import posts from './posts.json';
import { useLocalStorage } from 'react-use';
import './css/styles.css';
import { ClockLoader as Loader } from 'react-spinners';
import Editor from '@monaco-editor/react';
import ReactJson from 'react-json-view';

function App() {
	const [theme] = useState('light');
	const [language] = useState('python');

	const [inputData, setInputData] = useLocalStorage(
		'input',
		JSON.stringify(posts)
	);

	const [codeData, setCodeData] = useLocalStorage(
		'code',
		`const outputData = inputData.filter(post => post.userId === 10);
  outputData`
	);
	const [outputData, setOutputData] = useState('output', '');
	function handleInputChange(event) {
		const { value } = event.target;
		console.log('here is the current input value:', value);
		setInputData(value);
	}

	function handleEditorChange(value) {
		console.log('here is the current code value:', value);
		setCodeData(value);
	}
	// const evalCode = () => {
	// 	try {
	// 		const output = eval(`const inputData = ${inputData};
	// ${codeData}
	// `);
	// 		setOutputData(output);
	// 	} catch (error) {
	// 		setOutputData(error);
	// 	}
	// };
	const evalCodePy = () => {
		try {
			const output = eval(`inputData = ${inputData};
  ${codeData}
  `);
			setOutputData(output);
		} catch (error) {
			setOutputData(error);
		}
	};

	useEffect(() => {
		// evalCode();
		evalCodePy();
	}, []);

	return (
		<div className='editorBox'>
			<textarea value={inputData} onChange={handleInputChange} />
			<Editor
				height='calc(100% - 19px)'
				theme={theme}
				language={language}
				loading={<Loader />}
				defaultValue={codeData}
				onChange={handleEditorChange}
			/>
			<div>
				<button onClick={evalCodePy}>Generate</button>
				{outputData && Object.keys(outputData)?.length ? (
					<ReactJson src={outputData} />
				) : (
					<textarea disabled value={outputData} />
				)}
			</div>
		</div>
	);
}

export default App;
