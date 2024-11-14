'use client';
import React, { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import Image from 'next/image';
import Link from 'next/link';
import { createAccount } from '@/lib/actions/user.actions';
import OtpModal from './OTPModal';

type FormType = 'sign-in' | 'sign-up';

const authFormSchema = (formType: FormType) => {
  return z.object({
    email: z.string().email(),
    fullName:
      formType === 'sign-up'
        ? z.string().min(2).max(50)
        : z.string().optional(),
  });
};

const AuthForm = ({ type }: { type: FormType }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState('');
  const [accountId, setAccountId] = useState(null);

  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: '',
      email: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessages('');

    try {
      const user = await createAccount({
        fullName: values.fullName || '',
        email: values.email,
      });
      setAccountId(user.accountId);
    } catch (error) {
      setErrorMessages('Failed to create an account. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1>{type === 'sign-in' ? 'Sign In' : 'Sign Up'}</h1>
          {type === 'sign-up' && (
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <div className="shad-form-item">
                    <FormLabel className="shad-form-label">Full Name</FormLabel>
                    <FormControl>
                      <Input
                        className="shad-input"
                        placeholder="Enter your full name"
                        {...field}
                      />
                    </FormControl>
                  </div>

                  <FormMessage className="shad-form-message" />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className="shad-form-item">
                  <FormLabel className="shad-form-label">Email</FormLabel>
                  <FormControl>
                    <Input
                      className="shad-input"
                      placeholder="Enter your email"
                      {...field}
                    />
                  </FormControl>
                </div>

                <FormMessage className="shad-form-message" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="form-submit-button"
            disabled={isLoading}
          >
            {type === 'sign-in' ? 'Sign In' : 'Sign Up'}

            {isLoading && (
              <Image
                src="/assets/icons/loader.svg"
                width={20}
                height={20}
                alt="loader"
                className="ml-2 animate-spin"
              />
            )}
          </Button>

          {errorMessages && <p className="error-message">*{errorMessages}</p>}

          <div className="body-2 flex justify-center">
            <p className="text-light-100">
              {type === 'sign-in'
                ? 'New to our platform?'
                : 'Already have an account?'}
            </p>
            <Link
              href={type === 'sign-in' ? '/sign-up' : '/sign-in'}
              className="ml-1 font-medium text-brand"
            >
              {type === 'sign-in' ? 'Sign In' : 'Sign up'}
            </Link>
          </div>
        </form>
      </Form>
      {/* OPT Verfication */}
      {accountId && (
        <OtpModal email={form.getValues('email')} accountId={accountId} />
      )}
    </>
  );
};

export default AuthForm;
