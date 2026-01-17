'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { usePhoneAuth } from '@/hooks/useAuth';
import { setupRecaptcha } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const phoneSchema = z.object({
  phoneNumber: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number format. Use E.164 format (e.g., +1234567890)'),
});

const codeSchema = z.object({
  code: z.string().length(6, 'Verification code must be 6 digits'),
});

type PhoneFormData = z.infer<typeof phoneSchema>;
type CodeFormData = z.infer<typeof codeSchema>;

export default function PhoneAuthPage() {
  const router = useRouter();
  const { toast } = useToast();
  const { sendCode, verifyCode } = usePhoneAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  const phoneForm = useForm<PhoneFormData>({
    resolver: zodResolver(phoneSchema),
  });

  const codeForm = useForm<CodeFormData>({
    resolver: zodResolver(codeSchema),
  });

  useEffect(() => {
    setupRecaptcha('recaptcha-container');
  }, []);

  const onSendCode = async (data: PhoneFormData) => {
    setIsLoading(true);
    try {
      const result = await sendCode.mutateAsync(data.phoneNumber);
      
      if (result.success) {
        setCodeSent(true);
        toast({
          title: 'Success',
          description: 'Verification code sent to your phone',
        });
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to send verification code',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onVerifyCode = async (data: CodeFormData) => {
    setIsLoading(true);
    try {
      const result = await verifyCode.mutateAsync(data.code);
      
      if (result.success) {
        toast({
          title: 'Success',
          description: 'Phone number verified successfully',
        });
        router.push('/dashboard');
      } else {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: result.error || 'Failed to verify code',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'An unexpected error occurred',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Phone Authentication
          </CardTitle>
          <CardDescription className="text-center">
            {codeSent
              ? 'Enter the verification code sent to your phone'
              : 'Enter your phone number to receive a verification code'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!codeSent ? (
            <form onSubmit={phoneForm.handleSubmit(onSendCode)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  placeholder="+1234567890"
                  {...phoneForm.register('phoneNumber')}
                  disabled={isLoading}
                />
                {phoneForm.formState.errors.phoneNumber && (
                  <p className="text-sm text-destructive">
                    {phoneForm.formState.errors.phoneNumber.message}
                  </p>
                )}
                <p className="text-xs text-muted-foreground">
                  Include country code (e.g., +1 for USA)
                </p>
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Send Verification Code
              </Button>
            </form>
          ) : (
            <form onSubmit={codeForm.handleSubmit(onVerifyCode)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Verification Code</Label>
                <Input
                  id="code"
                  type="text"
                  placeholder="123456"
                  maxLength={6}
                  {...codeForm.register('code')}
                  disabled={isLoading}
                />
                {codeForm.formState.errors.code && (
                  <p className="text-sm text-destructive">
                    {codeForm.formState.errors.code.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Verify Code
              </Button>

              <Button
                type="button"
                variant="ghost"
                className="w-full"
                onClick={() => setCodeSent(false)}
                disabled={isLoading}
              >
                Use Different Number
              </Button>
            </form>
          )}

          <div id="recaptcha-container" className="mt-4"></div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Link
            href="/auth/signin"
            className="text-sm text-primary hover:underline"
          >
            Back to Sign In
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
