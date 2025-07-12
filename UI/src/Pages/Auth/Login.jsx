import { useState } from "react";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../constants/config";
import { useApiRequest } from "../../../hooks/useApiRequest";

function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const { makeRequest, loading: apiLoading, error: apiError } = useApiRequest();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/", { replace: true });
    }
  }, [navigate]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length <= 8) {
      newErrors.password = "Password must be more than 8 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Clear any previous general errors
    setErrors((prev) => ({ ...prev, general: "" }));

    // Check for email domain before making API call
    if (
      !formData.email.endsWith("@hs-fulda.de") &&
      !formData.email.endsWith("@sfsu.ed")
    ) {
      setErrors((prev) => ({
        ...prev,
        general: "Email must end with hs-fulda.de or sfsu.ed ",
      }));
      setIsSubmitting(false);
      return;
    }

    if (validateForm()) {
      const { success, data, error } = await makeRequest({
        url: BASE_URL + "login",
        method: "POST",
        body: {
          email: formData.email,
          password: formData.password,
        },
      });

      console.log({ success, data, error }); // Debug log

      if (success && data && data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("email", formData.email);
        if (formData.email === "admin@hs-fulda.de") {
          navigate("/admindashboard", { replace: true });
        } else {
          navigate("/");
        }
      } else {
        // Prefer errors array, then message, then fallback
        let errorMsg = "";
        if (error && Array.isArray(error.errors) && error.errors.length > 0) {
          errorMsg = error.errors[0].msg;
        } else if (typeof error === "string") {
          errorMsg = error;
        } else if (error && error.message) {
          errorMsg = error.message;
        } else {
          errorMsg = "An unexpected error occurred. Please try again.";
        }
        setErrors({
          general: errorMsg,
        });
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-xl">
        <div className="text-center space-y-4">
          <div className="inline-block p-3 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 mb-2">
            <svg
              className="w-8 h-8 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
          </div>
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-blue-800 tracking-tight">
            Welcome Back
          </h2>
          <p className="text-base text-gray-600 max-w-sm mx-auto">
            Sign in to your account to continue your journey with Swoplet
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {(errors.general || apiError) && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
              {errors.general || apiError}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 rounded-lg border ${
                  errors.email ? "border-red-300 bg-red-50" : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                placeholder="Enter your email"
                disabled={isSubmitting || apiLoading}
              />
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className={`mt-1 block w-full px-4 py-3 rounded-lg border ${
                  errors.password
                    ? "border-red-300 bg-red-50"
                    : "border-gray-300"
                } focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors duration-200`}
                placeholder="Enter your password"
                disabled={isSubmitting || apiLoading}
              />
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting || apiLoading}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-700 hover:to-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting || apiLoading ? "Signing In..." : "Sign In"}
            </button>
          </div>
        </form>

        <div className="text-center text-sm">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-medium text-blue-600 hover:text-blue-800 transition-colors duration-200"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
