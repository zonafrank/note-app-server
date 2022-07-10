require("dotenv").config();
const express = require("express");
const cors = require("cors");
const Note = require("./models/note.js");

const app = express();
app.set("json spaces", 2);
app.use(express.json());
app.use(cors());
app.use(express.static("build"));

const requestLogger = (request, response, next) => {
  console.table(`Method: ${request.method}, Path: ${request.path}`);
  console.log("Body", request.body);
  next();
};

app.use(requestLogger);

const generateId = () => {
  const maxId = notes.length === 0 ? 0 : Math.max(...notes.map((n) => n.id));
  return maxId + 1;
};

app.get("/api/notes", async (request, response) => {
  const notes = await Note.find({});
  response.json(notes);
});

app.get("/api/notes/:id", async (request, response) => {
  try {
    const savedNote = await Note.findById(request.params.id);

    if (savedNote) {
      response.json(savedNote);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    console.log(error);
    response.status(500).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = request.params.id;
  notes = notes.filter((n) => n.id !== Number(id));

  response.status(204).end();
});

app.post("/api/notes", async (request, response) => {
  if (!request.body.content) {
    return response.status(400).json({ error: "content missing" });
  }

  const body = request.body;

  const note = new Note({
    content: body.content,
    important: body.important || false,
    date: new Date(),
  });

  const savedNote = await note.save();
  response.json(savedNote);
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
