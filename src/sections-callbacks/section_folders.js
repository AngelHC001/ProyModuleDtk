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
        mutationFn: async (folderData) => {
            const response = await fetch(`${API_URL}/s1_folders.php`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(folderData)
            });

            const data = await response.json();

            if(!response.ok || response.success === false){
                throw new Error(data.message || 'Error en el servidor');
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
            
            if(!response.ok || response.success === false){
                const errorText = await response.text();
                throw new Error(errorText || 'Error en el servidor');
            }

            return response.json();   
        },
        onSuccess: () => {queryClient.invalidateQueries({queryKey})},
        onError: (error) => { console.error("Error al borrar el folder", error.message); }
    });

    return {createFolder, deleteFolder}
}
