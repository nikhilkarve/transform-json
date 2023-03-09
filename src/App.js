import React, { useState, useEffect } from 'react';
import posts from './posts.json';
import { useLocalStorage } from 'react-use';
import './css/styles.css';
import { ClockLoader as Loader } from 'react-spinners';
import Editor from '@monaco-editor/react';
import ReactJson from 'react-json-view';

function App() {
	/*---------------- Theme for Monaco editor. If not specified "light" is default.----------------------- */

	const [theme] = useState('vs-dark');
	const [language] = useState('javascript');

	/* -------------- Using local storage to store input and output data. Using data from posts.json initially. 
  Also, using basic filter query in code editor initially.-----------------*/

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

	/* ------------------- Helper function to handle change in the input textarea. Updating state for inputData ------------- */

	function handleInputChange(event) {
		const { value } = event.target;
		setInputData(value);
	}

	/*-------------------- Handling change in the code editor. Setting codeData state.--------------------------- */

	function handleEditorChange(value) {
		console.log('here is the current code value:', value);
		setCodeData(value);
	}

	/* ------------------- Using JS eval() function to evaluate JS query entered in the code editor and setting output values acordingly. */

	const evalCode = () => {
		try {
			const output = eval(`const inputData = ${inputData};
  ${codeData}
  `);
			setOutputData(output);
		} catch (error) {
			setOutputData(error);
		}
	};

	/* -------------------------- On the first render. ---------------- */
	useEffect(() => {
		evalCode();
	}, []);

	return (
		<div className='editorBox'>
			<textarea
				value={inputData}
				onChange={handleInputChange}
				style={{ background: 'rgb(28, 27, 27)', color: '#149414' }}
			/>
			<Editor
				height='calc(100% - 19px)'
				theme={theme}
				language={language}
				loading={<Loader />}
				defaultValue={codeData}
				onChange={handleEditorChange}
			/>
			<div>
				<button onClick={evalCode} className='btnGenerate'>
					Generate
				</button>
				{outputData && Object.keys(outputData)?.length ? (
					<ReactJson src={outputData} theme='monokai' />
				) : (
					<textarea disabled value={outputData} />
				)}
			</div>
		</div>
	);
}

export default App;
