export const useNavLink = (path: string, exact = false) => {
    const route = useRoute();
    
    return computed(() => {
        if (exact) return route.path === path;
        return route.path.startsWith(path);
    });
};