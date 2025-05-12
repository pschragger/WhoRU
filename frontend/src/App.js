/**
 * Authentication Microservice - Frontend (React)
 * ---------------------------------------------
 * Provides the user interface for customer setup and login, supporting multiple
 * authentication providers (Google, Facebook, Apple) and localization.
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Google, Facebook, Apple, Loader2, User, KeyRound } from 'lucide-react';

// Mock API functions (replace with actual API calls)
const api = {
    setupCustomer: async (data: any) => {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate success or failure
        if (data.email && data.email.includes('error')) {
            throw new Error('Email address is already taken.');
        }
        return { success: true, message: 'Customer setup successful! Please check your email for verification.' };
    },
    login: async (data: any) => {
        await new Promise(resolve => setTimeout(resolve, 1000));
        if (data.email === 'invalid@example.com') {
            throw new Error('Invalid credentials');
        }
        return { success: true, token: 'mock-auth-token', user: { email: data.email } };
    },
    loginWithProvider: async (provider: string) => {
        await new Promise(resolve => setTimeout(resolve, 1200));
        // Simulate different provider behavior
        switch (provider) {
            case 'google':
                return { success: true, token: 'mock-google-token', user: { email: 'googleuser@example.com' } };
            case 'facebook':
                return { success: true, token: 'mock-facebook-token', user: { email: 'facebookuser@example.com' } };
            case 'apple':
                return { success: true, token: 'mock-apple-token', user: { email: 'appleuser@example.com' } };
            default:
                throw new Error(`Unsupported provider: ${provider}`);
        }
    },
};

// Localization setup (using i18next)
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
    .use(initReactI18next) // passes i18n down to react-i18next
    .init({
        resources: {
            en: {
                translation: {
                    "appTitle": "Authentication Service",
                    "welcome": "Welcome",
                    "setupTitle": "Set up your account",
                    "loginTitle": "Login to your account",
                    "email": "Email",
                    "password": "Password",
                    "confirmPassword": "Confirm Password",
                    "firstName": "First Name",
                    "lastName": "Last Name",
                    "companyName": "Company Name",
                    "submit": "Submit",
                    "login": "Login",
                    "loginWith": "Login with {provider}",
                    "accountSetupSuccess": "Account setup successful! Please check your email for verification.",
                    "invalidCredentials": "Invalid email or password.",
                    "emailTaken": "Email address is already taken.",
                    "passwordMismatch": "Passwords do not match.",
                    "generalError": "An error occurred. Please try again.",
                    "missingFields": "Please fill in all required fields.",
                    "loading": "Loading...",
                    "google": "Google",
                    "facebook": "Facebook",
                    "apple": "Apple",
                    "newCustomerTitle": "New Customer Setup",
                    "returningCustomerTitle": "Returning Customer Login",
                    "emailVerificationSent": "Email verification sent! Please check your inbox.",
                    "language": "Language",
                    "english": "English",
                    "spanish": "Español",
                    "hebrew": "עברית",
                    "japanese": "日本語",
                }
            },
            es: {
                translation: {
                    "appTitle": "Servicio de Autenticación",
                    "welcome": "Bienvenido",
                    "setupTitle": "Configura tu cuenta",
                    "loginTitle": "Inicia sesión en tu cuenta",
                    "email": "Correo electrónico",
                    "password": "Contraseña",
                    "confirmPassword": "Confirmar contraseña",
                    "firstName": "Nombre",
                    "lastName": "Apellido",
                    "companyName": "Nombre de la empresa",
                    "submit": "Enviar",
                    "login": "Iniciar sesión",
                    "loginWith": "Iniciar sesión con {provider}",
                    "accountSetupSuccess": "¡Cuenta creada con éxito! Por favor, revisa tu correo electrónico para la verificación.",
                    "invalidCredentials": "Correo electrónico o contraseña no válidos.",
                    "emailTaken": "La dirección de correo electrónico ya está en uso.",
                    "passwordMismatch": "Las contraseñas no coinciden.",
                    "generalError": "Se produjo un error. Por favor, inténtelo de nuevo.",
                    "missingFields": "Por favor, rellene todos los campos requeridos.",
                    "loading": "Cargando...",
                    "google": "Google",
                    "facebook": "Facebook",
                    "apple": "Apple",
                    "newCustomerTitle": "Configuración de nuevo cliente",
                    "returningCustomerTitle": "Inicio de sesión de cliente recurrente",
                    "emailVerificationSent": "¡Verificación de correo electrónico enviada! Por favor, revise su bandeja de entrada.",
                    "language": "Idioma",
                    "english": "Inglés",
                    "spanish": "Español",
                    "hebrew": "Hebreo",
                    "japanese": "Japonés",
                }
            },
            he: {
                translation: {
                    "appTitle": "שירות אימות",
                    "welcome": "ברוך הבא",
                    "setupTitle": "הגדר את חשבונך",
                    "loginTitle": "התחבר לחשבונך",
                    "email": "אימייל",
                    "password": "סיסמה",
                    "confirmPassword": "אשר סיסמה",
                    "firstName": "שם פרטי",
                    "lastName": "שם משפחה",
                    "companyName": "שם חברה",
                    "submit": "שלח",
                    "login": "התחבר",
                    "loginWith": "התחבר באמצעות {provider}",
                    "accountSetupSuccess": "הגדרת החשבון הצליחה! אנא בדוק את האימייל שלך לאימות.",
                    "invalidCredentials": "אימייל או סיסמה לא נכונים.",
                    "emailTaken": "כתובת האימייל כבר תפוסה.",
                    "passwordMismatch": "הסיסמאות אינן תואמות.",
                    "generalError": "אירעה שגיאה. אנא נסה שוב.",
                    "missingFields": "אנא מלא את כל השדות הנדרשים.",
                    "loading": "טוען...",
                    "google": "גוגל",
                    "facebook": "פייסבוק",
                    "apple": "אפל",
                    "newCustomerTitle": "הגדרת לקוח חדש",
                    "returningCustomerTitle": "כניסת לקוח חוזר",
                    "emailVerificationSent": "אימות דוא\"ל נשלח! אנא בדוק את תיבת הדואר הנכנס שלך.",
                    "language": "שפה",
                    "english": "אנגלית",
                    "spanish": "ספרדית",
                    "hebrew": "עברית",
                    "japanese": "יפנית",
                }
            },
            ja: {
                translation: {
                    "appTitle": "認証サービス",
                    "welcome": "ようこそ",
                    "setupTitle": "アカウントを設定する",
                    "loginTitle": "アカウントにログインする",
                    "email": "メールアドレス",
                    "password": "パスワード",
                    "confirmPassword": "パスワードを確認する",
                    "firstName": "名",
                    "lastName": "姓",
                    "companyName": "会社名",
                    "submit": "送信",
                    "login": "ログイン",
                    "loginWith": "{provider} でログイン",
                    "accountSetupSuccess": "アカウント設定が完了しました！確認メールを確認してください。",
                    "invalidCredentials": "メールアドレスまたはパスワードが無効です。",
                    "emailTaken": "このメールアドレスはすでに使用されています。",
                    "passwordMismatch": "パスワードが一致しません。",
                    "generalError": "エラーが発生しました。もう一度お試しください。",
                    "missingFields": "すべての必須フィールドを入力してください。",
                    "loading": "読み込み中...",
                    "google": "グーグル",
                    "facebook": "フェイスブック",
                    "apple": "アップル",
                    "newCustomerTitle": "新規顧客設定",
                    "returningCustomerTitle": "リピーターログイン",
                    "emailVerificationSent": "メール認証を送信しました！受信箱を確認してください。",
                    "language": "言語",
                    "english": "英語",
                    "spanish": "スペイン語",
                    "hebrew": "ヘブライ語",
                    "japanese": "日本語",
                }
            }
        },
        lng: 'en', // Set default language
        fallbackLng: 'en',
        interpolation: {
            escapeValue: false // react already safes from xss
        }
    });

// Define form schemas using Zod
const setupSchema = z.object({
    firstName: z.string().min(1, { message: "First name is required" }),
    lastName: z.string().min(1, { message: "Last name is required" }),
    companyName: z.string().min(1, { message: "Company name is required" }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
    confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

// --- Components ---

/**
 * Form component for setting up a new customer account.
 */
