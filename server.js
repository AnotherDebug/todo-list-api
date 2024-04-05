import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { promises as fs } from "fs";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());


// Endpoint per recuperare i tasks
app.get("/tasks", async (req, res) => {
  try {
    // Leggo i dati di tasks.json
    const tasksData = await fs.readFile("tasks.json");
    // Converto in oggetto javascript -> tasks.json (tasksData)
    const tasks = JSON.parse(tasksData);
    // Invio dei dati al client in formato json
    res.json(tasks);
    // Gestione errori
  } catch (error) {
    console.error("Errore nel recupero dei tasks:", error);
    // 500 (Internal Server Error)
  }
});



// Endpoint per salvare i tasks
app.post("/tasks", async (req, res) => {
  try {
    // Leggo i dati di tasks.json
    const tasksData = await fs.readFile("tasks.json");
    // Converto in oggetto javascript -> tasks.json (tasksData)
    const tasks = JSON.parse(tasksData);
    // Leggo il nuovo task inviato dal client e lo salvo in una variabile
    const newTask = req.body;
    // Lo pusho nell'array
    tasks.push(newTask);
    // Sovrascrivo tasks.json con i dati aggiornati
    // Converto il file javascript tasks con stringify
    await fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2));
    res.status(201).send("Task aggiunto con successo");
    // Gestione errori
  } catch (error) {
    console.error("Errore nel salvataggio del task:", error);
    // 500 (Internal Server Error)
    res.status(500).send("Errore nel salvataggio del task");
  }
});



// Aggiungo l'endpoint per eliminare un task
app.delete("/tasks/:taskId", async (req, res) => {
    try {
        const taskId = parseInt(req.params.taskId);
        console.log(taskId);
        
        // Leggo i dati attuali dei task dal file tasks.json
        const tasksData = await fs.readFile("tasks.json");
        // Converto in oggetto JavaScript
        let tasks = JSON.parse(tasksData);

        // Trovo l'indice del task da eliminare
        const index = tasks.findIndex(task => task.id === taskId);

        if (index === -1) {
            // Se il task non è stato trovato, restituisco un errore 404
            return res.status(404).json({ error: "Task non trovato" });
        }

        // Rimuovo il task dall'array dei tasks
        tasks.splice(index, 1);

        // Scrivo i dati aggiornati nel file tasks.json
        await fs.writeFile("tasks.json", JSON.stringify(tasks, null, 2));

        // Rispondo con uno status code 204 (No Content) per indicare che la richiesta è stata elaborata con successo.
        return res.status(204).end();
    } catch (error) {
        // Se si verifica un errore, invio una risposta con uno status code 500 (Internal Server Error).
        console.error('Errore durante l\'eliminazione del task:', error);
        return res.status(500).send('Errore durante l\'eliminazione del task');
    }
});




app.listen(PORT, () => {
  console.log(`Server in ascolto sulla porta ${PORT}`);
});










//----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

