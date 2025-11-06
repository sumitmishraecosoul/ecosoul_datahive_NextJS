'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import SplitText from "../../../Components/SplitText";
import { BorderBeam } from "../../../Components/BorderBeam";
import Orb from "../../../Components/Orb";
import LoginBackground from "../../../Components/LoginBackground";
import { LiquidGlassCard } from "../../../Components/LiquidGlass";
import { login as loginApi } from "../../../api/auth";
import { useToast } from "../../../Components/toast";
import { Button } from "../../../Components/Button";
// import vectorLogo from "../../../public/vectorLogo.jpg";

export default function Login() {
  const router = useRouter();   
  const toast = useToast();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});

  // Removed department field — not required for login

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    // Department validation removed

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      try {
        const data = await loginApi({ email: formData.email, password: formData.password });
        // Persist tokens and user for subsequent API calls and RBAC
        if (data?.accessTokenHRMS) {
          localStorage.setItem('token', data.accessTokenHRMS);
        }
        if (data?.refreshTokenHRMS) {
          localStorage.setItem('refreshToken', data.refreshTokenHRMS);
        }
        if (data?.user) {
          localStorage.setItem('user', JSON.stringify(data.user));
        }

        // Redirect based on department
        const department = data?.user?.department;
        toast.success('Login successful');
        if (department === 1) {
          router.push('/dashboard');
        } else if (department === 2) {
          router.push('/dashboard/retail');
        } else if (department === 3) {
          router.push('/dashboard/e-commerce');
        } else if (department === 4) {
          router.push('/dashboard/supply-chain');
        } else {
          router.push('/dashboard');
        }
      } catch (err) {
        setErrors({ form: err?.response?.data?.message || 'Login failed. Please try again.' });
        const msg = err?.response?.data?.message || 'Login failed. Please try again.';
        toast.error(msg);
      }
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-white relative">
      <div className="absolute inset-0 z-0">
        <LoginBackground
          dotSize={10}
          gap={28}
          baseColor="#e5e7eb" // gray-200
          activeColor="#cbd5e1" // slate-300
          proximity={160}
          speedTrigger={120}
          shockRadius={220}
          shockStrength={4}
          maxSpeed={4000}
          resistance={800}
          returnDuration={1.4}
          className="absolute inset-0 p-0 pointer-events-none"
        />
      </div>
      <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col items-center justify-center px-6 py-12 lg:flex-row lg:gap-12">
        <div className="flex flex-1 items-center justify-center py-8">
          <div className="relative w-full max-w-2xl space-y-3 text-center">
            <SplitText
              text="Welcome to"
              tag="h1"
              className="block text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight text-gray-900"
              textAlign="center"
              delay={50}
              duration={1.0}
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
            />
            <div className="block">
              <SplitText
                text="DataHive"
                tag="h3"
                className="block text-4xl md:text-5xl lg:text-6xl font-semibold text-emerald-700"
                textAlign="center"
                delay={100}
                duration={1.0}
                from={{ opacity: 0, y: 50 }}
                to={{ opacity: 1, y: 0 }}
              />
            </div>
            <div className="pointer-events-none mt-8 md:mt-10 lg:mt-12 w-64 h-64 md:w-72 md:h-72 lg:w-80 lg:h-80 drop-shadow-xl mx-auto">
              <Orb hue={160} hoverIntensity={0.12} rotateOnHover={false} />
            </div>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center py-8">
          <LiquidGlassCard
            className="relative w-full max-w-md rounded-2xl border border-white/60 bg-white/50 p-8 shadow-md"
            draggable={false}
            expandable={false}
            blurIntensity="xl"
            glowIntensity="sm"
            shadowIntensity="md"
            borderRadius="16px"
          >
            <div className="pointer-events-none absolute inset-0 z-20">
              <BorderBeam size={140} duration={10} colorFrom="#34d399" colorTo="#2dd4bf" borderWidth={2} />
            </div>
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 z-10 bg-gradient-to-t from-white/90 via-white/60 to-transparent" />
            <div className="relative z-40 flex justify-center pb-6">
              <img
                src="/vectorAILogo2.svg"
                alt="Vector AI Logo"
                className="h-24 w-24"
              />
            </div>
            <form className="relative z-40 space-y-5">
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-800">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-gray-900 placeholder:text-gray-600 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="you@example.com"
                  required
                />
                {errors.email && (
                  <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                )}
              </div>
              <div>
                <label className="block mb-1.5 text-sm font-medium text-gray-800">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 bg-white/95 px-4 py-3 text-gray-900 placeholder:text-gray-600 shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                  placeholder="Enter your password"
                  required
                />
                {errors.password && (
                  <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              {/* Inline form error removed in favor of toast notifications */}

              <Button
                className="w-full rounded-xl bg-emerald-600 px-4 py-3 font-semibold text-white shadow-sm transition-colors duration-150 hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
                onClick={handleSubmit}
                type="button"
              >
                Sign in
              </Button>
            </form>
          </LiquidGlassCard>
        </div>
      </div>
    </div>
  );
}
