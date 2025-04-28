"use client"

import { useState, useEffect } from "react";
import IconMail from "@/components/icon/icon-mail";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { setEmail } from "@/store/slices/userSlice";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaExclamationCircle } from "react-icons/fa";
import { GiCancel } from "react-icons/gi";
import { IRootState } from "@/store";
import ButtonLoader from "../button-loader";
import { forgetPasswordAction } from "@/store/actions/userActions";
import { useForm } from "react-hook-form";

const ComponentsAuthResetPasswordForm = () => {
  const { loading } = useSelector((state: IRootState) => state.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [countdown, setCountdown] = useState(60);

  // Track attempts in localStorage to persist across page refreshes
  const getAttempts = () => {
    const attempts = localStorage.getItem("passwordResetAttempts");
    const timestamp = localStorage.getItem("passwordResetTimestamp");

    if (!attempts || !timestamp) return 0;

    // Check if the timestamp is older than 60 seconds
    if (Date.now() - parseInt(timestamp) > 60000) {
      localStorage.removeItem("passwordResetAttempts");
      localStorage.removeItem("passwordResetTimestamp");
      return 0;
    }

    return parseInt(attempts);
  };

  const incrementAttempts = () => {
    const currentAttempts = getAttempts();
    localStorage.setItem(
      "passwordResetAttempts",
      (currentAttempts + 1).toString()
    );
    localStorage.setItem("passwordResetTimestamp", Date.now().toString());
    return currentAttempts + 1;
  };

  useEffect(() => {
    // Check initial rate limit status
    const attempts = getAttempts();
    if (attempts >= 3) {
      setIsRateLimited(true);
      const timestamp = parseInt(
        localStorage.getItem("passwordResetTimestamp") || "0"
      );
      const timeLeft = Math.ceil((60000 - (Date.now() - timestamp)) / 1000);
      setCountdown(timeLeft > 0 ? timeLeft : 60);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (isRateLimited && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            setIsRateLimited(false);
            localStorage.removeItem("passwordResetAttempts");
            localStorage.removeItem("passwordResetTimestamp");
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRateLimited, countdown]);

  const schema = yup.object({
    email: yup.string().email().required("Email is Required"),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const submitForm = async (data) => {
    if (isRateLimited) {
      return;
    }

    try {
      const attempts = incrementAttempts();
      if (attempts >= 3) {
        setIsRateLimited(true);
        setError(`Too many attempts. Try again in ${countdown} seconds.`);
        return;
      }

      const response = await dispatch<any>(
        forgetPasswordAction({ email: data.email })
      );

      if (response) {
        setSuccess("Password recovery email sent successfully.");
        dispatch(setEmail(data.email));
        router.push("/otp-confirm");
      }
    } catch (err) {
      setError("Failed to send password recovery email. Please try again.");
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit(submitForm)}>
      <div>
        <label htmlFor="Email" className="dark:text-white">
          Email
        </label>
        <div className="relative text-white-dark">
          <input
            id="Email"
            type="text"
            name="email"
            placeholder="Enter Email"
            className={`form-input ps-10 placeholder:text-white-dark ${errors.email || error ? "border-red-500" : ""
              }`}
            {...register("email")}
          />
          <span className="absolute start-4 top-1/2 -translate-y-1/2">
            <IconMail fill={true} />
          </span>
          {(errors.email || error) && (
            <FaExclamationCircle
              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
              style={{ fontSize: "calc(1em + 5px)" }}
            />
          )}
        </div>
        {(errors.email || error) && (
          <div className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
            <div className="flex items-center">
              <GiCancel className="text-white text-[12px]" />
              <span className="text-white ml-2">
                {errors.email ? errors.email.message : error}
              </span>
            </div>
          </div>
        )}
      </div>

      {success && (
        <div className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-green-500 rounded-lg shadow-sm dark:bg-green-500">
          <div className="flex items-center">
            <GiCancel className="text-white text-[12px]" />
            <span className="text-white ml-2">{success}</span>
          </div>
        </div>
      )}

      <button
        type="submit"
        className={`btn w-full border-0 uppercase ${isRateLimited
          ? "bg-gradient-to-r from-pink-500 to-purple-500"
          : "btn-gradient shadow-[0_10px_20px_-10px_rgba(67,97,238,0.44)]"
          }`}
        disabled={loading || isRateLimited}
      >
        {isRateLimited ? (
          `WAIT ${countdown} seconds`
        ) : loading ? (
          <ButtonLoader />
        ) : (
          "RECOVER"
        )}
      </button>
    </form>
  );
};

export default ComponentsAuthResetPasswordForm;
