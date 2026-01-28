import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { login, logout } from "@/app/actions/auth-actions";
import { authService } from "@/lib/auth/auth-service";

export const USER_QUERY_KEY = ['currentUser'];

export function useCurrentUser() {
    return useQuery({
        queryKey: USER_QUERY_KEY,
        queryFn: () => authService.getCurrentUser(),
        staleTime: 5 * 60 * 1000, // 5 minutes
        gcTime: 10 * 60 * 1000, // 10 minutes
        retry: false,
    });
}

export function useLogin() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (formData: FormData) => {
            const res = await login(formData);
            if (res.code !== "200") throw new Error(res.message);
            return res;
        },
        onSuccess: (res) => {
            if (res.data) {
                // Invalidate query to refetch user data if needed, or set it directly
                queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
            }
        },
    });
}

export function useLogout() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async () => authService.logout(),
        onSuccess: () => {
            // Clear user data from cache
            queryClient.setQueryData(USER_QUERY_KEY, null);
            queryClient.invalidateQueries({ queryKey: USER_QUERY_KEY });
        },
    });
}
