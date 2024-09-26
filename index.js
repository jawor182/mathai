const OpenAI = require("openai");
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const apiKey = process.env.api;
const openai = new OpenAI({
  apiKey: apiKey,
});
const port = process.env.PORT;
const app = express();
app.use(cors());
app.use(bodyParser.json());

//const prompt = "Jesteś profesorem matematyki, który specjalizuje się w rozwiązywaniu zadań. Podaj odpowiedź krok po kroku. Podaj odpowiedź TYLKO w formacie MathML";
const prompt = "Jesteś profesorem matematyki, który specjalizuje się w rozwiązywaniu zadań. Podaj odpowiedź krok po kroku.";
const model = "gpt-4o-mini";

app.post("/api/text", async (req, res) => {
  try {
    const text = req.body.text;

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
        {
          role: "user",
          content: [{ type: "text", text: `${text}` }],
        },
      ],
    });
    res.send(response.choices[0].message.content);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
app.post("/api/image", async (req, res) => {
  try {
    const image = req.body.image;

    const response = await openai.chat.completions.create({
      model: model,
      messages: [
        {
          role: "system",
          content: [
            {
              type: "text",
              text: prompt,
            },
          ],
        },
        {
          role: "user",
          content: [
            { type: "text", text: "Rozwiąż zadania na obrazku" },
            {
              type: "image_url",
              image_url: {
                url: `${image}`,
              },
            },
          ],
        },
      ],
    });
    res.send(response.choices[0].message.content);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});
app.listen(port, () => {
  console.log(`App is listening on http://localhost:${port}`);
});
