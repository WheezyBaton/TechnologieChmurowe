import { useState, useEffect } from "react";
import "./App.css";

function App() {
      const [items, setItems] = useState([]);
      const [name, setName] = useState("");
      const [value, setValue] = useState("");
      const [error, setError] = useState("");

      const API_URL = process.env.NODE_ENV === "development" ? "http://localhost:5000" : "/api";

      const fetchItems = async () => {
            try {
                  const response = await fetch(`${API_URL}/items`);
                  if (!response.ok) throw new Error("Failed to fetch items");
                  setItems(await response.json());
                  setError("");
            } catch (err) {
                  setError(err.message);
                  console.error("Fetch error:", err);
            }
      };

      const addItem = async () => {
            try {
                  const response = await fetch(`${API_URL}/items`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ name, value: Number(value) }),
                  });

                  if (!response.ok) {
                        const error = await response.json();
                        throw new Error(error.error || "Failed to add item");
                  }

                  const newItem = await response.json();
                  setItems((prev) => [newItem, ...prev]);
                  setName("");
                  setValue("");
                  setError("");
            } catch (err) {
                  setError(err.message);
                  console.error("Submission error:", err);
            }
      };

      useEffect(() => {
            fetchItems();
      }, []);

      return (
            <div className="App">
                  <h1>Microservices Demo</h1>

                  {error && <div className="error">{error}</div>}

                  <div className="form">
                        <input
                              type="text"
                              placeholder="Item name"
                              value={name}
                              onChange={(e) => setName(e.target.value)}
                        />
                        <input
                              type="number"
                              placeholder="Value"
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                        />
                        <button onClick={addItem}>Add Item</button>
                  </div>

                  <h2>Recent Items</h2>
                  <ul>
                        {items.map((item) => (
                              <li key={item._id}>
                                    {item.name} - {item.value}
                              </li>
                        ))}
                  </ul>
            </div>
      );
}

export default App;
