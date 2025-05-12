/**
 * Form component for logging in returning customers.
 */
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { Loader2 } from 'lucide-react';

// Define form schema using Zod
const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(8, { message: "Password must be at least 8 characters" }),
});

const AuthForm = ({ onSubmit }: { onSubmit: (data: z.infer<typeof loginSchema>) => Promise<void> }) => {
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

export default AuthForm;