const CustomerSetupForm = ({ onSubmit }: { onSubmit: (data: z.infer<typeof setupSchema>) => Promise<void> }) => {
    const { register, handleSubmit, control, formState: { errors, isSubmitting } } = useForm<z.infer<typeof setupSchema>>({
        resolver: zodResolver(setupSchema),
    });
    const { t } = useTranslation();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <Label htmlFor="firstName">{t('firstName')}</Label>
                <Input
                    {...register('firstName')}
                    placeholder={t('firstName')}
                    disabled={isSubmitting}
                    className={cn(errors.firstName && "border-red-500")}
                />
                {errors.firstName && <p className="text-red-500 text-sm mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
                <Label htmlFor="lastName">{t('lastName')}</Label>
                <Input
                    {...register('lastName')}
                    placeholder={t('lastName')}
                    disabled={isSubmitting}
                    className={cn(errors.lastName && "border-red-500")}
                />
                {errors.lastName && <p className="text-red-500 text-sm mt-1">{errors.lastName.message}</p>}
            </div>
            <div>
                <Label htmlFor="companyName">{t('companyName')}</Label>
                <Input
                    {...register('companyName')}
                    placeholder={t('companyName')}
                    disabled={isSubmitting}
                    className={cn(errors.companyName && "border-red-500")}
                />
                {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>}
            </div>
            <div>
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                    {...register('email')}
                    type="email"
                    placeholder={t('email')}
                    disabled={isSubmitting}
                    className={cn(errors.email && "border-red-500")}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                    {...register('password')}
                    type="password"
                    placeholder={t('password')}
                    disabled={isSubmitting}
                    className={cn(errors.password && "border-red-500")}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <div>
                <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                <Input
                    {...register('confirmPassword')}
                    type="password"
                    placeholder={t('confirmPassword')}
                    disabled={isSubmitting}
                    className={cn(errors.confirmPassword && "border-red-500")}
                />
                {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('loading')}
                    </>
                ) : (
                    t('submit')
                )}
            </Button>
            {errors.root && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errors.root.message}</AlertDescription>
                </Alert>
            )}
        </form>
    );
};

