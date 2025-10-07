import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Rocket, Eye, EyeOff, Mail, Lock, AlertCircle, Zap, Users, TrendingUp, Sparkles, Star, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { userAPI, handleAPIError } from "../services/api";
import { GoogleLogin, googleLogout, useGoogleLogin } from "@react-oauth/google";
import { motion } from "framer-motion";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [focusedField, setFocusedField] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("Login attempt:", formData);

      // Make the API call to the login endpoint
      const response = await userAPI.login(formData);

      console.log("Login successful:", response);
      
      // Handle successful login
      if (response.message) {
        // Store user information
        const { fullName, role } = response;
        localStorage.setItem('userName', fullName);
        localStorage.setItem('userRole', role);
        localStorage.setItem('isLoggedIn', 'true');
        
        // Show success message briefly before redirecting
        setError(""); // Clear any previous errors
        setIsLoading(false);
        
        // Show success message
        const successMessage = "Login successful! Redirecting...";
        
        // Create a temporary success element
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4';
        successDiv.textContent = successMessage;
        
        // Insert success message
        const form = document.querySelector('form');
        form.insertBefore(successDiv, form.firstChild);
        
        // Redirect based on user role after a brief delay
        setTimeout(() => {
          console.log('Redirecting user role:', role);
          const isAdminEmail = (formData.email || '').toLowerCase().trim() === 'divyprakashpandey6@gmail.com';
          try { localStorage.setItem('userEmail', (formData.email || '').toLowerCase().trim()); } catch {}
          if (isAdminEmail) {
            window.location.href = '/admin-dashboard';
          } else if (role === 'adopter') {
            // Redirect adopters to the startups feed page
            console.log('Redirecting adopter to startups feed page...');
            window.location.href = `/startups-feed?name=${encodeURIComponent(fullName)}`;
          } else if (role === 'founder') {
            // Redirect founders to their dashboard
            console.log('Redirecting founder to dashboard...');
            window.location.href = '/founder-dashboard';
          } else {
            // Redirect to home for any other role
            console.log('Redirecting to home...');
            window.location.href = '/';
          }
        }, 1500); // 1.5 second delay to show success message
      } else {
        setError(response.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      const errorInfo = handleAPIError(error);
      setError(errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginSuccess = async (credentialResponse) => {
    try {
      setIsLoading(true);
      setError("");
      // @react-oauth/google's useGoogleLogin returns either an access_token (OAuth) or a credential (One Tap)
      const accessToken = credentialResponse?.access_token;
      const idToken = credentialResponse?.credential;
      const payload = accessToken ? { accessToken } : { credential: idToken };
      const response = await userAPI.googleLogin(payload);
      if (response.message) {
        const { fullName, role, email } = response;
        localStorage.setItem('userName', fullName);
        localStorage.setItem('userRole', role);
        localStorage.setItem('isLoggedIn', 'true');
        try { if (email) localStorage.setItem('userEmail', (email || '').toLowerCase()); } catch {}
        setTimeout(() => {
          const adminEmail = 'divyprakashpandey6@gmail.com';
          if ((email || '').toLowerCase() === adminEmail) {
            window.location.href = '/admin-dashboard';
          } else if (role === 'adopter') {
            window.location.href = `/startups-feed?name=${encodeURIComponent(fullName)}`;
          } else if (role === 'founder') {
            window.location.href = '/founder-dashboard';
          } else {
            window.location.href = '/';
          }
        }, 300);
      } else {
        setError(response.message || "Google login failed");
      }
    } catch (err) {
      const info = handleAPIError(err);
      if (info.status === 404 && info.data?.needsSignup) {
        setError('Account not found. Please sign up first. Redirecting to signup...');
        setTimeout(() => { window.location.href = '/signup'; }, 800);
        return;
      }
      setError(info.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLoginError = () => {
    setError("Google login failed. Please try again.");
  };

  // Custom Google login trigger for styled button
  const startGoogleLogin = useGoogleLogin({
    onSuccess: handleGoogleLoginSuccess,
    onError: handleGoogleLoginError,
    flow: "implicit",
  });

  return (
    <div className="min-h-screen w-full relative">
      {/* Premium animated background matching Hero.jsx */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden>
        {/* Primary gradient */}
        <div className="absolute inset-x-0 top-[-10rem] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[-20rem]">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-blue-400 via-blue-500 to-blue-600 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{ clipPath: 'polygon(74.1% 44.1%,100% 61.6%,97.5% 26.9%,85.5% 0.1%,80.7% 2%,72.5% 32.5%,60.2% 62.4%,52.4% 68.1%,47.5% 58.3%,45.2% 34.5%,27.5% 76.7%,0.1% 64.9%,17.9% 100%,27.6% 76.8%,76.1% 97.7%,74.1% 44.1%)' }}
          />
        </div>
        
        {/* Secondary gradient */}
        <div className="absolute inset-x-0 bottom-0 -z-10 transform-gpu overflow-hidden blur-3xl">
          <div
            className="relative left-[calc(50%+11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[-15deg] bg-gradient-to-tr from-blue-300 via-blue-400 to-blue-500 opacity-15 sm:left-[calc(50%+20rem)] sm:w-[60rem]"
            style={{ clipPath: 'polygon(74.1% 44.1%,100% 61.6%,97.5% 26.9%,85.5% 0.1%,80.7% 2%,72.5% 32.5%,60.2% 62.4%,52.4% 68.1%,47.5% 58.3%,45.2% 34.5%,27.5% 76.7%,0.1% 64.9%,17.9% 100%,27.6% 76.8%,76.1% 97.7%,74.1% 44.1%)' }}
          />
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 opacity-60 floating-element" />
        <div className="absolute top-40 right-20 w-16 h-16 rounded-full bg-gradient-to-br from-purple-100 to-purple-200 opacity-50 floating-element-delayed" />
        <div className="absolute bottom-40 left-20 w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-green-200 opacity-40 floating-element-slow" />
      </div>
      
      <motion.div 
        className="relative z-10 min-h-screen flex font-['Inter',sans-serif]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
      {/* Left Panel - Content Section with Enhanced Design */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 relative overflow-hidden">
        {/* Enhanced Animated Background Elements */}
        <div className="absolute inset-0">
          {/* Floating Abstract Shapes */}
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-32 w-96 h-96 bg-gradient-to-br from-white/5 to-white/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute bottom-32 left-16 w-80 h-80 bg-gradient-to-br from-white/8 to-white/3 rounded-full blur-3xl animate-float-slow" />
          
          {/* Floating Stars and Sparkles */}
          <div className="absolute top-32 left-1/3 text-white/20 animate-bounce">
            <Star className="h-6 w-6" />
          </div>
          <div className="absolute top-1/2 right-1/4 text-white/15 animate-bounce delay-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="absolute bottom-1/3 left-1/4 text-white/20 animate-bounce delay-700">
            <Star className="h-5 w-5" />
          </div>
          
          {/* Gradient Orbs */}
          <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-500" />
        </div>
        
        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-24 py-20 text-white">
          {/* Logo and Brand */}
          <div className="mb-16 animate-fade-in">
            <div className="flex items-center space-x-5 mb-8">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm shadow-2xl border border-white/20">
                <Rocket className="h-8 w-8 text-white" />
              </div>
              <span className="text-4xl font-semibold text-white">LaunchSignal</span>
            </div>
            <div className="inline-flex items-center px-6 py-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
              <Zap className="h-4 w-4 mr-3 text-blue-300" />
              <span className="text-sm font-medium tracking-wider text-slate-200">CONNECT & LAUNCH</span>
            </div>
          </div>

          {/* Main Heading */}
          <div className="mb-16 animate-fade-in-up">
            <h1 className="text-5xl font-semibold leading-tight mb-8 text-white">
              Where startups meet early adopters.
            </h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              Connect innovative startups with passionate early adopters. Discover groundbreaking products before they hit the mainstream and help shape the future of technology. 
              <span className="text-white font-medium"> Your next favorite product is waiting to be discovered.</span>
            </p>
          </div>

          {/* Feature Points */}
          <div className="space-y-10 animate-fade-in-up delay-200">
            <div className="flex items-start space-x-6 group hover:transform hover:translate-x-1 transition-all duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm shadow-lg border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-3 text-white">Launch with confidence</h3>
                <p className="text-slate-300 leading-relaxed font-normal">Submit your startup and get matched with early adopters who are excited to try new products and provide valuable feedback</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6 group hover:transform hover:translate-x-1 transition-all duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm shadow-lg border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-3 text-white">Discover before everyone else</h3>
                <p className="text-slate-300 leading-relaxed font-normal">Be the first to try innovative products, get exclusive access, and help shape the next generation of startups</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-6 group hover:transform hover:translate-x-1 transition-all duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm shadow-lg border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-3 text-white">Build meaningful connections</h3>
                <p className="text-slate-300 leading-relaxed font-normal">Connect startups with their ideal early adopters through our smart matching system and community-driven approach</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Modern Login Form */}
      <div className="flex-1 lg:w-2/5 bg-white flex items-center justify-center p-8 relative">
        {/* Subtle background decoration */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-sky-100/30 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-32 right-32 w-48 h-48 bg-gradient-to-br from-sky-100/40 to-blue-100/40 rounded-full blur-2xl animate-float" />
        </div>
        
        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo (visible on small screens) */}
          <div className="lg:hidden text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-xl">
                <Rocket className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-semibold text-slate-800">LaunchSignal</span>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-2xl p-6 animate-fade-in-up">
            {/* Login Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl shadow-lg mb-4">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">
                Sign in to LaunchMatch
              </h2>
              <p className="text-slate-600 font-normal text-sm">Welcome back! Please sign in to continue</p>
            </div>

            {/* Google Login Button - Custom Styled */}
            <div className="mb-6">
              {import.meta.env.VITE_GOOGLE_CLIENT_ID ? (
                <button
                  type="button"
                  onClick={() => startGoogleLogin()}
                  className="w-full h-12 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3 shadow-soft"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                    <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 s5.373-12,12-12c3.059,0,5.842,1.156,7.961,3.039l5.657-5.657C33.236,6.053,28.884,4,24,4C12.954,4,4,12.954,4,24 s8.954,20,20,20s20-8.954,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                    <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,13,24,13c3.059,0,5.842,1.156,7.961,3.039 l5.657-5.657C33.236,6.053,28.884,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                    <path fill="#4CAF50" d="M24,44c4.779,0,9.109-1.635,12.518-4.373l-5.777-4.73C28.648,36.676,26.429,37.5,24,37.5 c-5.202,0-9.619-3.319-11.283-7.957l-6.51,5.02C9.51,39.556,16.227,44,24,44z"/>
                    <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.793,2.239-2.231,4.166-4.084,5.597 c0.001-0.001,0.002-0.001,0.003-0.002l5.777,4.73C35.813,38.289,44,32,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                  </svg>
                  <span className="text-sm font-semibold">Continue with Google</span>
                </button>
              ) : (
                <Button type="button" variant="outline" disabled className="w-full h-12 border border-slate-300 bg-slate-100 text-slate-400 rounded-xl font-normal text-sm">
                  Set VITE_GOOGLE_CLIENT_ID to enable Google Login
                </Button>
              )}
            </div>

            {/* Divider */}
            <div className="relative mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-4 bg-white text-slate-500 font-normal">or continue with email</span>
              </div>
            </div>

            {/* Login Form */}
            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {/* Error Message */}
              {error && (
                <motion.div 
                  className="bg-red-50 border border-red-200 rounded-xl p-4"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="flex items-center">
                    <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
                    <p className="text-red-700 text-sm font-normal">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Email Field with Standard Label */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <div>
                  <Label htmlFor="email" className="block mb-2 text-slate-700 font-medium">Email address</Label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full h-12 pl-12 pr-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus-visible:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-slate-400 hover:bg-white text-slate-700 text-sm shadow-soft hover:shadow-soft-lg"
                      required
                    />
                  </div>
                </div>
              </motion.div>

              {/* Password Field with Standard Label */}
              <motion.div 
                className="space-y-3"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <div>
                  <Label htmlFor="password" className="block mb-2 text-slate-700 font-medium">Password</Label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full h-12 pl-12 pr-12 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus-visible:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-slate-400 hover:bg-white text-slate-700 text-sm shadow-soft hover:shadow-soft-lg"
                      required
                    />
                    <motion.button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-all duration-300 focus:outline-none focus-visible:outline-none"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </motion.button>
                  </div>
                </div>
              </motion.div>

              {/* Forgot Password Link */}
              <motion.div 
                className="flex justify-end"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Link
                  to="/forgot-password"
                  className="text-sm text-blue-600 hover:text-blue-700 font-medium hover:underline transition-all duration-300"
                >
                  Forgot password?
                </Link>
              </motion.div>

              {/* Login Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-slate-400 disabled:to-slate-500 text-white font-semibold rounded-xl transition-all duration-300 hover:shadow-premium disabled:cursor-not-allowed text-sm group relative overflow-hidden"
                  >
                  {isLoading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <motion.div 
                        className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      />
                      <span>Signing in...</span>
                    </div>
                  ) : (
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      Sign in
                      <motion.div
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        <ArrowRight className="h-4 w-4" />
                      </motion.div>
                    </span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <p className="text-slate-600 font-normal text-sm">
                Don't have an account?{" "}
                  <Link
                    to="/signup"
                    className="text-blue-600 hover:text-blue-700 font-medium hover:underline transition-colors duration-300"
                  >
                  Sign up
                </Link>
              </p>
            </div>

            {/* Security Badge */}
            <div className="text-center mt-4">
              <div className="inline-flex items-center space-x-2 text-xs text-slate-500">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="font-normal">Secured with enterprise-grade encryption</span>
              </div>
            </div>

            {/* Back to Home Link */}
            <div className="text-center mt-6">
              <Link
                to="/"
                className="inline-flex items-center text-sm text-slate-500 hover:text-slate-700 transition-colors duration-300 group"
              >
                <svg className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
      </motion.div>
    </div>
  );
};

export default Login;