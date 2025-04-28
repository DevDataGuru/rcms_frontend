"use client";
import ButtonLoader from "@/components/button-loader";
import IconSave from "@/components/icon/icon-save";
import { getUsers, updateUserProfile, updateUserSecurity } from "@/services/usersService";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { FaExclamationCircle } from "react-icons/fa";
import { DataTable, DataTableSortStatus } from "mantine-datatable";

import * as yup from "yup";
import IconXCircle from "@/components/icon/icon-x-circle";
import { sortBy } from "lodash";
import Link from "next/link";
import IconPlus from "@/components/icon/icon-plus";

const Supplier = () => {
    const [userDataToken, setUserDataToken] = useState(null);
    const [userData, setUserData] = useState(null);
    const [reloadRecord, setReload] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showAlert, setShowAlert] = useState(null);
    const [selfSecurityError, setSecurityError] = useState(
        "An error occurred. Please try again."
    );
    const [showUserForm, setUserForm] = useState(false);
    const [page, setPage] = useState(1);
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);

    const PAGE_SIZES = [10, 2, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(users, 'id'));
    const [totalRecords, setTotalRecords] = useState(0);
    const [recordsData, setRecordsData] = useState(initialRecords);
    const [reloadGrid, setReloadGrid] = useState(false)
    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const result = await getUsers(`page=${page}&limit=${pageSize}`);
                console.log(result)
                if (result && result.data) {
                    setUsers(result.data);
                    setTotalRecords(result.totalCount)
                }
                else {
                    throw new Error("Invalid response structure");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch users");
            }
        };
        fetchUsers();
    }, [page, pageSize, reloadGrid]);

    const onCLickAdd = () => {
        setShowAlert(null);
        setUserForm(!showUserForm)

    };

    const handleRelaod = () => {
        setReload(!reloadRecord);
    };
    const [tabs, setTabs] = useState<string>("Profile");
    const toggleTabs = (name: string) => {
        setTabs(name);
    };
    const schema = yup.object({
        // Personal Information
        name_english: yup.string().required("English name is required"),
        name_arabic: yup.string().required("Arabic name is required"),
        nationality: yup.string().required("Nationality is required"),
        identity_card_no: yup.string().required("Identity card number is required"),
        identity_issued_date: yup
            .string()
            .required("Identity card issued date is required"),
        identity_expiry_date: yup
            .string()
            .required("Identity card expiry date is required"),
        passport_no: yup.string().required("Passport number is required"),
        passport_issued_date: yup
            .string()
            .required("Passport expiry date is required"),
        passport_expiry_date: yup
            .string()
            .required("Passport expiry date is required"),
        driving_license_number: yup
            .string()
            .required("Driving license number is required"),
        driving_licence_issued_date: yup
            .string()
            .required("Driving license issued date is required"),
        driving_license_expiry_date: yup
            .string()
            .required("License expiry date is required"),
        gender: yup.string().required("Gender is required"),
        date_of_birth: yup.string().required("Date of birth is required"),
        place_of_birth: yup.string().required("Place of birth is required"),

        // Contact Information
        mobile: yup.string().required("Mobile number is required"),
        phone: yup.string().required("Phone number is required"),
        unified: yup.string().required("Unified number is required"),
        visit_visa_no: yup.string().required("Unified number is required"),
        phone_primary: yup.string().required("Primary phone number is required"),
        work_phone: yup.string().required("Work phone number is required"),
        phone_secondary: yup
            .string()
            .required("Secondary phone number is required"),
        mother_name: yup.string().required("Mother name is required"),
        profession: yup.string().required("Profession name is required"),
        email_address: yup.string().email("Email is not valid").required("Email address is required"),
        driving_license_issued_by: yup
            .string()
            .required("Driving license issued by is required"),
        home_phone: yup.string().required("Home phone is required"),
        home_address: yup.string().required("Home address is required"),
        work_address: yup.string().required("Work address is required"),
        postal_address: yup.string().required("Postal address is required"),
        p_O_box: yup.string().required("P.O. Box is required"),

        // Profile Information
        profile_category: yup.string().required("Profile category is required"),
        profile_type: yup.string().required("Profile type is required"),
        commercial_license_number: yup
            .string()
            .required("Commercial license number is required"),
        vip: yup.boolean().required("VIP status is required"),
        exclude_from_bulk_sms: yup
            .boolean()
            .required("Bulk SMS preference is required"),
        exclude_from_automated_sms: yup
            .boolean()
            .required("Automated SMS preference is required"),
        tax_treatment: yup.string().required("Tax treatment is required"),
        source_of_supply: yup.string().required("Source of supply is required"),
    });

    const {
        register,
        reset,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const onDrop = useCallback((acceptedFiles) => {
        console.log("Accepted files:", acceptedFiles);
        // You can handle the files here, e.g., upload them to a server or process them.
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            "image/*": [], // Use an object for MIME types
        },
        multiple: true,
    });
    const handleProfileUpdate = async (formData) => {
        setLoading(true);
        try {
            const result = await updateUserProfile(userDataToken?.sub, formData);
            if (result) {
                setShowAlert("success");
                setTimeout(() => setShowAlert(null), 3000);
                handleRelaod();
            }
        } catch (error) {
            console.log(error);
            setShowAlert("error");
            setTimeout(() => setShowAlert(null), 3000);
        } finally {
            setLoading(false);
        }
    };
    const handleSecurityUpdate = async (formData) => {
        setLoading(true);
        try {
            const result = await updateUserSecurity(userDataToken?.sub, formData);
            if (result.status == 400) {
                setShowAlert("error");
                setSecurityError("Current password does not match");
                setTimeout(() => setShowAlert(null), 3000);
            } else {
                setShowAlert("success");
                setTimeout(() => setShowAlert(null), 3000);
            }
        } catch (error) {
            console.log(error);
            setShowAlert("error");
            setTimeout(() => setShowAlert(null), 3000);
        } finally {
            setLoading(false);
        }
    };
    return (
        <div className="pt-5">
            {/* ============================================================== ALERTS ============================================================== */}
            {!showUserForm ? (
                <>
                    <div>
                        <div className="mb-6 flex flex-wrap items-center justify-center gap-4 lg:justify-end">
                            {/* <button type="button" className="btn btn-info gap-2">
                <IconSend />
                Send Invoice
              </button>

              <button type="button" className="btn btn-primary gap-2">
                <IconPrinter />
                Print
              </button>

              <button type="button" className="btn btn-success gap-2">
                <IconDownload />
                Download
              </button> */}

                            <Link href="#" onClick={onCLickAdd} className="btn btn-primary gap-2">
                                <IconPlus />
                                Create
                            </Link>

                            {/* <Link href="/apps/invoice/edit" className="btn btn-warning gap-2">
                <IconEdit />
                Edit
              </Link> */}
                        </div>
                        <div className="panel">

                            <div className="table-responsive mt-6">
                                <DataTable<any>
                                    noRecordsText="No results match your search query"
                                    highlightOnHover
                                    className="table-hover whitespace-nowrap"
                                    records={users}
                                    columns={[
                                        {
                                            accessor: "id",
                                            title: "ID",
                                            sortable: true,
                                            render: ({ id }) => (
                                                <strong className="text-info pointer-cursor">
                                                    #{id}
                                                </strong>
                                            ),
                                        },
                                        {
                                            accessor: "first_name",
                                            title: "User",
                                            sortable: true,
                                            render: ({ first_name }) => (
                                                <div className="flex items-center gap-2">
                                                    <div className="font-semibold">{first_name}</div>
                                                </div>
                                            ),
                                        },

                                        {
                                            accessor: "email",
                                            title: "Email",
                                            sortable: true,
                                            render: ({ email }) => (
                                                <a
                                                    href={`mailto:${email}`}
                                                    className="text-primary hover:underline"
                                                >
                                                    {email}
                                                </a>
                                            ),
                                        },
                                        {
                                            accessor: "branch",
                                            sortable: true,
                                            title: "Current branch",
                                            render: ({ branch }) => (
                                                <div className="flex items-center gap-2">
                                                    <span>{branch?.name}</span>
                                                </div>
                                            ),
                                        },
                                        {
                                            accessor: "inactivity_status",
                                            title: "Status",
                                            sortable: true,
                                            render: ({ inactivity_status }) => (
                                                <span
                                                    className={`badge bg-${!inactivity_status ? "success" : "danger"} rounded-full`}
                                                >
                                                    {inactivity_status ? "In active" : "Active"}
                                                </span>
                                            ),
                                        },

                                    ]}
                                    totalRecords={initialRecords.length}
                                    recordsPerPage={pageSize}
                                    page={page}
                                    onPageChange={(p) => setPage(p)}
                                    recordsPerPageOptions={PAGE_SIZES}
                                    onRecordsPerPageChange={setPageSize}
                                    sortStatus={sortStatus}
                                    // onSortStatusChange={setSortStatus}
                                    minHeight={200}
                                    paginationText={({ from, to, totalRecords }) =>
                                        `Showing  ${from} to ${to} of ${totalRecords} entries`
                                    }
                                />

                            </div>

                        </div>
                    </div>
                </>

            ) : (<>
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
                                {showAlert.charAt(0).toUpperCase() + showAlert.slice(1)}!
                            </strong>
                            {showAlert === "success" && "EMPLOYEE registered successfully."}
                            {showAlert === "error" && selfSecurityError}
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

                <>
                    {/* ============================================================== EMPLOYEE FORM ============================================================== */}

                    <div>
                        <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                            <h6 className="mb-5 text-lg font-bold">Add new supplier</h6>
                            <div className="flex flex-col sm:flex-row">
                                {/* EMPLOYEE NAME IN ENGLISH */}
                                <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 p-4 bg-yellow-50 dark:border-[#191e3a] dark:bg-black">
                                    <div>
                                        <label htmlFor="name">Business Name (English)</label>
                                        <div className="relative">
                                            <input
                                                id="name"
                                                type="text"
                                                className={`form-input pr-7 ${errors.name_english ? "border-red-500" : ""}`}
                                                placeholder="Business Name (English)"
                                                {...register("name_english")}
                                            />
                                            {errors.name_english && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.name_english && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.name_english.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* EMPLOYEE NAME IN ARABIC */}
                                    <div>
                                        <label htmlFor="name">Business Name (Arabic)</label>
                                        <div className="relative">
                                            <input
                                                id="name"
                                                type="text"
                                                placeholder="Business Name (Arabic)"
                                                className={`form-input pr-7 ${errors.name_arabic ? "border-red-500" : ""}`}
                                                {...register("name_arabic")}
                                            />
                                            {errors.name_arabic && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.name_arabic && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.name_arabic.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* PROFILE TYPE */}

                                    <div>
                                        <label htmlFor="profile_category">Trade License Number</label>
                                        <div className="relative">
                                            <input
                                                id="name"
                                                type="text"
                                                placeholder="Trade License Number"
                                                className={`form-input pr-7 ${errors.name_arabic ? "border-red-500" : ""}`}
                                                {...register("name_arabic")}
                                            />
                                            {errors.profile_type && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.profile_type && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.profile_type.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    {/* NATIONALITY */}
                                    <div>
                                        <label htmlFor="nationality">Country</label>
                                        <div className="relative">
                                            <select
                                                id="nationality"
                                                className={`form-select ${errors.nationality ? "border-red-500" : ""}`}
                                                {...register("nationality")}
                                            >
                                                <option value="">Select Country</option>
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


                                    {/* Email*/}

                                    <div>
                                        <label htmlFor="profession">Email</label>
                                        <div className="relative">
                                            <input
                                                id="profession"
                                                type="text"
                                                className={`form-input pr-7 ${errors.email_address ? "border-red-500" : ""}`}
                                                placeholder="Email"
                                                {...register("profession")}
                                            />
                                            {errors.email_address && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.profession && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.profession.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* HOME PHONE */}

                                    <div>
                                        <label htmlFor="home_phone">Website</label>
                                        <div className="relative">
                                            <input
                                                id="home_phone"
                                                type="text"
                                                className={`form-input pr-7 ${errors.home_phone ? "border-red-500" : ""}`}
                                                placeholder="Website"
                                                {...register("home_phone")}
                                            />
                                            {errors.home_phone && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.home_phone && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.home_phone.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* IDENTITY CARD NUMBER */}
                                    <div>
                                        <label htmlFor="identity_card_no">Fax</label>
                                        <div className="relative">
                                            <input
                                                id="identity_card_no"
                                                type="text"
                                                placeholder="Fax"
                                                className={`form-input pr-7 ${errors.identity_card_no ? "border-red-500" : ""}`}
                                                {...register("identity_card_no")}
                                            />
                                            {errors.identity_card_no && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.identity_card_no && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.identity_card_no.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* IDENTITY CARD ISSUED DATE */}

                                    <div>
                                        <label htmlFor="identity_issued_date">
                                            P.O. Box
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="identity_issued_date"
                                                type="date"
                                                placeholder="P.O. Box"
                                                className={`form-input pr-7 ${errors.identity_issued_date ? "border-red-500" : ""}`}
                                                {...register("identity_issued_date")}
                                            />
                                            {errors.identity_issued_date && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.identity_issued_date && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.identity_issued_date.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* IDENTITY CARD EXPIRY DATE */}

                                    <div>
                                        <label htmlFor="identity_expiry_date">
                                            Address
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="identity_issued_date"
                                                type="text"
                                                placeholder="Address"
                                                className={`form-input pr-7 ${errors.identity_expiry_date ? "border-red-500" : ""}`}
                                                {...register("identity_expiry_date")}
                                            />
                                            {errors.identity_expiry_date && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.identity_expiry_date && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.identity_expiry_date.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* MOBILE NUMBER */}

                                    <div>
                                        <label htmlFor="mobile">Category</label>
                                        <div className="relative">
                                            <input
                                                id="mobile"
                                                type="category"
                                                placeholder="Category"
                                                className={`form-input pr-7 ${errors.mobile ? "border-red-500" : ""}`}
                                                {...register("mobile")}
                                            />
                                            {errors.mobile && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.mobile && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.mobile.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* MOBILE NUMBER */}

                                    <div>
                                        <label htmlFor="phone">Name (English)</label>
                                        <div className="relative">
                                            <input
                                                id="phone"
                                                type="tel"
                                                placeholder="+1 (530) 555-1212"
                                                className={`form-input pr-7 ${errors.phone ? "border-red-500" : ""}`}
                                                {...register("phone")}
                                            />
                                            {errors.phone && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.phone && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.phone.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* UNIFIED NUMBER */}

                                    <div>
                                        <label htmlFor="unified">Name (Arabic)</label>
                                        <div className="relative">
                                            <input
                                                id="unified"
                                                type="tel"
                                                placeholder="+1 (530) 555-1212"
                                                className={`form-input pr-7 ${errors.unified ? "border-red-500" : ""}`}
                                                {...register("unified")}
                                            />
                                            {errors.unified && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.unified && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.unified.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* VISIT VISA NUMBER */}

                                    <div>
                                        <label htmlFor="visit_visa_no">Mobile</label>
                                        <div className="relative">
                                            <input
                                                id="visit_visa_no"
                                                type="tel"
                                                placeholder="+1 (530) 555-1212"
                                                className={`form-input pr-7 ${errors.visit_visa_no ? "border-red-500" : ""}`}
                                                {...register("visit_visa_no")}
                                            />
                                            {errors.visit_visa_no && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.visit_visa_no && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.visit_visa_no.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* DATE OF BIRTH */}

                                    <div>
                                        <label htmlFor="date_of_birth">Email</label>
                                        <div className="relative">
                                            <input
                                                id="date_of_birth"
                                                type="text"
                                                placeholder="Passport Number"
                                                className={`form-input pr-7 ${errors.date_of_birth ? "border-red-500" : ""}`}
                                                {...register("date_of_birth")}
                                            />
                                            {errors.date_of_birth && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.date_of_birth && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.date_of_birth.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* PLACE OF BIRTH */}

                                    <div>
                                        <label htmlFor="place_of_birth">Job Title</label>
                                        <div className="relative">
                                            <input
                                                id="place_of_birth"
                                                type="text"
                                                placeholder="Passport Number"
                                                className={`form-input pr-7 ${errors.place_of_birth ? "border-red-500" : ""}`}
                                                {...register("place_of_birth")}
                                            />
                                            {errors.place_of_birth && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.place_of_birth && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.place_of_birth.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* =================================== DOCUMENT INFORMATION  =================================== */}

                                    {/* PASSPORT NUMBER */}

                                    <div>
                                        <label htmlFor="passport_no">Tax Treatment</label>
                                        <div className="relative">
                                            <input
                                                id="passport_no"
                                                type="text"
                                                placeholder="Passport Number"
                                                className={`form-input pr-7 ${errors.passport_no ? "border-red-500" : ""}`}
                                                {...register("passport_no")}
                                            />
                                            {errors.passport_no && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.passport_no && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.passport_no.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* PASSPORT ISSUED DATE */}

                                    <div>
                                        <label htmlFor="passport_issued_date">
                                            Source of supply*
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="passport_issued_date"
                                                type="date"
                                                className={`form-input pr-7 ${errors.passport_expiry_date ? "border-red-500" : ""}`}
                                                {...register("passport_issued_date")}
                                            />
                                            {errors.passport_issued_date && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.passport_issued_date && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.passport_issued_date.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>




                                    {/* SAVE BUTTON */}
                                </div>
                            </div>
                            <h6 className="mb-5 mt-4 text-lg font-bold">Primary contact</h6>
                            <div className="flex flex-col sm:flex-row">
                                {/* EMPLOYEE NAME IN ENGLISH */}
                                <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 p-4 bg-yellow-50 dark:border-[#191e3a] dark:bg-black">

                                    <div>
                                        <label htmlFor="phone">Name (English)</label>
                                        <div className="relative">
                                            <input
                                                id="phone"
                                                type="tel"
                                                placeholder="+1 (530) 555-1212"
                                                className={`form-input pr-7 ${errors.phone ? "border-red-500" : ""}`}
                                                {...register("phone")}
                                            />
                                            {errors.phone && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.phone && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.phone.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* UNIFIED NUMBER */}

                                    <div>
                                        <label htmlFor="unified">Name (Arabic)</label>
                                        <div className="relative">
                                            <input
                                                id="unified"
                                                type="tel"
                                                placeholder="+1 (530) 555-1212"
                                                className={`form-input pr-7 ${errors.unified ? "border-red-500" : ""}`}
                                                {...register("unified")}
                                            />
                                            {errors.unified && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.unified && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.unified.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* VISIT VISA NUMBER */}

                                    <div>
                                        <label htmlFor="visit_visa_no">Mobile</label>
                                        <div className="relative">
                                            <input
                                                id="visit_visa_no"
                                                type="tel"
                                                placeholder="+1 (530) 555-1212"
                                                className={`form-input pr-7 ${errors.visit_visa_no ? "border-red-500" : ""}`}
                                                {...register("visit_visa_no")}
                                            />
                                            {errors.visit_visa_no && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.visit_visa_no && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.visit_visa_no.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* DATE OF BIRTH */}

                                    <div>
                                        <label htmlFor="date_of_birth">Email</label>
                                        <div className="relative">
                                            <input
                                                id="date_of_birth"
                                                type="text"
                                                placeholder="Passport Number"
                                                className={`form-input pr-7 ${errors.date_of_birth ? "border-red-500" : ""}`}
                                                {...register("date_of_birth")}
                                            />
                                            {errors.date_of_birth && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.date_of_birth && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.date_of_birth.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* PLACE OF BIRTH */}

                                    <div>
                                        <label htmlFor="place_of_birth">Job Title</label>
                                        <div className="relative">
                                            <input
                                                id="place_of_birth"
                                                type="text"
                                                placeholder="Passport Number"
                                                className={`form-input pr-7 ${errors.place_of_birth ? "border-red-500" : ""}`}
                                                {...register("place_of_birth")}
                                            />
                                            {errors.place_of_birth && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.place_of_birth && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.place_of_birth.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* =================================== DOCUMENT INFORMATION  =================================== */}

                                    {/* PASSPORT NUMBER */}



                                    {/* PASSPORT ISSUED DATE */}



                                    {/* SAVE BUTTON */}
                                </div>
                            </div>
                            <h6 className="mb-5 mt-4 text-lg font-bold">Tax Settings</h6>
                            <div className="flex flex-col sm:flex-row">
                                {/* EMPLOYEE NAME IN ENGLISH */}
                                <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 p-4 bg-yellow-50 dark:border-[#191e3a] dark:bg-black">
                                    <div>
                                        <label htmlFor="passport_no">Tax Treatment</label>
                                        <div className="relative">
                                            <input
                                                id="passport_no"
                                                type="text"
                                                placeholder="Passport Number"
                                                className={`form-input pr-7 ${errors.passport_no ? "border-red-500" : ""}`}
                                                {...register("passport_no")}
                                            />
                                            {errors.passport_no && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.passport_no && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.passport_no.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    {/* PASSPORT ISSUED DATE */}

                                    <div>
                                        <label htmlFor="passport_issued_date">
                                            Source of supply*
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="passport_issued_date"
                                                type="date"
                                                className={`form-input pr-7 ${errors.passport_expiry_date ? "border-red-500" : ""}`}
                                                {...register("passport_issued_date")}
                                            />
                                            {errors.passport_issued_date && (
                                                <FaExclamationCircle
                                                    className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                    style={{ fontSize: "calc(1em + 5px)" }}
                                                />
                                            )}
                                        </div>
                                        {errors.passport_issued_date && (
                                            <div className="mt-2">
                                                <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                    {errors.passport_issued_date.message}
                                                </span>
                                            </div>
                                        )}
                                    </div>




                                    {/* SAVE BUTTON */}

                                </div>

                            </div>
                            <div className="mt-3 mb-3 mr-3 flex justify-end sm:col-span-2">
                                <button
                                    type="button"
                                    onClick={onCLickAdd}
                                    className="btn btn-danger ltr:mr-3 rtl:ml-3  rounded-full"
                                >
                                    <IconXCircle className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-success ltr:mr-3 rtl:ml-3 rounded-full"
                                    onClick={handleSubmit(handleProfileUpdate)}
                                >
                                    <>
                                        <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                        Save
                                    </>
                                </button>
                            </div>
                        </form>
                    </div>
                </>


            </>)}


        </div>
    );
};

export default Supplier;
