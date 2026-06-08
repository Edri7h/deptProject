import { useState } from "react";
import { loginAPI } from "../services/auth.api.js";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { login } from "@/redux/slices/authSlice.js";

export default function LoginForm() {
  const navigate = useNavigate();
  const dispatch=useDispatch();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { data } = await loginAPI(formData);
      console.log(data.data)
      dispatch(login(data.data))

      if (data.data.role==="student") {
        navigate("/student");
      }else if(data.data.role==="professor"){
          navigate("/professor")
      }
    } catch (error) {
      console.log(error?.response?.data.message)
      toast.error(error?.response?.data.message)
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
  <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white">DPET</h1>
        <p className="text-slate-400 mt-2">
          Project Mentorship Portal
        </p>
      </div>

      {/* Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl">
        <h2 className="text-2xl font-semibold text-white mb-1">
          Welcome Back
        </h2>

        <p className="text-slate-400 mb-6">
          Sign in to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-sm text-slate-300 block mb-2">
              Email
            </label>

            <input
              name="email"
              type="email"
              placeholder="john@example.com"
              value={formData.email}
              onChange={handleChange}
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-blue-500
              "
            />
          </div>

          <div>
            <label className="text-sm text-slate-300 block mb-2">
              Password
            </label>

            <input
              name="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              className="
                w-full
                bg-slate-800
                border
                border-slate-700
                rounded-xl
                px-4
                py-3
                text-white
                outline-none
                focus:border-blue-500
              "
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="
              w-full
              bg-blue-600
              hover:bg-blue-700
              transition
              rounded-xl
              py-3
              text-white
              font-semibold
              disabled:opacity-50
            "
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  </div>
;
    </>
  );
}