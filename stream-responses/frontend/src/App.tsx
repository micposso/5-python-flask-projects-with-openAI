import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'


function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/answer')
      .then((response) => {
        console.log("API Response:", response);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
      });
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

    if (!data) {
      return <p>No data available</p>;
    }


  return (
    <>
      <h1>OpenAI Streaming</h1>
      <p>{data.message}</p>
      <ul>
        {data.data.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </>
  )
}

export default App
