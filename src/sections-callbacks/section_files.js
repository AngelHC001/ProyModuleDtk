import { useMutation, useQueryClient } from "@tanstack/react-query"; 
const API_URL = import.meta.env.VITE_API_URL;

export function useUploadCallbacks(uploadData){
    const queryClient = useQueryClient();
    const queryKey = ['uploads'];
    
    //lega como formData
    const uploadFile = useMutation({
        mutationFn: async(uploadData) => {
            const response = await fetch(`${API_URL}/s2_file_process.php`,{
                method:'POST',
                body: uploadData
            });
            
            const data = await response.json()
            if(!response.ok || data.success === false){
                throw new Error(data.message || 'Error al procesar solicitud');
            }
            
            return data;
        },
        onSuccess: () => {queryClient.invalidateQueries({queryKey})},
        onError: (err) => { console.error('ERROR AL SUBIR ARCHIVO', err.message) }
    });

    const eraseFile = useMutation({
        mutationFn: async(uploadData) => {
            const response = await fetch(`${API_URL}/s2_file_process.php`,{
                method:'DELETE',
                body: JSON.stringify({path: uploadData})            
            });
            
            const data = await response.json()
            if(!response.ok || data.success === false){
                throw new Error(data.message || 'Error al procesar solicitud');
            }
        
            return data;
        },
        onSuccess: () => { queryClient.invalidateQueries({queryKey}) },
        onError: (error) => { console.error('ERROR AL BORRAR ARCHIVO', error.message) }
    });
    
    return { uploadFile, eraseFile };
}