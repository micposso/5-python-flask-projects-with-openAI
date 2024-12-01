import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, TextField, Typography, Button } from "@mui/material";

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");

  const handleSubmit = () => {
    setLoading(true);
    fetch("http://localhost:5000/answer", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: inputText }),
    })
      .then((response) => response.text())
      .then((result) => {
        console.log("API Response:", result);
        setData(result);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

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
      <TextField
        id="outlined-basic"
        label="Enter Text"
        variant="outlined"
        value={inputText}
        onChange={handleInputChange}
        sx={{ width: "100%", mt: 3 }}
      />
      <Button variant="contained" color="primary" onClick={handleSubmit}>
        Submit
      </Button>
      <Typography variant="body1" component="p">
        {data}
      </Typography>
    </Container>
  );
}

export default App;
