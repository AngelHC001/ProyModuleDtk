import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = import.meta.env.VITE_API_URL;

export function useUserCallbacks(userData){
    const queryClient = useQueryClient();
    const queryKey = ['users'];

    const addUser = useMutation({
        mutationFn: async(userData) => {
            const response = await fetch(`${API_URL}/s3_users.php`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            return response.json();
        },
        onSuccess: () => { queryClient.invalidateQueries(queryKey) },
        onError: (err) => { console.error('Algo salio mal (User) ' + err.message)}
    });

    const deleteUser = useMutation({
        mutationFn: async(userData) =>{
            const response = await fetch(`${API_URL}/s3_users.php`, {
                method: 'DELETE',
                headers: {'Content-Type': 'application/json' },
                body: JSON.stringify(userData)
            });

            return response.json();
        },
        onSuccess: () => {queryClient.invalidateQueries(queryKey)},
        onError: (err) => {console.error('Algo salio mal (User) ' + err.message)}
    });

    return {addUser, deleteUser};
}