/**
 * Form component for logging in returning customers.
 */
const LoginForm = ({ onSubmit }: { onSubmit: (data: z.infer<typeof loginSchema>) => Promise<void> }) => {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
    });
    const { t } = useTranslation();

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div>
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                    {...register('email')}
                    type="email"
                    placeholder={t('email')}
                    disabled={isSubmitting}
                    className={cn(errors.email && "border-red-500")}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>
            <div>
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                    {...register('password')}
                    type="password"
                    placeholder={t('password')}
                    disabled={isSubmitting}
                    className={cn(errors.password && "border-red-500")}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t('loading')}
                    </>
                ) : (
                    t('login')
                )}
            </Button>
            {errors.root && (
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{errors.root.message}</AlertDescription>
                </Alert>
            )}
        </form>
    );
};

/**
 * Main application component.  Handles routing and authentication logic.
 */
const AuthApp = () => {
    const [isNewCustomer, setIsNewCustomer] = useState(true); // Toggle between new/returning customer
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [message, setMessage] = useState<string | null>(null); // For success messages
    const [user, setUser] = useState<any>(null); // Store logged-in user data
    const { t, i18n } = useTranslation();

    // Check for existing session (in a real app, check with backend)
    useEffect(() => {
        const token = localStorage.getItem('authToken');
        if (token) {
            // In a real app, you'd validate the token with your backend here
            // and fetch the user data.  For this example, we'll just set a mock user.
            setUser({ email: 'existinguser@example.com' }); // Mock user
        }
    }, []);

    const handleSetup = async (data: z.infer<typeof setupSchema>) => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await api.setupCustomer(data);
            setMessage(response.message); // Show success message
            // In a real app, you might automatically log the user in after setup
            // or redirect them to a verification page.
            setIsNewCustomer(false); // For this example, stay on setup page
        } catch (err: any) {
            setError(err.message || t('generalError'));
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (data: z.infer<typeof loginSchema>) => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await api.login(data);
            localStorage.setItem('authToken', response.token); // Store token
            setUser(response.user);
        } catch (err: any) {
            setError(err.message || t('generalError'));
        } finally {
            setLoading(false);
        }
    };

    const handleLoginWithProvider = async (provider: string) => {
        setLoading(true);
        setError(null);
        setMessage(null);
        try {
            const response = await api.loginWithProvider(provider);
            localStorage.setItem('authToken', response.token);
            setUser(response.user);
        } catch (err: any) {
            setError(err.message || t('generalError'));
        } finally {
            setLoading(false);
        }
    };

    const handleLanguageChange = (lng: string) => {
        i18n.changeLanguage(lng);
    };

    if (user) {
        return (
            <div className="flex items-center justify-center h-screen bg-gray-100 dark:bg-gray-900">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
                        {t('welcome')}!
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Logged in as: {user.email}
                    </p>
                    {/* Add a link to a profile page or a logout button. */}
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center justify-center">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6">
                <div className="flex justify-end">
                    <select
                        value={i18n.language}
                        onChange={(e) => handleLanguageChange(e.target.value)}
                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-32 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    >
                        <option value="en">{t('english')}</option>
                        <option value="es">{t('spanish')}</option>
                        <option value="he">{t('hebrew')}</option>
                        <option value="ja">{t('japanese')}</option>
                    </select>
                </div>
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-white text-center">
                    {isNewCustomer ? t('newCustomerTitle') : t('returningCustomerTitle')}
                </h1>

                {error && (
                    <Alert variant="destructive">
                        <AlertTitle>Error</AlertTitle>
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}
                {message && (
                    <Alert>
                        <AlertTitle>Success</AlertTitle>
                        <AlertDescription>{message}</AlertDescription>
                    </Alert>
                )}

                {isNewCustomer ? (
                    <CustomerSetupForm onSubmit={handleSetup} />
                ) : (
                    <LoginForm onSubmit={handleLogin} />
                )}

                <div className="flex items-center justify-center gap-4">
                    <Button
                        variant="outline"
                        onClick={() => handleLoginWithProvider('google')}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <Google className="w-4 h-4" />
                        {t('loginWith', { provider: t('google') })}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleLoginWithProvider('facebook')}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <Facebook className="w-4 h-4" />
                        {t('loginWith', { provider: t('facebook') })}
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => handleLoginWithProvider('apple')}
                        disabled={loading}
                        className="flex items-center gap-2"
                    >
                        <Apple className="w-4 h-4" />
                        {t('loginWith', { provider: t('apple') })}
                    </Button>
                </div>

                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <button
                        onClick={() => setIsNewCustomer(!isNewCustomer)}
                        className="underline hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
                    >
                        {isNewCustomer
                            ? t('returningCustomerTitle')
                            : t('newCustomerTitle')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AuthApp;
