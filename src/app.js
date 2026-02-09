import "dotenv/config";
import express from "express";
import cors from "cors";

import chatRoutes from "./routes/chat.routes.js";
import fileRoutes from "./routes/file.routes.js";
import documentIntelRoutes from "./routes/document-intel.routes.js";
import chatWithFileRoutes from "./routes/chat-with-file.routes.js";

const app = express();

app.use(cors());
app.use(express.json());

// Rutas del chatbot
app.use("/api/chat", chatRoutes);

// Rutas para subir archivos
app.use("/api/files", fileRoutes);

// Rutas para Document Intelligence
app.use("/api/document-intel", documentIntelRoutes);

// Nueva ruta para chatear con archivos
app.use("/api/chat-with-file", chatWithFileRoutes);

app.listen(3000, () => {
    console.log("Servidor backend corriendo en puerto 3000");
});