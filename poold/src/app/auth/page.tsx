import { AuthForm } from '@/components/auth/auth-form';
import Image from 'next/image';

export default function AuthPage() {
  return (
    <main className="min-h-screen flex flex-col md:flex-row">
      {/* Left section - Brand/Hero */}
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-purple-600 to-indigo-700 p-12 text-white flex-col justify-center items-center">
        <div className="max-w-md mx-auto space-y-8">
          <h1 className="text-4xl font-bold tracking-tight">poold</h1>
          <p className="text-xl text-purple-100">Split subscriptions with friends effortlessly</p>
          <div className="space-y-6 mt-8">
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-purple-100">Link everyone's cards and pay together</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-purple-100">Automatically split costs equally or customize</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-white/10 p-3 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-purple-100">Share subscriptions with friends socially</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right section - Auth form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center md:hidden">
            <h1 className="text-3xl font-bold tracking-tight">poold</h1>
            <p className="text-zinc-500 mt-2">Split subscriptions with friends</p>
          </div>
          <AuthForm />
        </div>
      </div>
    </main>
  );
} 