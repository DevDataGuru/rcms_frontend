'use client';
import ButtonLoader from '@/components/button-loader';
import IconLock from '@/components/icon/icon-lock';
import IconSave from '@/components/icon/icon-save';
import IconUser from '@/components/icon/icon-user';
import IconUsers from '@/components/icon/icon-users';
import { getUsersProfile, updateUserProfile, updateUserSecurity, profileImageUpdate } from '@/services/usersService';
import { yupResolver } from '@hookform/resolvers/yup';
import { jwtDecode } from 'jwt-decode';
import { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaExclamationCircle } from 'react-icons/fa';
import Dropzone from "react-dropzone-uploader";
import * as yup from "yup";
import { IRootState } from '@/store';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { SaveUserDetail } from '@/store/slices/userSlice';

const ComponentsUsersAccountSettingsTabs = () => {
    const [userDataToken, setUserDataToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [reloadRecord, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(null);
    const [selfSecurityError, setSecurityError] = useState("An error occurred. Please try again.")
    const [ProfileImage, setProfileImage] = useState(null)
    const dispatch = useDispatch()
    const handleRelaod = () => {
        setReload(!reloadRecord)
    };
    const userDetail = useSelector((state: IRootState) => state.user.userDetail)

    const [tabs, setTabs] = useState<string>('Profile');
    const toggleTabs = (name: string) => {
        setTabs(name);
    };
    const schema = yup.object({
        first_name: yup.string().required("First name is Required"),
        last_name: yup.string().required("Last name is Required"),
        sex: yup.string().required("Gender is Required"),
        nationality: yup.string().required("Nationality is Required"),
        phone_no: yup.string().required("Phone number is Required"),
        motherland_phone_no: yup.string().required("Motherland phone no is Required"),
        current_address: yup.string().required("Current address is Required"),
        motherland_address: yup.string().required("Motherland address is Required"),
        interests: yup.string().required("Intrests is Required"),
        occupation: yup.string().required("Occupation is Required"),
        website_url: yup.string().required("Website url is Required"),
        about_me: yup.string().required("About me is Required"),
    });
    const schema2 = yup.object({
        currentPassword: yup.string().required("Current password is Required"),
        newPassword: yup.string().required("New Pasword is Required"),
        confirmPassword: yup.string().required("Confirm Password is Required"),
        inactivityTime: yup.string().optional()
    });
    const {
        register,
        reset,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });
    const {
        register: registerSecurity,
        reset: resetSecurity,
        handleSubmit: handleSubmitSecurity,
        setValue: setSecurtiyValue,
        formState: { errors: securityError },
    } = useForm({ resolver: yupResolver(schema2) });

    useEffect(() => {
        const tokenData = localStorage.getItem("user");
        const decodedData = jwtDecode(tokenData)
        setUserDataToken(decodedData)
    }, [])

    useEffect(() => {
        if (userDataToken) {
            getUsersProfile(userDataToken?.sub).then(res => {
                setValue("first_name", res?.data?.first_name)
                setValue("last_name", res?.data?.last_name)
                setValue("sex", res?.data?.sex)
                setValue("nationality", res?.data?.nationality)
                setValue("phone_no", res?.data?.phone_no)
                setValue("motherland_phone_no", res?.data?.motherland_phone_no)
                setValue("current_address", res?.data?.current_address)
                setValue("motherland_address", res?.data?.motherland_address)
                setValue("interests", res?.data?.interests)
                setValue("occupation", res?.data?.occupation)
                setValue("website_url", res?.data?.website_url)
                setValue("about_me", res?.data?.about_me)
            }).catch(err => {
                console.log(err)
            })
        }
    }, [userDataToken, reloadRecord])
    const onDrop = useCallback((acceptedFiles) => {
        console.log('Accepted files:', acceptedFiles);
        // You can handle the files here, e.g., upload them to a server or process them.
    }, []);

    const handleProfileUpdate = async (formData) => {
        setLoading(true);
        try {

            const result = await updateUserProfile(userDataToken?.sub, formData);
            if (result) {
                localStorage.setItem("user", result?.data)
                dispatch(SaveUserDetail(jwtDecode(result?.data)));
                setShowAlert("success");
                setTimeout(() => setShowAlert(null), 3000);
                handleRelaod()
            }
        } catch (error) {
            console.log(error)
            setShowAlert("error");
            setTimeout(() => setShowAlert(null), 3000);

        } finally {
            setLoading(false)
        }
    }
    const handleSecurityUpdate = async (formData) => {
        setLoading(true);
        try {
            if (formData.newPassword !== formData.confirmPassword) {
                setShowAlert("error");
                setSecurityError("Password does not match")
                return;
            }
            const result = await updateUserSecurity(userDataToken?.sub, formData);
            if (result.status == 400) {
                setShowAlert("error");
                setSecurityError("Current password does not match")
                setTimeout(() => setShowAlert(null), 3000);

            }
            else {
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


    const handleImageValidate = ({ meta, file }, status, allFiles) => {
        const allowedExtensions = ["jpg", "jpeg", "png"]; // Add more extensions if needed
        const fileExtension = file?.name?.split(".").pop().toLowerCase();
        if (!allowedExtensions.includes(fileExtension)) {
            setShowAlert("error");
            setTimeout(() => setShowAlert(null), 3000);

            return false;
        }
    };


    const getUploadParams = ({ meta }) => {
        return { url: "https://httpbin.org/post" };
    };

    const handleChangeStatus = ({ meta, file }, status, allFiles) => {
        console.log(status, { meta, file, allFiles });
        if (status === "rejected_file_type") {
            // toast.error(t("vld_ChooseFormat"));
            return;
        }
        if (status === "removed") {
            setProfileImage(null);
            return;
        }
        const uploadedFiles = allFiles.map((f) => f.file);

        setProfileImage(uploadedFiles);
    };

    const handleProfileImageUpdate = async () => {
        try {
            let userDetail;
            const user = localStorage.getItem("user");
            if (user) {
                userDetail = jwtDecode(user);
            }

            // Create FormData for multipart/form-data
            const formData = new FormData();
            formData.append("profileImage", ProfileImage[0]); // Add the profile image file

            // Send the multipart request
            const result = await profileImageUpdate(formData, userDetail?.sub); // Ensure profileImageUpdate is set to handle FormData

            if (result) {
                localStorage.setItem("user", result?.data)
                dispatch(SaveUserDetail(jwtDecode(result?.data)));
                setShowAlert("success");
                setTimeout(() => setShowAlert(null), 3000);
            } else {
                setShowAlert("error");
                setTimeout(() => setShowAlert(null), 3000);
            }
        } catch (error) {
            console.error(error);
            setShowAlert("error");
            setTimeout(() => setShowAlert(null), 3000);
        }
    };
    return (
        <div className="pt-5">
            <div>
                <ul className="mb-5 overflow-y-auto whitespace-nowrap border-b border-[#ebedf2] font-semibold dark:border-[#191e3a] sm:flex">
                    <li className="inline-block text-black">
                        <button
                            onClick={() => toggleTabs('Profile')}
                            className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'Profile' ? '!border-primary text-primary' : ''}`}
                        >
                            <IconUsers />
                            Profile
                        </button>
                    </li>
                    <li className="inline-block text-black">
                        <button
                            onClick={() => toggleTabs('payment-details')}
                            className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'payment-details' ? '!border-primary text-primary' : ''}`}
                        >
                            <IconUser />
                            Change avatar
                        </button>
                    </li>
                    <li className="inline-block text-black">
                        <button
                            onClick={() => toggleTabs('preferences')}
                            className={`flex gap-2 border-b border-transparent p-4 hover:border-primary hover:text-primary ${tabs === 'preferences' ? '!border-primary text-primary' : ''}`}
                        >
                            <IconLock className="h-5 w-5" />
                            Security
                        </button>
                    </li>
                </ul>
            </div>
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
                        <svg>...</svg>
                    </span>
                    <span>
                        <strong className="ltr:mr-1 rtl:ml-1">
                            {showAlert.charAt(0).toUpperCase() + showAlert.slice(1)}
                            !
                        </strong>
                        {(showAlert === "success" && tabs === "Profile") &&
                            "User registered successfully."}
                        {(showAlert === "success" && tabs === "preferences") &&
                            "Password changes successfully."}

                        {showAlert === "error" &&
                            (selfSecurityError)}
                        {showAlert === "info" && "Informational message here."}
                        {showAlert === "warning" && "Warning message here."}
                    </span>
                    <button
                        type="button"
                        onClick={() => setShowAlert(null)}
                        className="ltr:ml-auto rtl:mr-auto btn btn-sm bg-white text-black"
                    >
                        Dismiss
                    </button>
                </div>
            )}
            {tabs === 'Profile' ? (
                <>

                    <div>
                        <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                            <h6 className="mb-5 text-lg font-bold">Profile update</h6>
                            <div className="flex flex-col sm:flex-row">
                                <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4 ">
                                    <img src={`${userDetail?.profileImage}`} alt="img" className="mx-auto h-20 w-20 rounded-full object-cover md:h-32 md:w-32" />
                                </div>
                                <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 p-4 bg-yellow-50 dark:border-[#191e3a] dark:bg-black">
                                    <div>
                                        <label htmlFor="name">First Name</label>
                                        <div className="relative">

                                            <input id="name" type="text" className={` form-input ${errors.first_name ? "border-red-500" : ""}`} placeholder="First name"  {...register("first_name")} />
                                            {errors.first_name && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}

                                        </div>
                                        {errors.first_name && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.first_name.message}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                    <div>
                                        <label htmlFor="name">Last Name</label>
                                        <div className="relative">
                                            <input id="name" type="text" placeholder="Last name" className={` form-input ${errors.last_name ? "border-red-500" : ""}`} {...register("last_name")} />
                                            {errors.last_name && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}

                                        </div>
                                        {errors.last_name && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.last_name.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div>
                                        <label htmlFor="profession">Gender</label>
                                        <div className="relative">

                                            <select id="country" className={` form-select ${errors.sex ? "border-red-500" : ""}`} name="country" defaultValue="United States" {...register("sex")} >
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                            {errors.sex && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}

                                        </div>
                                        {errors.sex && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.sex.message}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                    <div>
                                        <label htmlFor="country">Nationality</label>
                                        <div className="relative">
                                            <select id="country" className={` form-select ${errors.nationality ? "border-red-500" : ""}`} name="country" defaultValue="United States" {...register("nationality")}>

                                                <option value="All Countries">All Countries</option>
                                                <option value="United States">United States</option>
                                                <option value="India">India</option>
                                                <option value="Japan">Japan</option>
                                                <option value="China">China</option>
                                                <option value="Brazil">Brazil</option>
                                                <option value="Norway">Norway</option>
                                                <option value="Canada">Canada</option>
                                            </select>
                                            {errors.nationality && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}

                                        </div>
                                        {errors.nationality && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.nationality.message}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                    <div>
                                        <label htmlFor="address">Mobile number</label>
                                        <div className="relative">

                                            <input id="address" type="text" placeholder="+1 (530) 555-12121" className={` form-input ${errors.phone_no ? "border-red-500" : ""}`} {...register("phone_no")} />
                                            {errors.phone_no && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}

                                        </div>
                                        {errors.phone_no && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.phone_no.message}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                    <div>
                                        <label htmlFor="location">Motherland contact number</label>
                                        <div className="relative">

                                            <input id="location" type="text" placeholder="+1 (530) 555-12121" className={` form-input ${errors.motherland_phone_no ? "border-red-500" : ""}`}{...register("motherland_phone_no")} />
                                            {errors.motherland_phone_no && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}

                                        </div>
                                        {errors.motherland_phone_no && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.motherland_phone_no.message}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                    <div>
                                        <label htmlFor="phone">Current address</label>
                                        <div className="relative">

                                            <input id="phone" type="text" placeholder="Current address" className={` form-input ${errors.current_address ? "border-red-500" : ""}`} {...register("current_address")} />
                                            {errors.current_address && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}

                                        </div>
                                        {errors.current_address && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.current_address.message}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                    <div>
                                        <label htmlFor="email">Motherland address</label>
                                        <div className="relative">

                                            <input id="email" type="email" placeholder="Motherland address" className={` form-input ${errors.motherland_address ? "border-red-500" : ""}`} {...register("motherland_address")} />
                                            {errors.motherland_address && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}

                                        </div>
                                        {errors.motherland_address && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.motherland_address.message}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                    <div>
                                        <label htmlFor="web">Intrest</label>
                                        <div className="relative">
                                            <input id="web" type="text" placeholder="Intrest" className={` form-input ${errors.interests ? "border-red-500" : ""}`} {...register("interests")} />
                                            {errors.interests && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}

                                        </div>
                                        {errors.interests && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.interests.message}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                    <div>
                                        <label htmlFor="web">Occupation</label>
                                        <div className="relative">
                                            <input id="web" type="text" placeholder="Occupation" className={` form-input ${errors.occupation ? "border-red-500" : ""}`} {...register("occupation")} />
                                            {errors.occupation && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}

                                        </div>
                                        {errors.occupation && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.occupation.message}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                    <div className=''>
                                        <label htmlFor="web">Website Url</label>

                                        <div className="relative">

                                            <input id="web" type="text" placeholder="Website url" className={` form-input ${errors.website_url ? "border-red-500" : ""}`}{...register("website_url")} />
                                            {errors.website_url && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}

                                        </div>
                                        {errors.website_url && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.website_url.message}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                    <div>
                                        <label htmlFor="web">About me</label>
                                        <div className="relative">

                                            <textarea className={` form-textarea ${errors.about_me ? "border-red-500" : ""}`} {...register("about_me")} />
                                            {errors.about_me && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}

                                        </div>
                                        {errors.about_me && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.about_me.message}
                                                </span>
                                            </div>
                                        )}

                                    </div>
                                    {/* <div>
                                    <label className="inline-flex cursor-pointer">
                                        <input type="checkbox" className="form-checkbox" />
                                        <span className="relative text-white-dark checked:bg-none">Make this my default address</span>
                                    </label>
                                </div> */}

                                    <div className="mt-3 mb-3 mr-3 flex justify-end sm:col-span-2">
                                        <button
                                            type="button"
                                            className="btn btn-success ltr:mr-3 rtl:ml-3 rounded-full"
                                            onClick={handleSubmit(handleProfileUpdate)}
                                        >
                                            {loading ? <ButtonLoader /> : (<><IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />Save</>)}

                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </>

            ) : (
                ''
            )}
            {
                tabs === 'payment-details' ? (
                    <div>
                        <form className="mb-5 rounded-md border  border-[#ebedf2] bg-white  p-4 dark:border-[#191e3a] dark:bg-black">


                            <h6 className="mb-5 text-lg font-bold">Change avatar</h6>
                            <div className="flex flex-col sm:flex-row">
                                <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4">
                                    <img src={userDetail?.profileImage} alt="img" className="mx-auto h-20 w-20 rounded-full object-cover md:h-32 md:w-32" />
                                </div>
                                <div className="grid flex-1 px-4 py-4 grid-cols-1 bg-yellow-50 gap-5 sm:grid-cols-2 dark:border-[#191e3a] dark:bg-black">

                                    <Dropzone
                                        getUploadParams={getUploadParams}
                                        onChangeStatus={handleChangeStatus}
                                        submitButtonContent={null}
                                        maxFiles={1}
                                        accept="image/*"
                                        styles={{
                                            dropzone: {
                                                border: "none", // Disable Dropzone's default border
                                            },
                                        }}
                                    >
                                        {({ getRootProps, getInputProps }) => (
                                            <div
                                                {...getRootProps({
                                                    className:
                                                        "border-2 border-dashed border-gray-300 rounded-lg p-6 bg-gray-50 cursor-pointer hover:bg-gray-100 scroll-none transition duration-200",
                                                })}
                                            >
                                                <input {...getInputProps()} />
                                                <p className="text-center text-gray-500">
                                                    Drag & drop an image here, or <span className="text-blue-500 font-medium">click to browse</span>.
                                                </p>
                                                <p className="text-sm text-center text-gray-400 mt-2">
                                                    Max file size: 1MB
                                                </p>
                                            </div>
                                        )}
                                    </Dropzone>

                                    <div className="mt-3 mb-3 mr-3 flex justify-end sm:col-span-2">
                                        <button
                                            type="button"
                                            className="btn btn-success ltr:mr-3 rtl:ml-3 rounded-full"
                                            onClick={handleProfileImageUpdate}
                                        >
                                            {loading ? <ButtonLoader /> : (<><IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />Save</>)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>


                ) : (
                    ''
                )
            }
            {
                tabs === 'preferences' ? (
                    <div>
                        <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">


                            <h6 className="mb-5 text-lg font-bold">Security </h6>
                            <div className="flex flex-col sm:flex-row">
                                <div className="grid flex-1 px-4 py-4 grid-cols-1 bg-yellow-50 gap-5 sm:grid-cols-2 dark:border-[#191e3a] dark:bg-black">
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-white">Change Password</h2>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                                Current Password
                                            </label>
                                            <div className="relative">

                                                <input
                                                    type="password"
                                                    id="current-password"
                                                    className={`mt-1 form-input block w-full p-2 border ${securityError.currentPassword ? "border-red-500" : "border-gray-300"} rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    placeholder="Enter current password"
                                                    {...registerSecurity("currentPassword")}
                                                />
                                                {securityError.currentPassword && (
                                                    <FaExclamationCircle
                                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                        style={{ fontSize: "calc(1em + 5px)" }}
                                                    />
                                                )}

                                            </div>
                                            {securityError.currentPassword && (
                                                <div className="mt-2">
                                                    <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                        {securityError.currentPassword.message}
                                                    </span>
                                                </div>
                                            )}

                                        </div>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                                New Password
                                            </label>
                                            <div className="relative">
                                                <input
                                                    type="password"
                                                    id="new-password"
                                                    className={`mt-1 block form-input w-full p-2 border ${securityError.newPassword ? "border-red-500" : "border-gray-300"}  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    placeholder="Enter new password"
                                                    {...registerSecurity("newPassword")}

                                                />
                                                {securityError.newPassword && (
                                                    <FaExclamationCircle
                                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                        style={{ fontSize: "calc(1em + 5px)" }}
                                                    />
                                                )}

                                            </div>
                                            {securityError.newPassword && (
                                                <div className="mt-2">
                                                    <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                        {securityError.newPassword.message}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Password must be at least 10 characters long. A combination of non-consecutive or sequential uppercase letters,
                                            lowercase letters, numbers, and symbols.
                                        </p>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                                Re-type New Password
                                            </label>
                                            <div className="relative">

                                                <input
                                                    type="password"
                                                    id="confirm-password"
                                                    className={`mt-1 block w-full form-input p-2 border ${securityError.confirmPassword ? "border-red-500" : "border-gray-300"}  rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500`}
                                                    placeholder="Re-enter new password"
                                                    {...registerSecurity("confirmPassword")}

                                                />
                                                {securityError.confirmPassword && (
                                                    <FaExclamationCircle
                                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                        style={{ fontSize: "calc(1em + 5px)" }}
                                                    />
                                                )}

                                            </div>
                                            {securityError.confirmPassword && (
                                                <div className="mt-2">
                                                    <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                        {securityError.confirmPassword.message}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-700 mb-4 dark:text-white">Additional options</h2>
                                        <div className="mb-4">
                                            <label className="block text-sm font-medium text-gray-700 dark:text-white">
                                                Inactivity timeout
                                            </label>
                                            <select
                                                id="inactivity-timeout"
                                                className="mt-1 form-select block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                            >
                                                <option>5 minutes</option>
                                                <option>10 minutes</option>
                                                <option>15 minutes</option>
                                                <option>30 minutes</option>
                                                <option>60 minutes (Default)</option>
                                            </select>
                                            <p className="text-sm text-gray-500 mt-1">Default: 60 minutes</p>
                                        </div>
                                    </div>

                                    <div className="mt-3 mb-3 mr-3 flex justify-end sm:col-span-2">
                                        <button
                                            type="button"
                                            className="btn btn-success ltr:mr-3 rtl:ml-3 rounded-full"
                                            onClick={handleSubmitSecurity(handleSecurityUpdate)}
                                        >
                                            {loading ? <ButtonLoader /> : (<><IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />Save</>)}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                ) : (
                    ''
                )
            }
        </div >
    );
};

export default ComponentsUsersAccountSettingsTabs;
