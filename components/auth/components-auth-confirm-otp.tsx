"use client";
import { useSelector } from "react-redux";
import { IRootState } from "@/store/index";
import { useState } from "react";
import { useRouter } from "next/navigation";
import OtpInput from "react-otp-input"; // Ensure this package is installed
import { GiCancel } from "react-icons/gi";
import { useDispatch } from "react-redux";
import { verifyOtpAction } from "@/store/actions/userActions";
import ButtonLoader from "../button-loader";
const OtpConfirm = () => {
  const email = useSelector((state: IRootState) => state.user.email); // Get email from Redux
  const laoding = useSelector((state: IRootState) => state.user.loading); // Get email from Redux
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const dispatch = useDispatch();
  const handleOtpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const response = await dispatch<any>(verifyOtpAction({ email, otp }));
      if (response) {
        setSuccess("OTP verified successfully.");
        router.push("/reset-password");
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
    }
  };
  return (
    <form className="space-y-5" onSubmit={handleOtpSubmit}>
      <div>
        <div className="relative text-white-dark">
          <OtpInput
            numInputs={4}
            renderSeparator={<span>-</span>}
            renderInput={(props) => <input {...props} />}
            shouldAutoFocus
            inputStyle={{
              width: "3rem",
              height: "3rem",
              margin: "0 0.5rem",
              fontSize: "18px",
              borderRadius: 4,
              border: "1px solid rgba(0,0,0,0.3)",
            }}
            containerStyle={{
              justifyContent: "center",
            }}
            value={otp}
            onChange={(otp) => setOtp(otp)} // Pass the OTP directly as a string
          />
        </div>
      </div>
      {error && (
        <div className="mt-1 z-10 inline-block pl-2 pr-3   text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
          <div className="flex items-center">
            <GiCancel className="text-white text-[12px]" />
            <span className="text-white ml-2">{error}</span>
          </div>
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      )}
      {success && (
        <div className="mt-1 z-10 inline-block pl-2 pr-3  text-sm font-medium text-white transition-opacity duration-300 bg-green-500 rounded-lg shadow-sm dark:bg-green-500">
          <div className="flex items-center">
            <span className="text-white ml-2">{success}</span>
          </div>
          <div className="tooltip-arrow" data-popper-arrow></div>
        </div>
      )}{" "}
      <button
        type="submit"
        className="btn btn-gradient !mt-6 w-full border-0"
        disabled={laoding}
      >
        {laoding ? <ButtonLoader /> : "VERIFY"}
      </button>
    </form>
  );
};
export default OtpConfirm;
