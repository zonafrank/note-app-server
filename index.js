const express = require("express");
const cors = require("cors");

const app = express();
app.set("json spaces", 2);
app.use(express.json());
app.use(cors());

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2022-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only Javascript",
    date: "2022-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2022-05-30T19:20:14.298Z",
    important: true,
  },
];

const generateId = () => {
  const maxId = notes.length === 0 ? 0 : Math.max(...notes.map((n) => n.id));
  return maxId + 1;
};

app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  const note = notes.find((n) => n.id === Number(id));
  if (note) {
    return response.json(note);
  }

  response.status(404).end();
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((n) => n.id !== Number(id));

  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  if (!request.body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  const { content, important } = request.body;

  const newNote = {
    content,
    important: important || false,
    id: generateId(),
    date: new Date(),
  };

  notes = notes.concat(newNote);
  response.json(newNote);
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
