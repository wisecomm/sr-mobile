export interface UserInfo {
    userId: string;
    userName: string;
    userEmail: string;
    roles: string[];
    createdAt?: string;
    lastLoginAt?: string;
}

export interface LoginData {
    token: string;
    refreshToken: string;
    tokenType: string;
    expiresIn: number;
    user: UserInfo;
}
