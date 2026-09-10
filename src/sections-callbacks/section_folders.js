import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useView } from "../components/viewContext";

const API_URL = import.meta.env.VITE_API_URL;

/* LLAMADAS A API DE LA SECCION 1: CREAR CARPETA */
export function useFolderCallback(folderData) {
    const queryClient = useQueryClient();
    //const {user} = useAuth();

    const queryKey = ['folders'];

    //Funcion para crear folder
    const createFolder = useMutation({
        mutationFn: async (folderData) => {
            const response = await fetch(`${API_URL}/s1_folders.php`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(folderData)
            });
            
            const data = await response.json();
            if (!response.ok || data.success === false) {
                throw new Error(data.message || 'Error al procesar la solicitud');
            }

            return data;       
        },
        onSuccess: () => { queryClient.invalidateQueries({queryKey}) },
        onError: (error) => { console.error("Error al crear folder", error.message) }
    });

    //Funcion para Borrar
    const deleteFolder = useMutation({
        mutationFn: async (folderData) => {
            const response = await fetch(`${API_URL}/s1_folders.php`, { 
                method: 'DELETE', 
                headers: { 'Content-Type': 'application/json'},
                body: JSON.stringify(folderData)
            });
            
            const data = await response.json();
            if (!response.ok || data.success === false) {
                throw new Error(data.message || 'Error al procesar la solicitud');
            }
            return data;
        },
        onSuccess: () => {queryClient.invalidateQueries({queryKey})},
        onError: (error) => { console.error("Error al borrar el folder", error.message); }
    });

    return {createFolder, deleteFolder}
}
