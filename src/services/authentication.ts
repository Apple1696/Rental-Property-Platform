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

interface EmailConfirmationResponse {
    success: boolean;
    message: string;
    token?: string;
}

interface ForgotPasswordRequest {
    email: string;
}

interface ForgotPasswordResponse {
    success: boolean;
    message: string;
}

interface ResetPasswordRequest {
    token: string;
    password: string;
}

interface ResetPasswordResponse {
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

    confirmEmail: async (token: string) => {
        try {
            const response = await api.get<EmailConfirmationResponse>(`/user-service/api/user/confirm?token=${token}`);
            
            if (response.data.success && response.data.token) {
                // Store the token in localStorage if provided
                localStorage.setItem('token', response.data.token);
                dispatchAuthEvent();
            }
            
            return response.data;
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Email confirmation failed';
            throw new Error(errorMessage);
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        dispatchAuthEvent();
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('token');
    },

    forgotPassword: async (request: ForgotPasswordRequest) => {
        try {
            console.log('Sending forgot password request:', request);
            const response = await api.post<ForgotPasswordResponse>('/user-service/api/user/forget-password', request);
            console.log('Forgot password response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Forgot password error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            throw error;
        }
    },

    resetPassword: async (request: ResetPasswordRequest) => {
        try {
            console.log('Sending reset password request:', request);
            const response = await api.post<ResetPasswordResponse>('/user-service/api/user/reset-password', request);
            console.log('Reset password response:', response.data);
            return response.data;
        } catch (error: any) {
            console.error('Reset password error:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status,
                config: error.config
            });
            throw error;
        }
    }
}

