export interface User{
    uid: string,
    email: string,
	password: string,
    username: string,
    role: string,
    isEnabled: Boolean,
    isVerified: Boolean,
    providerId: string
}