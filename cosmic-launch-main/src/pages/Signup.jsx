import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Rocket, Eye, EyeOff, Mail, Lock, User, Building2, Users, Github, Linkedin, Sparkles, TrendingUp, Zap, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { userAPI, handleAPIError } from "../services/api";

const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "adopter"
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUserTypeChange = (value) => {
    setFormData(prev => ({
      ...prev,
      userType: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for the API call - matching backend format
      const signupData = {
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: formData.userType
      };

      console.log("Sending signup data:", signupData);

      // Make the API call to the signup endpoint
      const response = await userAPI.signup(signupData);

      console.log("Signup successful:", response);
      
      // Handle successful signup
      if (response.message) {
        // Persist auth context for subsequent pages
        try {
          if (response.fullName) localStorage.setItem('userName', response.fullName);
          if (response.role) localStorage.setItem('userRole', response.role);
          localStorage.setItem('isLoggedIn', 'true');
        } catch {}
        
        // Show success message briefly before redirecting
        setError(""); // Clear any previous errors
        setIsLoading(false);
        
        // Show success message
        const successMessage = formData.userType === 'adopter' 
          ? "Account created successfully! Redirecting to startup feed..." 
          : "Account created successfully! Redirecting to dashboard...";
        
        // Create a temporary success element
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4';
        successDiv.textContent = successMessage;
        
        // Insert success message
        const form = document.querySelector('form');
        form.insertBefore(successDiv, form.firstChild);
        
        // Redirect based on user type after a brief delay
        setTimeout(() => {
          console.log('Redirecting user type:', formData.userType);
          if (formData.userType === 'adopter') {
            // Redirect adopters to the dedicated startups feed page with user name
            console.log('Redirecting adopter to startups feed page...');
            const userName = formData.firstName;
            localStorage.setItem('userName', userName);
            window.location.href = `/startups-feed?name=${encodeURIComponent(userName)}`;
          } else if (formData.userType === 'founder') {
            // Redirect founders to their dashboard
            console.log('Redirecting founder to dashboard...');
            const userName = formData.firstName;
            localStorage.setItem('userName', userName);
            window.location.href = '/founder-dashboard';
          } else {
            // Redirect to login for any other type
            console.log('Redirecting to login...');
            window.location.href = '/login';
          }
        }, 1500); // 1.5 second delay to show success message
      } else {
        setError(response.message || "Signup failed");
      }
    } catch (error) {
      console.error("Signup error:", error);
      const errorInfo = handleAPIError(error);
      setError(errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };


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

      <div className="relative z-10 min-h-screen flex font-['Inter',sans-serif]">
      {/* Left Panel - Content Section (mirrors Login) */}
      <div className="hidden lg:flex lg:w-3/5 bg-gradient-to-br from-slate-800 via-slate-700 to-slate-900 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-white/10 to-white/5 rounded-full blur-3xl animate-float" />
          <div className="absolute top-40 right-32 w-96 h-96 bg-gradient-to-br from-white/5 to-white/10 rounded-full blur-3xl animate-float-delayed" />
          <div className="absolute bottom-32 left-16 w-80 h-80 bg-gradient-to-br from-white/8 to-white/3 rounded-full blur-3xl animate-float-slow" />

          <div className="absolute top-32 left-1/3 text-white/20 animate-bounce">
            <Star className="h-6 w-6" />
          </div>
          <div className="absolute top-1/2 right-1/4 text-white/15 animate-bounce delay-300">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="absolute bottom-1/3 left-1/4 text-white/20 animate-bounce delay-700">
            <Star className="h-5 w-5" />
          </div>

          <div className="absolute top-1/4 left-1/3 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full animate-pulse" />
          <div className="absolute top-3/4 right-1/4 w-3 h-3 bg-gradient-to-r from-indigo-400 to-blue-400 rounded-full animate-pulse delay-1000" />
          <div className="absolute bottom-1/4 left-1/4 w-2 h-2 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full animate-pulse delay-500" />
      </div>

        {/* Content */}
        <div className="relative z-10 flex flex-col justify-center px-24 py-20 text-white">
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

          <div className="mb-16 animate-fade-in-up">
            <h1 className="text-5xl font-semibold leading-tight mb-8 text-white">Create your account.</h1>
            <p className="text-xl text-slate-300 leading-relaxed max-w-2xl font-normal">
              Join innovative founders and passionate early adopters. Get access to exclusive products before they go mainstream.
            </p>
          </div>

          <div className="space-y-10 animate-fade-in-up delay-200">
            <div className="flex items-start space-x-6 group hover:transform hover:translate-x-1 transition-all duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm shadow-lg border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-3 text-white">Grow with the right users</h3>
                <p className="text-slate-300 leading-relaxed font-normal">Get feedback and traction from early adopters who love trying new products</p>
              </div>
            </div>

            <div className="flex items-start space-x-6 group hover:transform hover:translate-x-1 transition-all duration-300">
              <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm shadow-lg border border-white/20 group-hover:bg-white/15 transition-all duration-300">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-xl mb-3 text-white">Find your community</h3>
                <p className="text-slate-300 leading-relaxed font-normal">Connect with builders and early adopters in the LaunchMatch network</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Signup Form Card (aligned with Login) */}
      <div className="flex-1 lg:w-2/5 bg-white flex items-center justify-center p-8 relative">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 right-20 w-64 h-64 bg-gradient-to-br from-blue-100/30 to-sky-100/30 rounded-full blur-3xl animate-float-slow" />
          <div className="absolute bottom-32 right-32 w-48 h-48 bg-gradient-to-br from-sky-100/40 to-blue-100/40 rounded-full blur-2xl animate-float" />
        </div>

        <div className="w-full max-w-md relative z-10">
          {/* Mobile Logo */}
          <div className="lg:hidden text-center mb-8 animate-fade-in">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 shadow-xl">
                <Rocket className="h-6 w-6 text-white" />
                 </div>
              <span className="text-2xl font-semibold text-slate-800">LaunchSignal</span>
                  </div>
                  </div>

          {/* Card */}
          <div className="bg-white border border-slate-200/60 rounded-2xl shadow-2xl p-6 animate-fade-in-up">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl shadow-lg mb-4">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-slate-800 mb-2">Create your account</h2>
              <p className="text-slate-600 font-normal text-sm">Join LaunchMatch to discover or launch startups</p>
            </div>


            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-4 animate-shake">
                  <p className="text-red-700 text-sm font-normal">{error}</p>
                </div>
              )}

              {/* User Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-slate-700">I am a:</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => handleUserTypeChange("adopter")} className={`flex items-center justify-center gap-2 h-11 rounded-lg border transition-all ${formData.userType === 'adopter' ? 'border-blue-500 bg-blue-500 text-white' : 'border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400'}`}>
                    <Users className="h-4 w-4" /> Early Adopter
                  </button>
                  <button type="button" onClick={() => handleUserTypeChange("founder")} className={`flex items-center justify-center gap-2 h-11 rounded-lg border transition-all ${formData.userType === 'founder' ? 'border-blue-500 bg-blue-500 text-white' : 'border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-400'}`}>
                    <Building2 className="h-4 w-4" /> Startup Founder
                  </button>
                </div>
              </div>

              {/* Name Fields with standard labels (no overlapping placeholders) */}
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <Label htmlFor="firstName" className="block mb-2 text-slate-700 font-medium">First name</Label>
                  <User className="pointer-events-none absolute left-4 top-[3.25rem] -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input id="firstName" name="firstName" type="text" value={formData.firstName} onChange={handleInputChange} className="w-full h-12 pl-14 pr-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus-visible:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-slate-400 hover:bg-white text-slate-700 text-sm shadow-soft hover:shadow-soft-lg" required />
                </div>
                <div className="relative">
                  <Label htmlFor="lastName" className="block mb-2 text-slate-700 font-medium">Last name</Label>
                  <User className="pointer-events-none absolute left-4 top-[3.25rem] -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input id="lastName" name="lastName" type="text" value={formData.lastName} onChange={handleInputChange} className="w-full h-12 pl-14 pr-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus-visible:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-slate-400 hover:bg-white text-slate-700 text-sm shadow-soft hover:shadow-soft-lg" required />
                </div>
              </div>

              {/* Email */}
              <div className="relative">
                <Label htmlFor="email" className="block mb-2 text-slate-700 font-medium">Email address</Label>
                <Mail className="pointer-events-none absolute left-4 top-[3.25rem] -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors duration-300" />
                <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} className="w-full h-12 pl-14 pr-4 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus-visible:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-slate-400 hover:bg-white text-slate-700 text-sm shadow-soft hover:shadow-soft-lg" required />
              </div>

              {/* Password */}
              <div className="relative">
                <Label htmlFor="password" className="block mb-2 text-slate-700 font-medium">Password</Label>
                <Lock className="pointer-events-none absolute left-4 top-[3.25rem] -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors duration-300" />
                <Input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleInputChange} className="w-full h-12 pl-14 pr-12 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus-visible:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-slate-400 hover:bg-white text-slate-700 text-sm shadow-soft hover:shadow-soft-lg" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-[3.25rem] -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-300">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <Label htmlFor="confirmPassword" className="block mb-2 text-slate-700 font-medium">Confirm password</Label>
                <Lock className="pointer-events-none absolute left-4 top-[3.25rem] -translate-y-1/2 w-5 h-5 text-slate-400 transition-colors duration-300" />
                <Input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleInputChange} className="w-full h-12 pl-14 pr-12 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none focus-visible:outline-none transition-all duration-300 bg-white/80 backdrop-blur-sm hover:border-slate-400 hover:bg-white text-slate-700 text-sm shadow-soft hover:shadow-soft-lg" required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-[3.25rem] -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors duration-300">
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              

              {/* Submit */}
              <Button type="submit" disabled={isLoading} className="w-full h-11 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-400 text-white font-medium rounded-lg transition-all duration-300 hover:shadow-lg disabled:cursor-not-allowed text-sm">
                 {isLoading ? "Creating Account..." : "Create Account"}
               </Button>

              {/* Sign In Link */}
              <div className="text-center">
                <p className="text-slate-600 text-sm">
                  Already have an account? <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">Sign in</Link>
                </p>
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
            </form>
        </div>
        </div>
      </div>
      </div>
    </div>
  );
};

export default Signup;