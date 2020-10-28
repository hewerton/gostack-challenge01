const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require("uuid");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repository = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repository);

  response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const index = repositories.findIndex((rep) => rep.id === id);

  if (index >= 0) {
    const rep = repositories[index];
    rep.title = title ? title : rep.title;
    rep.url = url ? url : rep.url;
    rep.techs = techs ? techs : rep.techs;
    return response.json(rep);
  }

  return response.status(400).send();
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((rep) => rep.id === id);

  if (index >= 0) {
    repositories.splice(index, 1);
    response.status(204).send();
  }

  response.status(400).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const index = repositories.findIndex((rep) => rep.id === id);

  if (index >= 0) {
    const rep = repositories[index];
    rep.likes++;

    return response.json({ likes: rep.likes });
  }

  return response.status(400).send();
});

module.exports = app;
