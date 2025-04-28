import { IoMdInformationCircleOutline } from "react-icons/io";
import Tippy from "@tippyjs/react";
import IconMenu from "../icon/icon-menu";
import IconSave from "../icon/icon-save";
import { useEffect, useState } from "react";
import * as yup from "yup"
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { FaCheckCircle, FaExclamationCircle, FaInfoCircle, FaExclamationTriangle } from "react-icons/fa";
import { getGeneralSettingsDetail, SaveGeneralSettingsDetail } from "@/services/settingsService";
import { jwtDecode } from "jwt-decode";
import ButtonLoader from "../button-loader";

export default function ComponentGeneralSettings() {
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(null)
    const schema = yup.object({
        comapny_location: yup.string().required("company location is Required"),
        sidebar_color: yup.string().optional(),
        header_color: yup.string().optional(),
        company_name: yup.string().required("company name is Required"),
        company_name_arabic: yup.string().required("company name arabic is Required"),
        company_phone: yup.string().required("Phone number is Required"),
        owner_name: yup.string().required("owner name is Required"),
        owner_name_arabic: yup.string().required("owner name arabic is Required"),
        owner_mobile_no: yup.string().required("owner mobile is Required"),
        company_email: yup.string().required("company email is Required"),
        company_email_login_url: yup.string().required("company email yup is Required"),
        evg_user_type: yup.string().required("evg user type is Required"),
        evg_username: yup.string().optional(),
        evg_password: yup.string().optional(),
        evg_organizational_tcn: yup.string().optional(),
        evg_representative_rcn: yup.string().optional(),
        evg_organizational_password: yup.string().optional(),

    });

    const {
        register,
        reset,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const onSubmit = async (data) => {
        setLoading(true)
        try {
            let userDetail
            const user = localStorage.getItem("user")
            if (user) {
                userDetail = jwtDecode(user)
            }
            const result = await SaveGeneralSettingsDetail(data, userDetail.sub)
            if (result) {
                setShowAlert("success");
                setTimeout(() => setShowAlert(null), 3000);
            }
        } catch (error) {
            console.log(error)
            setShowAlert("error");
            setTimeout(() => setShowAlert(null), 3000);

        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        getGeneralSettingsDetail(1).then(res => {
            setValue("comapny_location", res.data.comapny_location)
            setValue("sidebar_color", res.data.sidebar_color)
            setValue("header_color", res.data.header_color)
            setValue("company_name", res.data.company_name)
            setValue("company_name_arabic", res.data.company_name_arabic)
            setValue("company_phone", res.data.company_phone)
            setValue("owner_name", res.data.owner_name)
            setValue("owner_name_arabic", res.data.owner_name_arabic)
            setValue("owner_mobile_no", res.data.owner_mobile_no)
            setValue("company_email", res.data.company_email)
            setValue("company_email_login_url", res.data.company_email_login_url)
            setValue("evg_user_type", res.data.evg_user_type)
            setValue("evg_username", res.data.evg_username)
            setValue("evg_password", res.data.evg_password)
            setValue("evg_organizational_tcn", res.data.evg_organizational_tcn)
            setValue("evg_representative_rcn", res.data.evg_representative_rcn)
            setValue("evg_organizational_password", res.data.evg_organizational_password)
        }).catch(error => {
            console.log(error)
        })

    }, [])
    const [loginType, setLoginType] = useState('individual');
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
                    <h4 className="text-lg font-medium text-gray-600 dark:text-gray-400">General Settings</h4>
                </div>
                <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>

                <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div className="form-group">
                        <div
                            className='flex justify-between'>

                            <label className="form-label">Company location</label>
                            <div className=''>
                                <Tippy content="This mainly used for check the traffic fines functions." placement="left">
                                    <button type="button">
                                        <IoMdInformationCircleOutline
                                            className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                        />
                                    </button>
                                </Tippy>

                            </div>
                        </div>
                        <div className="relative">
                            <input
                                id="cc"
                                type="text"
                                className={`form-input  ${errors.comapny_location ? "border-red-500" : ""}`}
                                placeholder="Enter Company location"
                                {...register("comapny_location")}

                            />
                            {errors.comapny_location && (
                                <FaExclamationCircle
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                    style={{ fontSize: "calc(1em + 5px)" }}
                                />
                            )}
                        </div>
                        {errors.comapny_location && (
                            <div className="mt-2">
                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                    {String(errors.comapny_location.message)}
                                </span>
                            </div>
                        )}
                    </div>


                    <div className="form-group">
                        <div
                            className='flex justify-between'>

                            <label className="form-label">Company Logo</label>
                            <div className=''>
                                <Tippy content="Default: https://alrahal.crs.ae/node/assets/img/nlogo/logo-systems.png?nver=033520" placement="left">
                                    <button type="button">
                                        <IoMdInformationCircleOutline
                                            className="text-xl text-blue-700 hover:text-blue-800 cursor-pointer"
                                        />
                                    </button>
                                </Tippy>

                            </div>
                        </div>

                        <input
                            type="file"
                            className={`form-input  p-0 file:border-0 file:bg-primary/90 file:px-4 file:py-2 file:font-semibold file:text-white file:hover:bg-primary`}
                            multiple
                            accept="image/*,.zip,.pdf,.xls,.xlsx,.txt,.doc,.docx"
                            required
                        />
                    </div>
                    <div className="form-group">

                        <label className="form-label">Company name</label>
                        <div className="relative">
                            <input
                                type="text"
                                className={`form-input  ${errors.company_name ? "border-red-500" : ""} `}
                                placeholder="company name"
                                {...register("company_name")}
                            />
                            {errors.company_name && (
                                <FaExclamationCircle
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                    style={{ fontSize: "calc(1em + 5px)" }}
                                />
                            )}
                        </div>
                        {errors.company_name && (
                            <div className="mt-2">
                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                    {String(errors.company_name.message)}
                                </span>
                            </div>
                        )}

                    </div>
                    <div className="form-group">

                        <label className="form-label">Company name (Arabic)</label>
                        <div className="relative">
                            <input
                                type="text"
                                className={`form-input  ${errors.company_name_arabic ? "border-red-500" : ""} `}
                                placeholder="company name (Arabic)"

                                {...register("company_name_arabic")}
                            />
                            {errors.company_name_arabic && (
                                <FaExclamationCircle
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                    style={{ fontSize: "calc(1em + 5px)" }}
                                />
                            )}
                        </div>
                        {errors.company_name_arabic && (
                            <div className="mt-2">
                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                    {String(errors.company_name_arabic.message)}
                                </span>
                            </div>
                        )}

                    </div>
                    <div className="form-group">
                        <label className="form-label">Company phone</label>
                        <div className="relative">
                            <input
                                id="title"
                                type="text"
                                className={`form-input  ${errors.company_phone ? "border-red-500" : ""} `}
                                placeholder="Enter Company phone"
                                {...register("company_phone")}

                            />
                            {errors.company_phone && (
                                <FaExclamationCircle
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                    style={{ fontSize: "calc(1em + 5px)" }}
                                />
                            )}
                        </div>
                        {errors.company_phone && (
                            <div className="mt-2">
                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                    {String(errors.company_phone.message)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Owner name</label>
                        <div className="relative">

                            <input
                                id="title"
                                type="text"
                                className={`form-input ${errors.owner_name ? "border-red-500" : ""}`}
                                placeholder="Enter Owner name"
                                {...register("owner_name")}

                            />
                            {errors.owner_name && (
                                <FaExclamationCircle
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                    style={{ fontSize: "calc(1em + 5px)" }}
                                />
                            )}
                        </div>
                        {errors.owner_name && (
                            <div className="mt-2">
                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                    {String(errors.owner_name.message)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Owner name (Arabic)</label>
                        <div className="relative">

                            <input
                                id="title"
                                type="text"
                                className={`form-input ${errors.owner_name_arabic ? "border-red-500" : ""}`}
                                placeholder="Enter Owner name (Arabic)"
                                {...register("owner_name_arabic")}

                            />
                            {errors.owner_name_arabic && (
                                <FaExclamationCircle
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                    style={{ fontSize: "calc(1em + 5px)" }}
                                />
                            )}
                        </div>
                        {errors.owner_name_arabic && (
                            <div className="mt-2">
                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                    {String(errors.owner_name_arabic.message)}
                                </span>
                            </div>
                        )}

                    </div>
                    <div className="form-group">
                        <label className="form-label">Owner mobile</label>
                        <div className="relative">

                            <input
                                id="title"
                                type="text"
                                className={`form-input ${errors.owner_mobile_no ? "border-red-500" : ""}`}
                                placeholder="Enter Owner mobile"
                                {...register("owner_mobile_no")}

                            />
                            {errors.owner_mobile_no && (
                                <FaExclamationCircle
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                    style={{ fontSize: "calc(1em + 5px)" }}
                                />
                            )}
                        </div>
                        {errors.owner_mobile_no && (
                            <div className="mt-2">
                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                    {String(errors.owner_mobile_no.message)}
                                </span>
                            </div>
                        )}

                    </div>
                    <div className="form-group">
                        <label className="form-label">Company email address</label>
                        <div className="relative">

                            <input
                                id="title"
                                type="text"
                                className={`form-input ${errors.company_email ? "border-red-500" : ""}`}
                                placeholder="Enter Company email address"
                                {...register("company_email")}

                            />
                            {errors.company_email && (
                                <FaExclamationCircle
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                    style={{ fontSize: "calc(1em + 5px)" }}
                                />
                            )}
                        </div>
                        {errors.company_email && (
                            <div className="mt-2">
                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                    {String(errors.company_email.message)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Company email address login url</label>
                        <div className="relative">

                            <input
                                id="title"
                                type="text"
                                className={`form-input ${errors.company_email_login_url ? "border-red-500" : ""}`}
                                placeholder="Enter Company email address"
                                {...register("company_email_login_url")}

                            />
                            {errors.company_email_login_url && (
                                <FaExclamationCircle
                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                    style={{ fontSize: "calc(1em + 5px)" }}
                                />
                            )}
                        </div>
                        {errors.company_email_login_url && (
                            <div className="mt-2">
                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                    {String(errors.company_email_login_url.message)}
                                </span>
                            </div>
                        )}
                    </div>
                    <div className="form-group">
                        <label className="form-label">Sidebar background</label>
                        <input
                            id="title"
                            type="color"
                            className="form-input text-lg"
                            {...register("sidebar_color")}

                        />
                    </div>
                    <div className="form-group">
                        <label className="form-label">Header background</label>
                        <input
                            id="title"
                            type="color"
                            className="form-input text-lg"
                            {...register("header_color")}

                        />
                    </div>

                    <div className="form-group">
                        <div className='flex justify-between'>
                            <label className="form-label">EVG login type </label>
                        </div>
                        <select className="form-select" {...register("evg_user_type")} onChange={(e) => { setLoginType(e.target.value) }}>
                            <option value="individual">Individual</option>
                            <option value="organizational">Organizational</option>
                        </select>
                    </div>
                    {loginType === 'individual' ? (
                        <>
                            <div className="form-group">
                                <label className="form-label">EVG username</label>
                                <input
                                    id="title"
                                    type="text"
                                    className="form-input"
                                    placeholder="EVG username"
                                    {...register("evg_username")}

                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">EVG password</label>
                                <input
                                    id="title"
                                    type="text"
                                    className="form-input"
                                    placeholder="EVG password"
                                    {...register("evg_password")}

                                />
                            </div>
                        </>



                    ) : (
                        <>
                            <div className="form-group">
                                <label className="form-label">EVG Organization TCN</label>
                                <input
                                    id="title"
                                    type="text"
                                    className="form-input"
                                    placeholder="EVG Organization TCN"
                                    {...register("evg_organizational_tcn")}

                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">EVG Representative TCN</label>
                                <input
                                    id="title"
                                    type="text"
                                    className="form-input"
                                    placeholder="EVG Representative TCN"
                                    {...register("evg_representative_rcn")}

                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">EVG password</label>
                                <input
                                    id="title"
                                    type="text"
                                    className="form-input"
                                    placeholder="EVG password"
                                    {...register("evg_organizational_password")}

                                />
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
                            {loading ? (<>
                                <ButtonLoader />
                            </>

                            ) : (
                                <>
                                    <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                    Save changes
                                </>
                            )}
                        </button>

                    </div>

                </div>
            </div>

        </>
    );
}