'use client';

import dynamic from 'next/dynamic';
import { forwardRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { useForm } from 'react-hook-form';
import { Logo } from '@/components/layout/sidebar/header/Logo';
import { SkeletonLoader } from '@/ui/SkeletonLoader';
import { Button } from '@/ui/button/Button';
import { Field } from '@/ui/field/Field';
import { SwitchAuth } from './SwitchAuth';
import type { IAuthForm } from './auth-form.types';
import { useAuthForm } from './useAuthForm';

const DynamicRecaptcha = dynamic(() =>
    import('./Recaptcha').then((mod) => mod.Recaptcha),
);
const ForwardedRefRecaptcha = forwardRef<ReCAPTCHA>((props, ref) => (
    <DynamicRecaptcha {...props} forwardedRef={ref} />
));
ForwardedRefRecaptcha.displayName = 'ForwardedRefRecaptcha';

export function Auth() {
    const [isLogin, setIsLogin] = useState(true);

    const {
        register,
        handleSubmit,
        formState: { errors },
        watch,
        reset,
    } = useForm<IAuthForm>({
        mode: 'onChange',
    });

    const { isLoading, onSubmit, recaptchaRef } = useAuthForm(
        isLogin ? 'login' : 'register',
        reset,
    );

    return (
        <div className="w-screen h-screen flex justify-center items-center">
            <div className="w-1/6 p-layout border-border border rounded">
                <div className="text-center mb-1">
                    <Logo />
                </div>

                <SwitchAuth isLogin={isLogin} setIsLogin={setIsLogin} />

                <form onSubmit={handleSubmit(onSubmit)}>
                    {isLoading ? (
                        <SkeletonLoader count={3} />
                    ) : (
                        <>
                            <Field
                                label="Login or email"
                                // type="ggg"
                                registration={register('loginOrEmail', {
                                    required: 'Email is required!',
                                })}
                                error={errors.loginOrEmail?.message}
                                placeholder="Enter login or email:"
                            />
                            <Field
                                label="Password"
                                type="password"
                                registration={register('password', {
                                    required: 'Password is required!',
                                })}
                                error={errors.password?.message}
                                placeholder="Enter password:"
                            />
                            {!isLogin && (
                                <Field
                                    label="Password confirmation"
                                    type="password"
                                    registration={register('confirmPassword', {
                                        required:
                                            'Password confirmation is required!',
                                        validate: (value) =>
                                            value === watch('password') ||
                                            'Passwords don`t match!',
                                    })}
                                    error={errors.confirmPassword?.message}
                                    placeholder="Enter password again:"
                                />
                            )}

                            <ForwardedRefRecaptcha ref={recaptchaRef} />
                        </>
                    )}

                    <div className="text-center mt-4">
                        <Button type="submit" isLoading={isLoading}>
                            {isLogin ? 'Login' : 'Register'}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
