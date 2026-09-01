import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useView } from "../components/viewContext";

const API_URL = import.meta.env.VITE_API_URL;

/* LLAMADAS A API DE LA SECCION 1: CREAR CARPETA */
export function useFolderCallback(folderData) {
    const queryClient = useQueryClient();
    //const { activeView } = useView();
    //const {user} = useAuth();

    const queryKey = ['folders'];

    //Funcion para crear folder
    const createFolder = useMutation({
        mutationFn: async function AgregarCurso(folderData) {
            const response = await fetch(`${API_URL}/s1_folders.php`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(folderData)
            });
            
            return response.json();        
        },

        onSuccess: () => { queryClient.invalidateQueries({queryKey}) },

        onError: (err) => { console.error("Error al crear folder", err.message) }
    });

    //Funcion para Borrar
    const deleteFolder = useMutation({
        mutationFn: async function eliminarCurso (folderData) {
            const response = await fetch(`${API_URL}/s1_folders.php`, { 
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json'},
                body: folderData
            });

            if(!response.ok) throw new Error('Error al borrar el folder');
            return response.json();   
        },
        onSuccess: () => {queryClient.invalidateQueries({queryKey})},
        onError: () => {console.error("Error al crear folder")}
    });

    return {createFolder, deleteFolder}
}
