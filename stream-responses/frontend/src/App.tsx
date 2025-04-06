import "./App.css";
import { useState, useEffect } from "react";
import axios from "axios";
import { Container, TextField, Typography, Button } from "@mui/material";

function App() {
  const [data, setData] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [inputText, setInputText] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/answer")
      .then((response) => {
        console.log("API Response:", response.data);
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data: ", error);
        setLoading(false);
      });
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setData(""); // Clear previous data

    try {
      const response = await fetch("http://localhost:5000/answer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      });

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let result = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        // Decode the chunk and append it to the result
        const chunk = decoder.decode(value, { stream: true });
        result += chunk;

        // Update the state to show the response incrementally
        setData((prevData) => prevData + chunk);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

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
      {loading ? (
        <Typography variant="h4" component="h2">
          Loading...
        </Typography>
      ) : (
        <Typography variant="h4" component="h2">
          {data}
        </Typography>
      )}
    </Container>
  );
}

export default App;
