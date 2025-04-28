"use client";
import IconLockDots from "@/components/icon/icon-lock-dots";
import IconMail from "@/components/icon/icon-mail";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { signIn } from "next-auth/react";
import { loginUser } from "@/store/actions/userActions"; // Import the login action from userSlice
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { IRootState } from "@/store";
import ButtonLoader from "../button-loader";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaExclamationCircle } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";

// MAIN AUTH COMPONENT
const ComponentsAuthLoginForm = () => {
  // Added state for username and password
  const { loading } = useSelector((state: IRootState) => state.user); // Get email from Redux

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();
  const dispatch = useDispatch();

  // Handle form submit
  const submitForm = async (data: any) => {
    const { username, password } = data;

    try {
      const response = await dispatch<any>(loginUser({ username, password }));
      if (response.status === 200) {
        const result = await signIn("credentials", {
          redirect: false,
          username,
          password,
          accessToken: response.accessToken,
        });
        if (result?.ok) {
          setShowError(false);
          setShowSuccess(true);
          router.replace('/dashboard');
          setShowError(false);
          setShowSuccess(true);
        } else {
          setError("Login failed. Please check your credentials.");
        }
      } else {
        setError("Invalid login credentials");
        setShowError(true);
      }
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };
  const schema = yup.object({
    username: yup.string().required("Username is Required"),
    password: yup
      .string()
      .required("Password is Required")
      .min(6, "Password must be at least 6 characters")
      .max(32, "Password must be at most 32 characters"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });
  return (
    <form className="space-y-5 dark:text-white">
      {showError && (
        <div className="flex justify-center">
          <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
            Invalid username or password
          </span>
        </div>
      )}
      {showSuccess && (
        <div className="flex justify-center">
          <span className="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-green-400 border border-green-400">
            Login successfull. Redirecting please wait...
          </span>
        </div>
      )}

      <div>
        <label htmlFor="Username">Username</label>
        <div className="relative text-white-dark">
          <input
            id="Username"
            type="username"
            placeholder="Enter Username"
            className={`form-input ps-10 placeholder:text-white-dark ${errors.username ? "border-red-500" : ""}`}
            {...register("username")} // register the username field
            onChange={(e) => {
              setShowError(false);
            }}
          />
          <span className="absolute start-4 top-1/2 -translate-y-1/2">
            <IconMail fill={true} />
          </span>
          {errors.username && (
            <FaExclamationCircle
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
              style={{ fontSize: "calc(1em + 5px)" }}
            />
          )}
        </div>
        {errors.username && (
          <div className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
            <div className="flex items-center">
              <GiCancel className="text-white text-[12px]" />
              <span className="text-white ml-2">{errors.username.message}</span>
            </div>
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        )}{" "}
      </div>
      <div>
        <label htmlFor="Password">Password</label>
        <div className="relative text-white-dark">
          <input
            id="Password"
            type="password"
            placeholder="Enter Password"
            className={`form-input ps-10 placeholder:text-white-dark ${errors.password ? "border-red-500" : ""}`}
            {...register("password")} // register the password field
            onChange={(e) => {
              setShowError(false);
            }}
          />
          <span className="absolute start-4 top-1/2 -translate-y-1/2">
            <IconLockDots fill={true} />
          </span>
          {errors.password && (
            <FaExclamationCircle
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
              style={{ fontSize: "calc(1em + 5px)" }}
            />
          )}
        </div>
        {errors.password && (
          <div className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
            <div className="flex items-center">
              <GiCancel className="text-white text-[12px]" />
              <span className="text-white ml-2">{errors.password.message}</span>
            </div>
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        )}{" "}
      </div>
      <div className="flex justify-between">
        <div className="flex items-center">
          <input
            id="remember-me"
            type="checkbox"
            className="w-4 h-4 xl:p-[10px] text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:bg-gray-700 dark:border-gray-600"
            // {...register("rememberMe")}
          />
          <label
            htmlFor="remember-me"
            className="ml-2 text-sm text-black dark:text-gray-300"
          >
            Remember me
          </label>
        </div>

        <Link
          href="/forget-password"
          className="text-sm font-medium text-blue-600 hover:underline dark:text-primary-500 "
        >
          Forgot password?
        </Link>
      </div>
      <button
        type="button"
        onClick={handleSubmit(submitForm)}
        className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
      >
        {loading ? <ButtonLoader /> : "Sign in"}
      </button>
    </form>
  );
};

export default ComponentsAuthLoginForm;
