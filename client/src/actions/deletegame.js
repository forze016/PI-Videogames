import axios from 'axios';

export default function deletegame(payload) {
  return async function (dispatch) {
    try {
      await axios.delete(`http://localhost:3001/videogames/${payload}`);
      // Realiza cualquier otra acción necesaria después de borrar el videojuego
    } catch (error) {
      console.log(error);
      // Maneja el error de acuerdo a tus necesidades
    }
  };
}