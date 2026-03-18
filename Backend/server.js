import dotenv from "dotenv";
dotenv.config({ path: "./config/config.env" });
import app from "./app.js"


const port = process.env.PORT || 4000;

app.listen(port, () =>{
    console.log(`Server listening on port ${port}`); // THIS WAS USE TO CHECK WHETHER THE PATH GIVEN IN APP.JS OF CONFIG IS CORRECT OR NOT AND IT IS IN WORKING 
});