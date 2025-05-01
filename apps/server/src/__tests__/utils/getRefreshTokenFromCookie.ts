export const getRefreshTokenFromCookie = (cookie?: string | string[]) => {
    const cookieArray = Array.isArray(cookie) ? cookie : cookie ? [cookie] : [];
    const result = cookieArray
        ?.find((item: string) => item.split('=')[0] === 'refreshToken')
        ?.split('=')[1];
    return result?.split(';')[0];
};
