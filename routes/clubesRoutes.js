import  express, { Router } from "express";
import { getClubes, getClubById, createClub, updateClub, deleteClub } from "..controllers/";

const router = express.Router();

//obtener todos los clubes
router.get("/", getClubes);

//obtener los clubes por id
router.get("/:id", getClubById);

//crear un nuevo club
router.post("/", createClub);

//actualizar los datos del club
router.put('/:id', updateClub);

//eliminar un club por id
router.delete('/:id', deleteClub);

export default router ;