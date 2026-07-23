// rafce
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useEcomStore from "../../store/ecom-store";
import { useNavigate } from "react-router-dom";

const Login = () => {
  // Javascript
  const navigate = useNavigate();
  const actionLogin = useEcomStore((state) => state.actionLogin);
  const user = useEcomStore((state) => state.user);
  console.log("user form zustand", user);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await actionLogin(form);
      const role = res.data.payload.role;
      roleRedirect(role);
      toast.success("Welcome Back");
    } catch (err) {
      console.log(err);
      const errMsg = err.response?.data?.message;
      toast.error(errMsg);
    }
  };

  const roleRedirect = (role) => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate(-1);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-lg rounded-lg shadow h-auto p-10 bg-white relative overflow-hidden">
       <div className="w-full max-w-md rounded-lg shadow h-auto p-8 bg-white relative overflow-hidden">
          <h2 className="text-2xl font-medium text-slate-700">Login</h2>
          <p className="text-slate-500">Enter details below.</p>
        </div>
        <form onSubmit={handleSubmit} className="w-full mt-4 space-y-3">
          <div>
            <input
              className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
              placeholder="Email"
              id="email"
              name="email"
              type="email"
              onChange={handleOnChange}
              value={form.email}
              required
            />
          </div>
          <div>
            <input
              className="outline-none border-2 rounded-md px-2 py-1 text-slate-500 w-full focus:border-blue-300"
              placeholder="Password"
              id="password"
              name="password"
              type="password"
              onChange={handleOnChange}
              value={form.password}
              required
            />
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                className="mr-2 w-4 h-4"
                id="remember"
                name="remember"
                type="checkbox"
              />
              <span className="text-slate-500 text-sm">Remember me</span>
            </div>
            <a className="text-blue-500 text-sm font-medium hover:underline" href="#">
              Forgot Password
            </a>
          </div>
          
          <button
            className="w-full justify-center py-1 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 rounded-md text-white ring-2 ring-blue-300 transition duration-200"
            id="login"
            name="login"
            type="submit"
          >
            login
          </button>
          
          <p className="flex justify-center space-x-1 text-sm">
            <span className="text-slate-700">Don't have an account?</span>
            <a className="text-blue-500 hover:underline" href="#">
              Sign Up
            </a>
          </p>
        </form>
      </div>

    </div>
  );
};

export default Login;