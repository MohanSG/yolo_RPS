import express from "express"
import { Client } from "@gradio/client"
import multer from "multer"

const app = express();
const port = 3000;

app.use(express.static("public"))
const upload = multer();

async function run_model(image) {

    const client = await Client.connect("DKSparda/yolo_space");
    console.log("Connected to Gradio client");

    const result = await client.predict("/predict", {
        image: image
    });

    return result;
}

app.get("/", async (req, res) => {
    res.render("index.ejs")
});

app.post("/run_model", upload.single("image"), async (req, res) => {
    const model_prediction = await run_model(req.file.buffer);

    res.json( {model_prediction: model_prediction.data[0]} );
})

app.listen(port, ()=> {
    console.log("Listening...");
});