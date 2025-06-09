import api from "@/config/api";

interface LoginRequest{
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: {
        id: string;
        email: string;
        firstName: string;
        lastName: string;
    }
}

interface SignupRequest{
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface SignupResponse {
    message: string;
    success: boolean;
}

interface VerifyEmailRequest {
    token: string;
}

interface VerifyEmailResponse {
    success: boolean;
    message: string;
    token?: string;  // Optional token that might be returned after verification
}

interface ForgotPasswordRequest {
    email: string;
}

interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}

interface ChangePasswordRequest {
    newPassword: string;
    token: string;  // Token received from the reset password email link
}

interface ChangePasswordResponse {
    success: boolean;
    message: string;
}

// Custom event for auth state changes
const dispatchAuthEvent = () => {
    window.dispatchEvent(new Event('authStateChange'));
};

export const authService = {
    login: async (request: LoginRequest) => {
        try {
            const response = await api.post<LoginResponse>('/user-service/api/auth/login', request);
            
            // Check if we have a valid token in the response
            if (!response.data.token) {
                throw new Error('Invalid response: No token received');
            }

            // Store the token in localStorage
            localStorage.setItem('token', response.data.token);
            dispatchAuthEvent();
            return response.data;
        } catch (error: any) {
            // Remove any existing token on failed login
            localStorage.removeItem('token');
            dispatchAuthEvent();
            
            // Rethrow the error with a more specific message
            if (error.response?.status === 401) {
                throw new Error('Invalid email or password');
            } else if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            } else {
                throw new Error('An error occurred during login');
            }
        }
    },

    signup: async (request: SignupRequest) => {
        const response = await api.post<SignupResponse>('/user-service/api/auth/register', request);
        return response.data;
    },

    verifyEmail: async (token: string) => {
        const request: VerifyEmailRequest = { token };
        const response = await api.post<VerifyEmailResponse>('/user-service/api/auth/verify-email', request);
        if (response.data.success) {
            // After email verification, we might get a login token directly
            if (response.data.token) {
                localStorage.setItem('token', response.data.token);
                dispatchAuthEvent();
            }
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        dispatchAuthEvent();
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    forgotPassword: async (request: ForgotPasswordRequest) => {
        const response = await api.post<ForgotPasswordResponse>('/user-service/api/auth/forgot-password', request);
        return response.data;
    },

    changePassword: async (request: ChangePasswordRequest) => {
        const response = await api.post<ChangePasswordResponse>('/user-service/api/auth/change-password', request);
        return response.data;
    }
}

