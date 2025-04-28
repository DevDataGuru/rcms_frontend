import { useEffect, useState } from "react";
import IconMenu from "../icon/icon-menu";
import IconSave from "../icon/icon-save";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getEmailSettings, SaveEmailSettingsDetail } from "@/services/settingsService";
import { FaCheckCircle, FaExclamationCircle, FaExclamationTriangle, FaInfoCircle } from "react-icons/fa";
import { jwtDecode } from "jwt-decode";
import ButtonLoader from "../button-loader";

export default function ComponentEmailSettings() {
    const [showEmailFrom, setEmailForm] = useState("Enable");
    const [showAlert, setShowAlert] = useState(null)
    const [loading, setLoading] = useState(false)

    const schema = yup.object({
        smtp_from_name: yup.string().required("SMTP from name is Required"),
        smtp_host: yup.string().required("SMTP host is required"),
        smtp_email: yup.string().required("SMTP email is required"),
        smtp_password: yup.string().required("SMTP password is Required"),
        smtp_Port: yup.string().required("SMTP prot is Required"),
        smtp_Encryption: yup.string().required("SMTP eccryption is Required"),
        email_status: yup.string().required("SMTP status is Required"),

    });

    const {
        register,
        reset,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) })

    const onSubmit = async (formData) => {
        setLoading(true)
        try {
            formData = { ...formData, email_status: formData.email_status === "Enable" ? true : false }
            const user = localStorage.getItem("user")
            const userDetail = jwtDecode(user)
            const response = await SaveEmailSettingsDetail(formData, userDetail.sub)
            if (response) {
                setShowAlert("success");
                setTimeout(() => setShowAlert(null), 3000);
            }
            else {
                setShowAlert("error");
                setTimeout(() => setShowAlert(null), 3000);
            }

        } catch (error) {
            setShowAlert("error");
            setTimeout(() => setShowAlert(null), 3000);
            console.log(error)
        } finally {
            setLoading(false)
        }

    }

    useEffect(() => {
        getEmailSettings().then(res => {
            console.log({ res })
            setValue("smtp_from_name", res.data.smtp_from_name)
            if (res.data.email_status) {

                setValue("smtp_host", res.data.smtp_host)
                setValue("smtp_email", res.data.smtp_email)
                setValue("smtp_password", res.data.smtp_password)
                setValue("smtp_Port", res.data.smtp_Port)
                setValue("smtp_Encryption", res.data.smtp_Encryption)
                setValue("email_status", res.data.email_status ? "Enable" : "Disable")

            }
        }

        ).catch(error => {
            console.log({ error })
        })
    }, [])
    return (
        <>
            {showAlert && (
                <div
                    className={`flex items-center p-3.5 rounded text-white ${showAlert === "success"
                        ? "bg-green-500"
                        : showAlert === "error"
                            ? "bg-red-500"
                            : showAlert === "info"
                                ? "bg-blue-500"
                                : "bg-yellow-500"
                        }`}
                >
                    <span className="text-white w-6 h-6 ltr:mr-4 rtl:ml-4">
                        {showAlert === "success" && <FaCheckCircle />}
                        {showAlert === "error" && <FaExclamationCircle />}
                        {showAlert === "info" && <FaInfoCircle />}
                        {showAlert === "warning" && <FaExclamationTriangle />}
                    </span>
                    <span>
                        <strong className="ltr:mr-1 rtl:ml-1">
                            {showAlert.charAt(0).toUpperCase() + showAlert.slice(1)}!
                        </strong>
                        {showAlert === "success" && " Settings saved successfully."}
                        {showAlert === "error" && " Something went wrong."}
                        {showAlert === "info" && " Informational message here."}
                        {showAlert === "warning" && " Warning message here."}
                    </span>
                    <button
                        type="button"
                        onClick={() => setShowAlert(null)}
                        className="ltr:ml-auto rtl:mr-auto btn btn-sm bg-white text-black"
                    >
                        Dismiss
                    </button>
                </div>
            )}{" "}
            <div className="relative">
                <div className="flex items-center px-6 py-4">
                    <button
                        type="button"
                        className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                    >
                        <IconMenu />
                    </button>
                    <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">Email Settings</h4>
                </div>
                <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div className="form-group">

                        <label className="form-label">SMTP Status</label>
                        <div className="relative">
                            <select
                                className={`form-select  ${errors.email_status ? "border-red-500" : ""}`}
                                {...register("email_status")}
                                onChange={(e) => { setEmailForm(e.target.value) }}>
                                <option className="Enable">Enable</option>
                                <option className="Disable">Disable</option>
                            </select>

                            {errors.email_status && (
                                <FaExclamationCircle
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                    style={{ fontSize: "calc(1em + 5px)" }}
                                />
                            )}
                        </div>
                        {errors.email_status && (
                            <div className="mt-2">
                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                    {String(errors.email_status.message)}
                                </span>
                            </div>
                        )}

                    </div>


                    {showEmailFrom === "Enable" && (
                        <>
                            <div className="form-group">

                                <label className="form-label">SMTP From Name</label>
                                <div className="relative">
                                    <input
                                        id="cc"
                                        type="text"
                                        className={`form-input  ${errors.smtp_from_name ? "border-red-500" : ""}`}
                                        placeholder="Enter SMTP From Name"
                                        {...register("smtp_from_name")}
                                    />

                                    {errors.smtp_from_name && (
                                        <FaExclamationCircle
                                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                            style={{ fontSize: "calc(1em + 5px)" }}
                                        />
                                    )}
                                </div>
                                {errors.smtp_from_name && (
                                    <div className="mt-2">
                                        <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                            {String(errors.smtp_from_name.message)}
                                        </span>
                                    </div>
                                )}


                            </div>

                            <div className="form-group">

                                <label className="form-label">SMTP Host </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        className={`form-input  ${errors.smtp_host ? "border-red-500" : ""}`}
                                        placeholder="Enter SMTP Host"

                                        {...register("smtp_host")}
                                    />


                                    {errors.smtp_host && (
                                        <FaExclamationCircle
                                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                            style={{ fontSize: "calc(1em + 5px)" }}
                                        />
                                    )}
                                </div>
                                {errors.smtp_host && (
                                    <div className="mt-2">
                                        <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                            {String(errors.smtp_host.message)}
                                        </span>
                                    </div>
                                )}
                            </div>
                            <div className="form-group">

                                <label className="form-label">SMTP Email</label>
                                <div className="relative">

                                    <input
                                        id="title"
                                        type="text"
                                        className={`form-input  ${errors.smtp_email ? "border-red-500" : ""}`}
                                        placeholder="Enter SMTP Email"
                                        {...register("smtp_email")}
                                    />


                                    {errors.smtp_email && (
                                        <FaExclamationCircle
                                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                            style={{ fontSize: "calc(1em + 5px)" }}
                                        />
                                    )}
                                </div>
                                {errors.smtp_email && (
                                    <div className="mt-2">
                                        <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                            {String(errors.smtp_email.message)}
                                        </span>
                                    </div>
                                )}

                            </div>
                            <div className="form-group">
                                <label className="form-label">SMTP Password</label>
                                <div className="relative">

                                    <input
                                        id="title"
                                        type="password"
                                        className={`form-input  ${errors.smtp_password ? "border-red-500" : ""}`}
                                        placeholder="Enter SMTP Password"
                                        {...register("smtp_password")}
                                    />


                                    {errors.smtp_password && (
                                        <FaExclamationCircle
                                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                            style={{ fontSize: "calc(1em + 5px)" }}
                                        />
                                    )}
                                </div>
                                {errors.smtp_password && (
                                    <div className="mt-2">
                                        <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                            {String(errors.smtp_password.message)}
                                        </span>
                                    </div>
                                )}

                            </div>
                            <div className="form-group">
                                <label className="form-label">SMTP Port</label>
                                <div className="relative">

                                    <input
                                        id="title"
                                        type="text"
                                        className={`form-input  ${errors.smtp_Port ? "border-red-500" : ""}`}
                                        placeholder="Enter SMTP Port"
                                        {...register("smtp_Port")}
                                    />


                                    {errors.smtp_Port && (
                                        <FaExclamationCircle
                                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                            style={{ fontSize: "calc(1em + 5px)" }}
                                        />
                                    )}
                                </div>
                                {errors.smtp_Port && (
                                    <div className="mt-2">
                                        <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                            {String(errors.smtp_Port.message)}
                                        </span>
                                    </div>
                                )}

                            </div>
                            <div className="form-group">
                                <label className="form-label">SMTP Encryption</label>
                                <div className="relative">

                                    <select
                                        {...register("smtp_Encryption")}
                                        className={`form-select  ${errors.smtp_Encryption ? "border-red-500" : ""}`}>
                                        <option>SSL</option>
                                        <option>TLS</option>
                                    </select>


                                    {errors.smtp_Encryption && (
                                        <FaExclamationCircle
                                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                            style={{ fontSize: "calc(1em + 5px)" }}
                                        />
                                    )}
                                </div>
                                {errors.smtp_Encryption && (
                                    <div className="mt-2">
                                        <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                            {String(errors.smtp_Encryption.message)}
                                        </span>
                                    </div>
                                )}

                            </div>
                        </>

                    )}
                </form>

                {/* <!-- Sticky Save Button --> */}
                {/* <div className="sticky bottom-0 bg-white p-4 border-t">
    </div>
*/}
                <div className="sticky bottom-0 bg-white border-t p-4 flex justify-end space-x-3">
                    <div className="flex justify-end items-center">
                        <button
                            type="button"
                            className="btn btn-success ltr:mr-3 rtl:ml-3"
                            onClick={handleSubmit(onSubmit)}
                        >
                            {loading ? (<><ButtonLoader /></>) : (<>
                                <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                Save changes
                            </>)}
                        </button>

                    </div>

                </div>
            </div>
        </>

    );
}