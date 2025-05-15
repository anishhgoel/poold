'use client';

import { useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { createClient } from '@/lib/supabase';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';

export function AuthForm() {
  const supabase = createClient();
  const [view, setView] = useState<'sign_in' | 'sign_up'>('sign_in');

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-zinc-200">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">{view === 'sign_in' ? 'Welcome back' : 'Create an account'}</CardTitle>
        <CardDescription className="text-zinc-500">
          {view === 'sign_in' 
            ? 'Sign in to manage your shared subscriptions' 
            : 'Sign up to start splitting subscriptions with friends'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Auth
          supabaseClient={supabase}
          view={view}
          appearance={{ 
            theme: ThemeSupa,
            extend: true,
            className: {
              container: 'flex flex-col gap-4',
              button: 'rounded-md px-4 py-2 text-center transition-colors',
              input: 'rounded-md px-4 py-2 border border-zinc-200',
              divider: 'my-4 bg-zinc-200',
              label: 'text-sm font-medium text-zinc-700 mb-1',
            },
            variables: {
              default: {
                colors: {
                  brand: '#7c3aed',
                  brandAccent: '#6d28d9',
                  inputText: '#27272a',
                  inputLabelText: '#52525b',
                  inputPlaceholder: '#a1a1aa',
                  inputBackground: 'white',
                  inputBorder: '#e4e4e7',
                  anchorTextColor: '#7c3aed',
                  anchorTextHoverColor: '#6d28d9',
                }
              }
            }
          }}
          providers={['google', 'apple']}
          redirectTo={`${window.location.origin}/auth/callback`}
        />
      </CardContent>
      <CardFooter className="flex flex-col">
        <div className="text-center text-sm">
          {view === 'sign_in' ? (
            <button 
              className="text-zinc-500 hover:text-zinc-800 transition-colors" 
              onClick={() => setView('sign_up')}
            >
              Don't have an account? Sign up
            </button>
          ) : (
            <button 
              className="text-zinc-500 hover:text-zinc-800 transition-colors" 
              onClick={() => setView('sign_in')}
            >
              Already have an account? Sign in
            </button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
} 