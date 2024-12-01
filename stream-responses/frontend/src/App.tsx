import './App.css'
import { useState, useEffect } from 'react'
import axios from 'axios'
import { Container, TextField, Typography } from '@mui/material';


function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/answer')
      .then((response) => {
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
      
  console.log("DATA from component:", data);
      


  return (
    <Container fixed>
      <Typography variant="h1" component="h2">
        OpenAI Streaming
      </Typography>
      <TextField id="outlined-basic" label="Enter Text" variant="outlined" sx={{ width: '100%', mt: 3 }} />
    </Container>
  );
}

export default App
