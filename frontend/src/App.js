//import logo from './logo.svg';
import './App.css';
import React, { useState } from 'react';


// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;


function App() {
  const [file, setFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  const [imageURL, setImageURL] = useState('');

  
  const handleFileChange = (e) => {
    const selectedFile=e.target.files[0];
    setFile(selectedFile);

    if(selectedFile){
      const objectURL=URL.createObjectURL(selectedFile);
      setImageURL(objectURL);
    }

  };

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      setPrediction('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://127.0.0.1:5000/predict', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setPrediction(`Prediction : ${data.prediction}`);
        // const objectURL = URL.createObjectURL(file);
        // setImageURL(objectURL);
      } else {
        setPrediction('Error: ' + response.statusText);
      }
    } catch (error) {
      setPrediction('Error: Failed to connect to the server');
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Lung X-Ray Classifier</h1>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <input
            type="file"
            id="fileInput"
            name="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <button type="submit">SUBMIT</button>
        </form>

        {prediction && <p>{prediction}</p>}

        {imageURL && (
          <div id="imageDisplay" style={{ width: '448px', height: '448px', border: '3px solid black' }}>
            <img src={imageURL} alt="Uploaded X-ray" style={{ width: '100%', height: '100%' }} />
          </div>
        )}
      </header>
    </div>
  );
}

export default App;


// import React, { useState } from 'react'; // Import React and the useState hook

// function App() {
//   // Define a state variable to store user input and another for displaying the result
//   const [inputValue, setInputValue] = useState('');
//   const [displayValue, setDisplayValue] = useState('');

//   // Function to handle input changes
//   const handleInputChange = (event) => {
//     setInputValue(event.target.value); // Update inputValue state with the user's input
//   };

//   // Function to display the input value
//   const handleButtonClick = () => {
//     setDisplayValue(inputValue); // Update displayValue state to show the input
//   };

//   return (
//     <div style={{ textAlign: 'center', marginTop: '50px' }}>
//       <h1>Simple React Example</h1>
      
//       {/* Input Field */}
//       <input 
//         type="text" 
//         value={inputValue} 
//         onChange={handleInputChange} 
//         placeholder="Type something..." 
//         style={{ padding: '10px', fontSize: '16px' }}
//       />
      
//       {/* Button */}
//       <button 
//         onClick={handleButtonClick} 
//         style={{ marginLeft: '10px', padding: '10px 20px', fontSize: '16px' }}
//       >
//         Submit
//       </button>
      
//       {/* Display the result */}
//       <p style={{ marginTop: '20px', fontSize: '20px' }}>
//         {displayValue ? `You typed: ${displayValue}` : 'Your text will appear here.'}
//       </p>
//     </div>
//   );
// }

// export default App;
