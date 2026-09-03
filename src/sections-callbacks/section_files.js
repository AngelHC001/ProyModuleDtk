import { useMutation, useQueryClient } from "@tanstack/react-query"; 
const API_URL = import.meta.env.VITE_API_URL;

export function useUploadCallbacks(uploadData){
    const queryClient = useQueryClient();
    const queryKey = ['uploads']
    
    //lega como formData
    const uploadFile = useMutation({
        mutationFn: async(uploadData) => {
            const response = await fetch(`${API_URL}/s2_file_process.php`,{
                method:'POST',
                headers: {'Content-Type':'application/json'},
                body: uploadData
            });
            
            return await response.json();
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
    
            return response.json();
        },
        onSuccess: () => {queryClient.invalidateQueries({queryKey})},
        onError: (err) => { console.error('ERROR AL SUBIR ARCHIVO', err.message) }
    });
    
    return {uploadFile, eraseFile};
}