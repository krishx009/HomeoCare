'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '@/contexts/AuthContext';
import {
  signIn as firebaseSignIn,
  signUp as firebaseSignUp,
  signInWithGoogle as firebaseSignInWithGoogle,
  logout as firebaseLogout,
  sendPhoneVerificationCode,
  verifyPhoneCode,
} from '@/contexts/AuthContext';
import { SignInData, SignUpData } from '@/types';

export function useAuthUser() {
  const { user, loading } = useAuth();
  
  return useQuery({
    queryKey: ['auth', 'user'],
    queryFn: () => user,
    enabled: !loading,
    staleTime: Infinity,
  });
}

export function useSignIn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SignInData) => firebaseSignIn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });
}

export function useSignUp() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (data: SignUpData) => firebaseSignUp(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });
}

export function useGoogleSignIn() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => firebaseSignInWithGoogle(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: () => firebaseLogout(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
      queryClient.clear();
    },
  });
}

export function usePhoneAuth() {
  const queryClient = useQueryClient();
  
  const sendCode = useMutation({
    mutationFn: (phoneNumber: string) => sendPhoneVerificationCode(phoneNumber),
  });
  
  const verifyCode = useMutation({
    mutationFn: (code: string) => verifyPhoneCode(code),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['auth', 'user'] });
    },
  });
  
  return { sendCode, verifyCode };
}
