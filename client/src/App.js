import React, { useState } from 'react';
import axios from 'axios';
import Select from 'react-select';

const App = () => {
  const [jsonInput, setJsonInput] = useState('');
  const [selectedFilters, setSelectedFilters] = useState([]);
  const [response, setResponse] = useState('');
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');

  const filterOptions = [
    { value: 'numbers', label: 'Numbers' },
    { value: 'alphabets', label: 'Alphabets' },
    { value: 'highest_lowercase_alphabet', label: 'Highest Lowercase Alphabet' },
  ];

  const handleSubmit = async () => {
    try {
      // Reset error and response
      setError('');
      setResponse(null);

      // Ensure the JSON input is valid
      let parsedData;
      try {
        parsedData = JSON.parse(jsonInput);
      } catch (err) {
        setError('Invalid JSON format');
        return;
      }

      // Validate data structure
      if (!parsedData.data || !Array.isArray(parsedData.data)) {
        setError('Data must be an array.');
        return;
      }

      // Prepare form data to send to backend
      const formData = new FormData();
      formData.append('jsonData', JSON.stringify(parsedData));  // Send JSON as a string
      if (file) formData.append('file', file);  // Attach file if present

      // Make POST request to backend
      const { data } = await axios.post('https://taskround.onrender.com', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // Store response
      setResponse(data);
    } catch (err) {
      setError('Server error or invalid input');
    }
  };

  const filteredResponse = () => {
    if (!response) return 'No response yet';
    const filtered = {};
    selectedFilters.forEach(({ value }) => {
      filtered[value] = response[value];
    });
    return JSON.stringify(filtered, null, 2);
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>ABCD123</h1>
      <textarea
        rows="5"
        cols="50"
        value={jsonInput}
        onChange={(e) => setJsonInput(e.target.value)}
        placeholder='Enter JSON, e.g., {"data": ["A", "C", "Z", "c", "i"]}'
      />
      <br />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <br />
      <button onClick={handleSubmit}>Submit</button>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      <Select
        options={filterOptions}
        isMulti
        onChange={setSelectedFilters}
        placeholder="Select filters"
      />
      <pre>{filteredResponse()}</pre>
    </div>
  );
};

export default App;