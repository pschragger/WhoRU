/**
 * Form component for setting up a new customer account.
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

export default CustomerSetupForm;
