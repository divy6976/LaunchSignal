import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowLeft, Rocket, Building2, Users, Globe, Target, FileText, UploadCloud, ImagePlus } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { startupAPI, handleAPIError } from "../services/api";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SubmitStartup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);
  const [startupId, setStartupId] = useState(null);
  const location = useLocation();

  // Prefill when editing existing startup
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get('startupId');
    console.log('SubmitStartup useEffect - startupId from URL:', id);
    console.log('SubmitStartup useEffect - location.search:', location.search);
    
    const load = async () => {
      if (!id) {
        console.log('No startupId found, staying in create mode');
        return;
      }
      console.log('Setting edit mode for startupId:', id);
      setIsEditMode(true);
      setStartupId(id);
      try {
        console.log('Fetching startup data for ID:', id);
        const data = await startupAPI.getStartupById(id);
        console.log('Received startup data:', data);
        setFormData(prev => ({
          ...prev,
          name: data.name || '',
          contactEmail: data.contactEmail || '',
          tagline: data.tagline || '',
          description: data.description || '',
          industry: data.industry || '',
          categories: data.categories || [],
          businessType: data.businessType || '',
          targetAudience: data.targetAudience || '',
          website: data.website || '',
          feedbackLink: data.feedbackLink || '',
          specialOffer: data.specialOfferText || '',
          couponCode: data.specialOfferCode || ''
        }));
        console.log('Form data updated for edit mode');
      } catch (error) {
        console.error('Error fetching startup data:', error);
      }
    };
    load();
  }, [location.search]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState("");

  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    contactEmail: "",
    tagline: "",
    description: "",
    logoFile: null,
    mediaFiles: [],
    // Business Details
    industry: "",
    categories: [],
    businessType: "",
    targetAudience: "",
    website: "",
    // Special Offers
    specialOffer: "",
    couponCode: ""
  });

  // Check authentication
  useEffect(() => {
    const loggedInStatus = localStorage.getItem('isLoggedIn');
    const role = localStorage.getItem('userRole');
    setIsLoggedIn(!!loggedInStatus);
    setUserRole(role);
    
    if (!loggedInStatus || role !== 'founder') {
      window.location.href = '/login';
      return;
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (category) => {
    setFormData(prev => {
      const exists = prev.categories.includes(category);
      const next = exists
        ? prev.categories.filter(c => c !== category)
        : prev.categories.length < 3
          ? [...prev.categories, category]
          : prev.categories; // cap at 3
      return { ...prev, categories: next };
    });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0] || null;
    if (file && file.size > 5 * 1024 * 1024) {
      setError("Logo must be under 5MB");
      return;
    }
    setError("");
    setFormData(prev => ({ ...prev, logoFile: file }));
  };

  const handleMediaChange = (e) => {
    const files = Array.from(e.target.files || []);
    const limited = files.slice(0, 5);
    const tooLarge = limited.find(f => f.size > 10 * 1024 * 1024);
    if (tooLarge) {
      setError("Each media file must be under 10MB");
      return;
    }
    setError("");
    setFormData(prev => ({ ...prev, mediaFiles: limited }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      // Client-side size guards: hard-stop if payload too large
      const logoBytes = formData.logoFile?.size || 0;
      const mediaBytes = (formData.mediaFiles || []).reduce((sum, f) => sum + (f?.size || 0), 0);
      const totalBytes = logoBytes + mediaBytes;
      const MAX_TOTAL_BYTES = 12 * 1024 * 1024; // 12MB total cap client-side
      const MAX_DESC_CHARS = 4000; // prevent extremely large descriptions

      if (formData.description && formData.description.length > MAX_DESC_CHARS) {
        setIsLoading(false);
        setError(`Description too long. Keep under ${MAX_DESC_CHARS} characters.`);
        return;
      }

      if (totalBytes > MAX_TOTAL_BYTES) {
        setIsLoading(false);
        const mb = (totalBytes / (1024 * 1024)).toFixed(2);
        setError(`Uploads too large (${mb} MB). Please keep total under ${(MAX_TOTAL_BYTES / (1024 * 1024))} MB or upload fewer/smaller files.`);
        return;
      }
      // Convert files to base64 (quick MVP)
      const fileToBase64 = (file) => new Promise((resolve, reject) => {
        if (!file) return resolve(null);
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const filesToBase64 = async (files) => {
        const arr = [];
        for (const f of files || []) {
          const b64 = await fileToBase64(f);
          if (b64) arr.push(b64);
          if (arr.length >= 5) break;
        }
        return arr;
      };

      const logoBase64 = await fileToBase64(formData.logoFile);
      const mediaBase64 = await filesToBase64(formData.mediaFiles);

      // Prepare payload for API
      const payload = {
        name: formData.name,
        tagline: formData.tagline,
        description: formData.description,
        industry: formData.industry,
        categories: formData.categories,
        businessType: formData.businessType,
        targetAudience: formData.targetAudience,
        website: formData.website,
        contactEmail: formData.contactEmail,
        feedbackLink: formData.feedbackLink,
        specialOffer: formData.specialOffer,
        couponCode: formData.couponCode,
        logo: logoBase64,
        media: mediaBase64
      };

      console.log(isEditMode ? "Updating startup:" : "Submitting startup:", payload);
      
      let response;
      if (isEditMode) {
        response = await startupAPI.updateStartup(startupId, payload);
        console.log("Startup updated successfully:", response);
      } else {
        response = await startupAPI.createStartup(payload);
        console.log("Startup created successfully:", response);
      }

      if (response.message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4';
        successDiv.textContent = isEditMode 
          ? "Startup updated successfully! Redirecting to dashboard..." 
          : "Startup submitted successfully! Redirecting to dashboard...";

        const form = document.querySelector('form');
        form.insertBefore(successDiv, form.firstChild);

        setTimeout(() => {
          window.location.href = '/founder-dashboard';
        }, 2000);
      }
    } catch (error) {
      console.error("Startup submission error:", error);
      const errorInfo = handleAPIError(error);
      setError(errorInfo.message);
    } finally {
      setIsLoading(false);
    }
  };

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "E-commerce", 
    "Manufacturing", "Real Estate", "Entertainment", "Food & Beverage", "Other"
  ];

  const categories = [
    "SaaS", "AI/ML", "FinTech", "EdTech", "HealthTech", "E-commerce", 
    "Social Media", "Productivity", "DevTools", "Content", "Automation", "Other"
  ];

  if (!isLoggedIn) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50/40 to-white">
      {/* Header rendered globally by AppShell */}

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          {isEditMode && (
            <div className="mb-3">
              <Link to="/founder-dashboard" className="inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-800">
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Link>
            </div>
          )}
          <div className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-blue-700 border border-blue-100">
            <Rocket className="h-4 w-4" />
            <span className="text-xs font-semibold tracking-wide">Submit your Startup</span>
          </div>
          <h1 className="mt-3 text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
            {isEditMode ? "Edit your startup" : "Tell us about your startup"}
          </h1>
          <p className="text-sm text-gray-500 mt-1">All fields marked with * are required.</p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader>
            <CardTitle className="text-base font-semibold text-blue-700 flex items-center gap-2">
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700">✦</span>
              <span>Basic Information</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="bg-white/90 rounded-xl">
            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              {/* Row: Startup Name + Contact Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">Startup Name *</Label>
                  <Input id="name" name="name" placeholder="Enter your startup name" value={formData.name} onChange={handleInputChange} className="h-10 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contactEmail" className="text-sm font-medium">Contact Email *</Label>
                  <Input id="contactEmail" name="contactEmail" type="email" placeholder="hello@yourstartup.com" value={formData.contactEmail} onChange={handleInputChange} className="h-10 focus:ring-blue-500 focus:border-blue-500" required />
                </div>
              </div>

              {/* Tagline */}
              <div className="space-y-2">
                <Label htmlFor="tagline" className="text-sm font-medium">Tagline *</Label>
                <Input id="tagline" name="tagline" placeholder="A catchy one-liner that describes your startup" value={formData.tagline} onChange={handleInputChange} className="h-10 focus:ring-blue-500 focus:border-blue-500" required />
                <p className="text-xs text-gray-500">Make it memorable and engaging!</p>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">Description *</Label>
                <Textarea id="description" name="description" placeholder="Describe your startup, what problem it solves, and how it works..." value={formData.description} onChange={handleInputChange} className="min-h-28 focus:ring-blue-500 focus:border-blue-500" required />
                <p className="text-xs text-gray-500">At least 50 characters. Be detailed and engaging.</p>
              </div>

              {/* Uploads - whole boxes clickable */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label htmlFor="logoFile" className="cursor-pointer border border-dashed rounded-xl p-6 text-center border-blue-200 hover:bg-blue-50/40 transition-colors flex flex-col items-center justify-center">
                  <input id="logoFile" type="file" accept="image/png,image/jpeg,image/gif" onChange={handleLogoChange} className="hidden" />
                  <span className="inline-flex items-center gap-2 text-sm text-blue-700 font-medium">
                    <UploadCloud className="h-5 w-5" /> Click to upload logo
                  </span>
                  <p className="text-sm text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
                  {formData.logoFile ? (
                    <p className="text-xs text-gray-600 mt-2">Selected: {formData.logoFile.name}</p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">Optional: Upload your startup logo (max 5MB)</p>
                  )}
                </label>

                <label htmlFor="mediaFiles" className="cursor-pointer border border-dashed rounded-xl p-6 text-center border-blue-200 hover:bg-blue-50/40 transition-colors flex flex-col items-center justify-center">
                  <input id="mediaFiles" type="file" accept="image/*,video/*" multiple onChange={handleMediaChange} className="hidden" />
                  <span className="inline-flex items-center gap-2 text-sm text-blue-700 font-medium">
                    <ImagePlus className="h-5 w-5" /> Click to upload media files
                  </span>
                  <p className="text-sm text-gray-500 mt-1">Images, videos up to 10MB each</p>
                  {formData.mediaFiles?.length ? (
                    <p className="text-xs text-gray-600 mt-2">{formData.mediaFiles.length} selected</p>
                  ) : (
                    <p className="text-sm text-gray-500 mt-2">Up to 5 media files to showcase your startup</p>
                  )}
                </label>
              </div>

              {/* Section: Business Details */}
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700">✦</span>
                  <span>Business Details</span>
                </h3>
              </div>

              {/* Industry */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Industry *</Label>
                <Select value={formData.industry} onValueChange={(value) => handleSelectChange('industry', value)}>
                  <SelectTrigger className="h-10 focus:ring-blue-500 focus:border-blue-500">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent>
                    {industries.map((industry) => (
                      <SelectItem key={industry} value={industry}>
                        {industry}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Categories * (Max 3)</Label>
                  <span className="text-[11px] text-blue-700 bg-blue-50 rounded-full px-2 py-0.5">{Math.max(0, 3 - formData.categories.length)} left</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <div key={category} className={`flex items-center space-x-2 rounded-lg px-2 py-1 border ${formData.categories.includes(category) ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input
                        type="checkbox"
                        id={category}
                        checked={formData.categories.includes(category)}
                        onChange={() => handleCategoryChange(category)}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                      />
                      <Label htmlFor={category} className="text-sm font-medium">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
                {formData.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1">
                    {formData.categories.map((c) => (
                      <span key={c} className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 border border-blue-200">{c}</span>
                    ))}
                  </div>
                )}
              </div>

              {/* Business Type */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Business Model *</Label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <button
                    type="button"
                    onClick={() => handleSelectChange('businessType', 'B2B')}
                    className={`w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${formData.businessType==='B2B' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-[4px] border text-[13px] ${formData.businessType==='B2B' ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-300 bg-white text-transparent'}`}>✓</span>
                    <span className="text-sm font-medium">B2B (Business to Business)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectChange('businessType', 'B2C')}
                    className={`w-full sm:w-auto inline-flex items-center gap-2 rounded-lg border px-3 py-2 transition-colors ${formData.businessType==='B2C' ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <span className={`inline-flex h-5 w-5 items-center justify-center rounded-[4px] border text-[13px] ${formData.businessType==='B2C' ? 'border-blue-500 bg-blue-600 text-white' : 'border-gray-300 bg-white text-transparent'}`}>✓</span>
                    <span className="text-sm font-medium">B2C (Business to Consumer)</span>
                  </button>
                </div>
              </div>

              {/* Target Users */}
              <div className="space-y-2">
                <Label htmlFor="targetAudience" className="text-sm font-medium">Target Users *</Label>
                <Textarea id="targetAudience" name="targetAudience" placeholder="Describe your ideal customers and target audience..." value={formData.targetAudience} onChange={handleInputChange} className="min-h-24 focus:ring-blue-500 focus:border-blue-500" required />
              </div>

              {/* Website Link */}
              <div className="space-y-2">
                <Label htmlFor="website" className="text-sm font-medium">Website URL</Label>
                <Input id="website" name="website" type="url" placeholder="https://your-startup-website.com" value={formData.website} onChange={handleInputChange} className="h-10 focus:ring-blue-500 focus:border-blue-500" />
                <p className="text-[11px] text-gray-500">Link to your startup's website or landing page</p>
              </div>

              {/* Section: Special Offers & Engagement */}
              <div className="pt-2">
                <h3 className="text-sm font-semibold text-blue-700 flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-blue-100 text-blue-700">✦</span>
                  <span>Special Offers & Engagement</span>
                </h3>
              </div>

              <div className="space-y-2">
                <Label htmlFor="specialOffer" className="text-sm font-medium">Special Offer</Label>
                <Textarea id="specialOffer" name="specialOffer" placeholder="Describe any special offer, discount, or early access you're providing to early adopters..." value={formData.specialOffer} onChange={handleInputChange} className="min-h-24 focus:ring-blue-500 focus:border-blue-500" />
                <p className="text-[11px] text-gray-500">Optional: Attract early adopters with exclusive offers</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="couponCode" className="text-sm font-medium">Coupon Code</Label>
                <Input id="couponCode" name="couponCode" placeholder="EARLYUSER20" value={formData.couponCode} onChange={handleInputChange} className="h-10 focus:ring-blue-500 focus:border-blue-500" />
                <p className="text-[11px] text-gray-500">Optional: Provide a discount code for early adopters</p>
              </div>

              {/* Submit Button */}
              <div className="pt-6">
                <div className="flex items-center justify-end gap-3">
                  <Link to="/founder-dashboard" className="text-sm text-gray-600 hover:text-gray-800">Cancel</Link>
                  <Button type="submit" disabled={isLoading} className="h-10 px-5 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-strong text-white">
                    {isLoading ? (isEditMode ? "Updating..." : "Submitting...") : (isEditMode ? "Update Startup" : "Submit Startup")}
                  </Button>
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
      {/* Footer rendered globally by AppShell */}
    </div>
  );
};

export default SubmitStartup;
