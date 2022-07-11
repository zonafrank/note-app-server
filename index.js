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

app.get("/api/notes", async (request, response) => {
  try {
    const notes = await Note.find({});
    console.log(notes);
    response.json(notes);
  } catch (error) {
    next(error);
  }
});

app.get("/api/notes/:id", async (request, response, next) => {
  try {
    const savedNote = await Note.findById(request.params.id);

    if (savedNote) {
      response.json(savedNote);
    } else {
      response.status(404).end();
    }
  } catch (error) {
    next(error);
  }
});

app.delete("/api/notes/:id", async (request, response, next) => {
  try {
    await Note.findByIdAndRemove(request.params.id);
    response.status(204).end();
  } catch (error) {
    next(error);
  }
});

app.post("/api/notes", async (request, response, next) => {
  try {
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
  } catch (error) {
    next(error);
  }
});

app.put("/api/notes/:id", async (request, response, next) => {
  try {
    const { id } = request.params;
    const { content, important } = request.body;
    const updatedNote = await Note.findByIdAndUpdate(
      id,
      { content, important },
      { new: true, runValidators: true, context: "query" }
    );
    response.json(updatedNote);
  } catch (error) {
    next(error);
  }
});

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
