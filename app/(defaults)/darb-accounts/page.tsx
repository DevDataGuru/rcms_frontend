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

const DarbAccount = () => {
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
            setLoading(true);
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
        email_address: yup.string().required("Email address is required"),
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

                            <Link href="#" onClick={onCLickAdd} className="btn btn-primary gap-2">
                                <IconPlus />
                                Add new
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
                                            title: "Username",
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
                                            title: "Traffic file",
                                            render: ({ branch }) => (
                                                <div className="flex items-center gap-2">
                                                    <span>{branch?.name}</span>
                                                </div>
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
                            <h6 className="mb-5 text-lg font-bold">Add new Abu Dhabi toll acount</h6>

                            {/* =================================== PERSONAL INFORMATION =================================== */}

                            <div className="flex flex-col sm:flex-row">
                                {/* EMPLOYEE NAME IN ENGLISH */}
                                <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4 ">
                                </div>
                                <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 p-4 bg-yellow-50 dark:border-[#191e3a] dark:bg-black">
                                    <div>
                                        <label htmlFor="name">Name</label>
                                        <div className="relative">
                                            <input
                                                id="name"
                                                type="date"
                                                className={`form-input pr-7 ${errors.name_english ? "border-red-500" : ""}`}
                                                placeholder="Name"
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

                                    <div>
                                        <label htmlFor="name">Username</label>
                                        <div className="relative">
                                            <input
                                                id="name"
                                                type="date"
                                                className={`form-input pr-7 ${errors.name_english ? "border-red-500" : ""}`}
                                                placeholder="Username"
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



                                    <div>
                                        <label htmlFor="name">Password</label>
                                        <div className="relative">
                                            <input
                                                id="name"
                                                type="password"
                                                className={`form-input pr-7 ${errors.name_english ? "border-red-500" : ""}`}
                                                placeholder="Password"
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

                                    <div>
                                        <label htmlFor="name">Traffic File
                                        </label>
                                        <div className="relative">
                                            <input
                                                id="name"
                                                type="text"
                                                className={`form-input pr-7 ${errors.name_english ? "border-red-500" : ""}`}
                                                placeholder="Traffic File"
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


                                    {/* SAVE BUTTON */}
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
                                </div>
                            </div>
                        </form>
                    </div>
                </>


            </>)}


        </div>
    );
};

export default DarbAccount;
