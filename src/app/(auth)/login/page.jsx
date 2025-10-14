'use client';
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import LoginBackground from "../../../Components/LoginBackground";
import SplitText from "../../../Components/SplitText";
import thriveLogo from "../../../../public/thriveLogo.svg";

export default function Login() {
  const router = useRouter();   

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    department: "",
  });

  const [errors, setErrors] = useState({});

  const departments = ["Supply Chain"];

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

    if (!formData.department) {
      newErrors.department = "Please select a department";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length === 0) {
      console.log("Login Success:", formData);
      localStorage.setItem("isLoggedIn", "true");
      router.push("/dashboard");
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <div className="min-h-screen bg-black relative">
      <div className="absolute inset-0 z-0">
        <LoginBackground 
          dotSize={12}
          gap={24}
          baseColor="#5227FF"
          activeColor="#5227FF"
          proximity={200}
          speedTrigger={100}
          shockRadius={250}
          shockStrength={5}
          maxSpeed={5000}
          resistance={750}
          returnDuration={1.5}
        />
      </div>
      
      <div className="relative z-10 flex h-screen">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center space-y-8">
            <SplitText
              text="Welcome to"
              tag="h1"
              className="text-7xl font-bold text-white mb-4"
              delay={50}
              duration={1.0}
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
            />
             <SplitText
              text="Thrive Brands Dashboards"
              tag="h1"
              className="text-7xl font-bold text-white mb-4"
              delay={100}
              duration={1.2}
              from={{ opacity: 0, y: 50 }}
              to={{ opacity: 1, y: 0 }}
            />
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-8">
          <div className="bg-white/95 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md text-black">
            <div className="flex justify-center px-4">
              <img
                src="/thriveLogo.svg"
                alt="EcoSoul Logo"
                className="w-[10rem] h-[10rem]"
              />
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-black block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/80 text-black border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                  required
                />
                {errors.email && (
                  <p className="text-red-300 text-sm mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="text-black block mb-1 font-medium">Password</label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/80 text-black border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                  required
                />
                {errors.password && (
                  <p className="text-red-300 text-sm mt-1">{errors.password}</p>
                )}
              </div>

              <div>
                <label className="text-black block mb-1 font-medium">Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-white/80 text-black border-2 border-gray-300 focus:border-purple-500 focus:outline-none"
                  required
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
                {errors.department && (
                  <p className="text-red-300 text-sm mt-1">{errors.department}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-900 to-amber-400 hover:from-blue-800 hover:to-amber-200 text-white py-3 rounded-md font-bold transition-all duration-300 transform hover:scale-105"
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
