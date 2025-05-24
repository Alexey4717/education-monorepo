export interface IAuthData {
    loginOrEmail: string;
    password: string;
}

export interface IAuthForm extends IAuthData {
    confirmPassword?: string;
}
