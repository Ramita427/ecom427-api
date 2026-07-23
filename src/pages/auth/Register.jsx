// rafce
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import zxcvbn from "zxcvbn";
import { useForm } from "react-hook-form";

const registerSchema = z
  .object({
    email: z.string().email({ message: "Invalid email!!!" }),
    password: z.string().min(8, { message: "Password ต้องมากกว่า 8 ตัวอักษร" }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password มันบ่ตรงกันเด้อ",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [passwordScore, setPasswordScore] = useState(0);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
  });

  const validatePassword = () => {
    let password = watch().password;
    return zxcvbn(password ? password : "").score;
  };
  
  useEffect(() => {
    setPasswordScore(validatePassword());
  }, [watch().password]);

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("https://ecom427-api.vercel.app/api/register", data);
      console.log(res.data);
      toast.success(res.data);
    } catch (err) {
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
      console.log(err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-lg shadow h-auto p-8 bg-white relative overflow-hidden">
        <div className="flex flex-col justify-center items-center space-y-2">
          <h2 className="text-2xl font-medium text-slate-700">Register</h2>
          <p className="text-slate-500">Create your account below.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full mt-6 space-y-4">
          <div>
            <input
              {...register("email")}
              placeholder="Email"
              type="email"
              className={`outline-none border-2 rounded-md px-3 py-2 text-slate-600 w-full focus:border-blue-300 transition duration-200
                ${errors.email ? "border-red-400 focus:border-red-400" : "border-slate-200"}
              `}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1 pl-1">{errors.email.message}</p>
            )}
          </div>

          <div>
            <input
              {...register("password")}
              placeholder="Password"
              type="password"
              className={`outline-none border-2 rounded-md px-3 py-2 text-slate-600 w-full focus:border-blue-300 transition duration-200
                ${errors.password ? "border-red-400 focus:border-red-400" : "border-slate-200"}
              `}
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1 pl-1">{errors.password.message}</p>
            )}

            {watch().password?.length > 0 && (
              <div className="flex mt-2 px-1 space-x-1">
                {Array.from(Array(5).keys()).map((item, index) => (
                  <span className="w-1/5" key={index}>
                    <div
                      className={`rounded h-1.5 transition-all duration-300 ${
                        index <= passwordScore
                          ? passwordScore <= 2
                            ? "bg-red-400"
                            : passwordScore < 4
                            ? "bg-yellow-400"
                            : "bg-green-400"
                          : "bg-slate-100"
                      }`}
                    ></div>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div>
            <input
              {...register("confirmPassword")}
              placeholder="Confirm Password"
              type="password"
              className={`outline-none border-2 rounded-md px-3 py-2 text-slate-600 w-full focus:border-blue-300 transition duration-200
                ${errors.confirmPassword ? "border-red-400 focus:border-red-400" : "border-slate-200"}
              `}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-xs mt-1 pl-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full justify-center py-2.5 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white font-medium shadow-md ring-2 ring-blue-300 transition duration-200"
          >
            Register
          </button>

          <p className="flex justify-center space-x-1 text-sm pt-2">
            <span className="text-slate-500">Already have an account?</span>
            <a className="text-blue-500 hover:underline font-medium" href="/login">
              Login
            </a>
          </p>

        </form>
      </div>

    </div>
  );
};

export default Register;