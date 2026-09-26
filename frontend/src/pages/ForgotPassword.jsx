import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Box, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    try {
      await authService.requestOTP(email);
      setStep(2);
      toast.success('OTP sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to send OTP');
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await authService.resetPassword(email, otp, newPassword);
      toast.success('Verified! Please login with new password.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.error || 'Invalid OTP or failed to reset');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-indigo-600 p-2.5 rounded-xl shadow-lg">
            <Box className="w-8 h-8 text-white" />
          </div>
        </div>
        <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
          {step === 1 ? 'Reset your password' : 'Enter verification code'}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          {step === 1 ? 'Enter your email and we will send you a verification code.' : `We sent a code to ${email}`}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl shadow-gray-200/50 sm:rounded-2xl sm:px-10 border border-gray-100">
          {step === 1 ? (
            <form className="space-y-6" onSubmit={handleSendOtp}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email address</label>
                <div className="mt-1">
                  <input
                    type="email" required
                    value={email} onChange={e => setEmail(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                >
                  Send OTP
                </button>
              </div>
              
              <div className="text-center">
                <Link to="/login" className="inline-flex items-center text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to login
                </Link>
              </div>
            </form>
          ) : (
            <form className="space-y-6" onSubmit={handleVerify}>
              <div>
                <label className="block text-sm font-medium text-gray-700">Verification Code</label>
                <div className="mt-1">
                  <input
                    type="text" required placeholder="000000"
                    value={otp} onChange={e => setOtp(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 text-center tracking-widest text-lg placeholder-gray-300 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">New Password</label>
                <div className="mt-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'} required
                    value={newPassword} onChange={e => setNewPassword(e.target.value)}
                    className="block w-full appearance-none rounded-lg border border-gray-300 px-3 py-2.5 pr-10 placeholder-gray-400 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 transition-colors"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-lg border border-transparent bg-indigo-600 py-2.5 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all"
                >
                  Verify & Reset Password
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
