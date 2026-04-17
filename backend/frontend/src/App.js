import { useEffect, useState } from "react";

function App() {
  const [books, setBooks] = useState([]);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/books/")
      .then(res => res.json())
      .then(data => setBooks(data));
  }, []);

  const askQuestion = async (id, type = "question") => {
    setLoading(true);
    setAnswer("");

    const bodyData =
      type === "question"
        ? { book_id: id, question: question }
        : { book_id: id, type: type };

    const res = await fetch("http://127.0.0.1:8000/api/ask/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(bodyData)
    });

    const data = await res.json();
    setAnswer(data.answer || JSON.stringify(data));
    setLoading(false);
  };

  return (
    <div style={{ fontFamily: "Arial", padding: "20px", background: "#f4f6f8" }}>
      
      <h1 style={{ textAlign: "center" }}>📚 AI Book Insight App</h1>

      {books.map(book => (
        <div
          key={book.id}
          style={{
            background: "white",
            padding: "15px",
            margin: "15px auto",
            width: "60%",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)"
          }}
        >
          <h2>{book.title}</h2>
          <p><b>Author:</b> {book.author}</p>
          <p>{book.description}</p>

          <input
            type="text"
            placeholder="Ask something about this book..."
            style={{ width: "70%", padding: "8px", marginRight: "10px" }}
            onChange={(e) => setQuestion(e.target.value)}
          />

          <br /><br />

          <button onClick={() => askQuestion(book.id)} style={btn}>
            Ask
          </button>

          <button onClick={() => askQuestion(book.id, "summary")} style={btn}>
            Summary
          </button>

          <button onClick={() => askQuestion(book.id, "genre")} style={btn}>
            Genre
          </button>
        </div>
      ))}

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <h2>🧠 Answer:</h2>
        {loading ? <p>Loading...</p> : <p>{answer}</p>}
      </div>
    </div>
  );
}

const btn = {
  margin: "5px",
  padding: "8px 12px",
  border: "none",
  borderRadius: "5px",
  background: "#007bff",
  color: "white",
  cursor: "pointer"
};

export default App;