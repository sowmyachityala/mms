export interface User {
    id: string;
    name: string;
    userName: string;
    roleName: string;
    email: string;
    lastLoggedIn?: string;
    avatar?: string;
    status?: string;
    roleObject: string;
    phoneNumber:string;
    profilePictureUri?:string;
    userId?:string;
}
