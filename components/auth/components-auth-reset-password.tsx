"use client";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { IRootState } from "@/store/index";
import { resetPassword } from "@/services/authService"; // Adjust the path as needed
import IconLockDots from "@/components/icon/icon-lock-dots";
import IconMail from "@/components/icon/icon-mail";
import { useRouter } from "next/navigation";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaExclamationCircle } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { useForm } from "react-hook-form";
import { ResetPassAction } from "@/store/actions/userActions";
import ButtonLoader from "../button-loader";

const ComponentsAuthResetPassword = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const email = useSelector((state: IRootState) => state.user.email); // Access email from Redux state
  const loading = useSelector((state: IRootState) => state.user.loading); // Access email from Redux state

  // Form state
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showError, setShowError] = useState(false);

  const schema = yup.object({
    confirmPassword: yup
      .string()
      .required("Confirm password is Required")
      .min(6, "Password must be at least 6 characters")
      .max(32, "Password must be at most 32 characters"),

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

  const submitForm = async (data) => {
    // Basic client-side validation for password matching
    if (data?.password !== data?.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setError("");
    setSuccess("");

    try {
      // Call the resetPassword service with the email and new password
      const response = await dispatch<any>(
        ResetPassAction({ email: email, password: data.password })
      );

      if (response) {
        setSuccess("Password has been successfully reset.");
        // Navigate to a login or home page after successful password reset
        router.push("/login");
      } else {
        setError("Failed to reset password. Please try again.");
      }
    } catch (error) {
      console.log(error);
      setError("An error occurred while resetting your password.");
    }
  };

  return (
    <form
      className="space-y-5 dark:text-white"
      onSubmit={handleSubmit(submitForm)}
    >
      {error !== "" && (
        <div className="flex justify-center">
          <span className="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded dark:bg-gray-700 dark:text-red-400 border border-red-400">
            {error}
          </span>
        </div>
      )}

      <div>
        <label htmlFor="NewPassword">New Password</label>
        <div className="relative text-white-dark">
          <input
            id="NewPassword"
            type="password"
            placeholder="Enter new password"
            onChange={() => {
              setError("");
            }}
            className={`form-input ps-10 placeholder:text-white-dark ${errors.password ? "border-red-500" : ""}`}
            {...register("password")}
          />
          <span className="absolute start-4 top-1/2 -translate-y-1/2">
            <IconMail fill={true} />
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
      <div>
        <label htmlFor="Password">Confirm Password</label>
        <div className="relative text-white-dark">
          <input
            id="Password"
            type="password"
            placeholder="Confirm Password"
            onChange={() => {
              setError("");
            }}
            className={`form-input ps-10 placeholder:text-white-dark ${errors.confirmPassword ? "border-red-500" : ""}`}
            {...register("confirmPassword")}
          />
          <span className="absolute start-4 top-1/2 -translate-y-1/2">
            <IconLockDots fill={true} />
          </span>
          {errors.confirmPassword && (
            <FaExclamationCircle
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
              style={{ fontSize: "calc(1em + 5px)" }}
            />
          )}
        </div>
        {errors.confirmPassword && (
          <div className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
            <div className="flex items-center">
              <GiCancel className="text-white text-[12px]" />
              <span className="text-white ml-2">
                {errors.confirmPassword.message}
              </span>
            </div>
            <div className="tooltip-arrow" data-popper-arrow></div>
          </div>
        )}{" "}
      </div>
      {success && (
        <div className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-green-500 rounded-lg shadow-sm dark:bg-green-500">
          <div className="flex items-center">
            <span className="text-white ml-2">{success}</span>
          </div>
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      )}
      <button
        type="submit"
        className="btn btn-gradient !mt-6 w-full border-0 uppercase shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
        disabled={loading}
      >
        {loading ? <ButtonLoader /> : "Confirm Password"}
      </button>
    </form>
  );
};

export default ComponentsAuthResetPassword;
