"use client"

import { useEffect, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { authService } from "@/services/Authentication"
import { Button } from "@/components/ui/button"

export function EmailConfirmation() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
    const [message, setMessage] = useState('')

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const token = searchParams.get('token')
                if (!token) {
                    setStatus('error')
                    setMessage('No confirmation token found')
                    return
                }

                const response = await authService.confirmEmail(token)
                setStatus('success')
                setMessage(response.message || 'Email confirmed successfully')
                
                // // Redirect to home page after a short delay
                // setTimeout(() => {
                //     navigate('/')
                // }, 2000)
            } catch (error: any) {
                setStatus('error')
                setMessage(error.message)
            }
        }

        confirmEmail()
    }, [navigate, searchParams])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="w-full max-w-md p-8 space-y-4 bg-white rounded-lg shadow-lg">
                <h1 className="text-2xl font-bold text-center">
                    {status === 'loading' ? 'Confirming your email...' :
                     status === 'success' ? 'Email Confirmed!' :
                     'Confirmation Failed'}
                </h1>
                
                {message && (
                    <p className={`text-center ${
                        status === 'success' ? 'text-green-600' :
                        status === 'error' ? 'text-red-600' :
                        'text-gray-600'
                    }`}>
                        {message}
                    </p>
                )}

                {/* {status === 'success' && (
                    <p className="text-center text-gray-600">
                        Redirecting you to the home page...
                    </p>
                )}

                {status === 'error' && (
                    <div className="flex justify-center">
                        <Button onClick={() => navigate('/login')}>
                            Go to Login
                        </Button>
                    </div>
                )} */}
            </div>
        </div>
    )
} 