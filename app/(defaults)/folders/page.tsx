"use client";
import IconPlus from "@/components/icon/icon-plus";
import IconSave from "@/components/icon/icon-save";
import IconXCircle from "@/components/icon/icon-x-circle";
import {
  deleteFolder,
  getFolder,
  saveFolder,
  updateFolder,
} from "@/services/folders";
import { sortData, toISO } from "@/utils/sortingHelper";
import { yupResolver } from "@hookform/resolvers/yup";
import { jwtDecode } from "jwt-decode";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import Link from "next/link";
import { useState, useCallback, useEffect, useMemo } from "react";
import { useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { FaEdit, FaExclamationCircle, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import * as yup from "yup";
import { format } from "date-fns";
import {
  ActionIcon,
  TextInput,
} from "@mantine/core";

const ComponentsUsersAccountSettingsTabs = () => {
  // ======================= A: STATE MANAGEMENT =========================

  // 1. REACT HOOKS FOR GLOBAL AND LOCAL STATE
  const [folders, setFolders] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [reloadRecord, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  // Change the state to handle both type and message
  const [alert, setAlert] = useState({ type: null, message: null });
  const [showUpdateForm, setUpdateForm] = useState(false);
  const [page, setPage] = useState(1);
  const [updateId, setUpdateId] = useState(null);
  const [error, setError] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  // ======================= B: CONSTANTS AND CONFIGURATIONS =========================
  const PAGE_SIZES = [10, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortDataTable, setsortDataTable] = useState(null);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction: "asc",
  });
  const [filters, setFilters] = useState({
    id: null,
    company_name: "",
    comercial_license_no: "",
    // Nationality: "",
    // date_of_birth: "",
    phone_primary: "",
    phone_secondary: "",
    email_address: "",
    // passport_no: "",
    // id_card_no: "",
    work_address: "",
  });

  // ======================= C: VALIDATION SCHEMA (YUP) =========================

  const schema = yup.object({
    // Personal Information
    company_name: yup.string().required("Company name is required"),
    comercial_license_no: yup
      .string()
      .required("Commercial license number is required"),
    phone_primary: yup.string().required("Primary phone number is required"),
    phone_secondary: yup
      .string()
      .required("Secondary phone number is required"),
    email_address: yup.string().required("Email address is required"),
    work_address: yup.string().required("Work address is required"),
  });

  // ======================= D: CUSTOM HOOKS AND DROPZONE =========================
  // 1. FILE UPLOAD HANDLER USING REACT-DROPZONE
  const onDrop = useCallback((acceptedFiles) => {
    console.log("Accepted files:", acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  // ======================= E: USE EFFECTS =========================

  // 1. FETCH FOLDERS
  useEffect(() => {
    const fetchFolders = async () => {
      setLoading(true);
      try {
        // Create query params properly
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
          sortField: sortStatus.columnAccessor,
          sortOrder: sortStatus.direction,
          filter: JSON.stringify(filters),
        }).toString();

        const result = await getFolder(queryParams);
        if (result?.data?.records) {
          setFolders(result.data.records);
          setTotalRecords(result.data.totalCount);
        } else {
          setFolders([]);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch orders");
        setFolders([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, [page, pageSize, reloadRecord, sortStatus, filters]);

  // ======================= F: EVENT HANDLERS =========================

  // 1. TOGGLE USER FORM VISIBILITY
  const onCLickAdd = () => {
    setIsEditMode(false);
    setAlert(null);
    setUpdateForm(!showUpdateForm);
    reset();
  };

  // 2. FORM SUBMISSION HANDLER
  const handleFolderSubmit = async (formData) => {
    setIsEditMode(false); // Reset edit mode
    setLoading(true);
    setLoadingForm(true);
    reset();
    try {
      const userToken = localStorage.getItem("user");
      const decodedData = jwtDecode(userToken);
      // Map the form data to match your backend DTO
      const companyData = {
        userId: decodedData?.sub,
        company_name: formData.company_name,
        comercial_license_no: formData.comercial_license_no,
        phone_primary: formData.phone_primary,
        phone_secondary: formData.phone_secondary,
        email_address: formData.email_address,
        work_address: formData.work_address,
      };

      let result;
      if (updateId) {
        result = await updateFolder(updateId, companyData);
        setAlert({
          type: "success",
          message: "Company updated successfully.",
        });
      } else {
        result = await saveFolder(companyData);
        setAlert({
          type: "success",
          message: "Company registered successfully.",
        });
      }

      if (result) {
        // setAlert("success");
        reset();
        setUpdateForm(false);
        setUpdateId(null);
        setIsEditMode(false); // Reset edit mode
        handleReload();
      }
    } catch (error) {
      console.error("Save/Update customer error:", error);
      // setAlert("error");
    } finally {
      setLoading(false);
      setLoadingForm(false);
    }
  };

  // 3. DELETE HANDLER
  const handleDelete = async (userId) => {
    try {
      const response = await deleteFolder(userId);
      if (response) {
        handleReload(); // Wait for reload to complete
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  };

  // ======================= G: UTILITIES AND MISC =========================

  // 1. RELOAD GRID DATA
  const handleReload = () => {
    setReload(!reloadRecord);
  };

  // 3. Use dataMap in sortedData
  const sortedData = useMemo(() => {
    return sortData(folders, sortStatus, null);
  }, [folders, sortStatus]); // Note: changed dependencies

  // Auto-dismiss logic
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null); // Dismiss the alert after 3 seconds
      }, 3000);

      // Cleanup the timeout if the component unmounts or showAlert changes
      return () => clearTimeout(timer);
    }
  }, [alert]);
  // ======================= H: FORM CONFIGURATION =========================

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  const handleUpdateFormOpen = (id: number) => {
    const foldersData = folders.find((folder) => folder.id === id);
    if (!foldersData) {
      setAlert({
        type: "error",
        message: "Company data not found.",
      });
      return;
    }
    setIsEditMode(true);
    // reset();

    setValue("company_name", foldersData.company_name);
    setValue("comercial_license_no", foldersData.comercial_license_no);
    setValue("phone_primary", foldersData.phone_primary);
    setValue("phone_secondary", foldersData.phone_secondary);
    setValue("email_address", foldersData.email_address);
    setValue("work_address", foldersData.work_address);

    // setAlert({
    //   type: "info",
    //   message: "Now editing company information.",
    // });
    setUpdateForm(true);
    setUpdateId(id);
  };
  const showAlertSwal = async (type: number, id: number) => {
    if (type === 10) {
      Swal.fire({
        icon: "warning",
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        showCancelButton: true,
        confirmButtonText: "Delete",
        padding: "2em",
        customClass: {
          popup: "sweet-alerts", // Assigning the correct class to the `popup` property
        },
      }).then((result) => {
        if (result.isConfirmed) {
          // Use `isConfirmed` for newer versions of SweetAlert2
          handleDelete(id).then((res) => {
            if (res !== false) {
              Swal.fire({
                title: "Deleted!",
                text: "Your file has been deleted.",
                icon: "success",
                customClass: {
                  popup: "sweet-alerts",
                },
              });
            } else {
              Swal.fire({
                title: "Error",
                text: "Something went wrong. Try later",
                icon: "error",
                customClass: {
                  popup: "sweet-alerts",
                },
              });
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1); // Reset to the first page on filter change
  };

  return (
    <div className="pt-5">
      {!showUpdateForm && (
        <>
          {alert?.type && (
            <div
              className={`flex items-center ml-[500px] mb-4 mr-[500px] p-3.5 rounded text-white ${
                alert.type === "success"
                  ? "bg-green-500"
                  : alert.type === "error"
                    ? "bg-red-500"
                    : alert.type === "info"
                      ? "bg-blue-500"
                      : "bg-yellow-500"
              }`}
            >
              <span className="text-white w-6 h-6 ltr:mr-4 rtl:ml-4">
                <svg>...</svg>
              </span>
              <span>
                <strong className="ltr:mr-1 rtl:ml-1">
                  {alert.type.charAt(0).toUpperCase() + alert.type.slice(1)}!
                </strong>
                {alert.message}
              </span>
              <button
                type="button"
                onClick={() => setAlert({ type: null, message: null })}
                className="ltr:ml-auto rtl:mr-auto btn btn-sm bg-white text-black"
              >
                Dismiss
              </button>
            </div>
          )}

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

              <Link
                href="#"
                onClick={onCLickAdd}
                className="btn btn-primary gap-2"
              >
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
                  records={sortedData || []}
                  columns={[
                    {
                      accessor: "id",
                      title: "Action",

                      render: ({ id }) => (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleUpdateFormOpen(id)}
                            className="p-1 text-blue-600 hover:bg-blue-100 rounded-full"
                          >
                            <FaEdit className="w-5 h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              showAlertSwal(10, id);
                            }}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                          >
                            <FaTrash className="w-5 h-5" />
                          </button>
                        </div>
                      ),
                    },
                    {
                      accessor: "id",
                      title: "ID",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search id..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("id", "")}
                            ></ActionIcon>
                          }
                          value={filters?.id || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "id",
                              Number(e.currentTarget.value)
                            )
                          }
                        />
                      ),

                      render: ({ id }) => (
                        <strong className="text-info pointer-cursor">
                          {id}
                        </strong>
                      ),
                    },
                    {
                      accessor: "company_name",
                      title: "Company Name",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search companyname..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() =>
                                handleFilterChange("company_name", "")
                              }
                            ></ActionIcon>
                          }
                          value={filters?.company_name || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "company_name",
                              e.currentTarget.value
                            )
                          }
                        />
                      ),
                    },
                    {
                      accessor: "comercial_license_no",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search comercial license no..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() =>
                                handleFilterChange("comercial_license_no", "")
                              }
                            ></ActionIcon>
                          }
                          value={filters?.comercial_license_no || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "comercial_license_no",
                              e.currentTarget.value
                            )
                          }
                        />
                      ),

                      title: "Commercial License No",
                    },
                   

                    {
                      accessor: "phone_primary",
                      title: "Primary Phone No.",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search phone primary..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() =>
                                handleFilterChange("phone_primary", "")
                              }
                            ></ActionIcon>
                          }
                          value={filters?.phone_primary || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "phone_primary",
                              e.currentTarget.value
                            )
                          }
                        />
                      ),
                    },

                   
                    {
                      accessor: "email_address",
                      title: "Email",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search email address..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() =>
                                handleFilterChange("email_address", "")
                              }
                            ></ActionIcon>
                          }
                          value={filters?.email_address || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "email_address",
                              e.currentTarget.value
                            )
                          }
                        />
                      ),
                    },
                                     
                    {
                      accessor: "work_address",
                      title: "Work Address",
                      sortable: true,
                      filter: (
                        <TextInput
                          label="Id"
                          placeholder="Search Work address..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() =>
                                handleFilterChange("work_address", "")
                              }
                            ></ActionIcon>
                          }
                          value={filters?.work_address || ""}
                          onChange={(e) =>
                            handleFilterChange(
                              "work_address",
                              e.currentTarget.value
                            )
                          }
                        />
                      ),
                    },
                  ]}
                  totalRecords={totalRecords}
                  recordsPerPage={pageSize}
                  page={page}
                  onPageChange={(p) => setPage(p)}
                  recordsPerPageOptions={PAGE_SIZES}
                  onRecordsPerPageChange={setPageSize}
                  sortStatus={sortStatus}
                  onSortStatusChange={setSortStatus}
                  minHeight={200}
                  paginationText={({ from, to, totalRecords }) =>
                    `Showing  ${from} to ${to} of ${totalRecords} entries`
                  }
                />
              </div>
            </div>
          </div>
        </>
      )}

      {showUpdateForm && (
        <>
          <>
            {/* ============================================================== COMPANY FORM ============================================================== */}

            <div>
              <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                <h6 className="mb-5 text-lg font-bold">
                  {isEditMode ? "UPDATE COMPANY" : "ADD NEW COMPANY"}
                </h6>
                {/* =================================== A- PERSONAL INFORMATION =================================== */}

                <div className="flex flex-col sm:flex-row">
                  <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4 ">
                    <img
                      src="/assets//images/profile-34.jpeg"
                      alt="img"
                      className="mx-auto h-20 w-20 rounded-full object-cover md:h-32 md:w-32"
                    />
                  </div>

                  {/* COMPANY NAME IN ENGLISH */}
                  <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 p-4 bg-yellow-50 dark:border-[#191e3a] dark:bg-black">
                    <div>
                      <label htmlFor="company_name">Company Name *</label>
                      <div className="relative">
                        <input
                          id="company_name"
                          type="text"
                          className={`form-input pr-7 ${errors.company_name ? "border-red-500" : ""}`}
                          placeholder="Name"
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
                            {errors.company_name.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* COMMERCIAL LICENSE NO. */}
                    <div>
                      <label htmlFor="comercial_license_no">
                        Commercial License No. *
                      </label>
                      <div className="relative">
                        <input
                          id="comercial_license_no"
                          type="text"
                          placeholder="Commercial license number"
                          className={`form-input pr-7 ${errors.comercial_license_no ? "border-red-500" : ""}`}
                          {...register("comercial_license_no")}
                        />
                        {errors.comercial_license_no && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.comercial_license_no && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.comercial_license_no.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PRIMARY PHONE NUMBER */}

                    <div>
                      <label htmlFor="phone_primary">
                        Primary Phone Number
                      </label>
                      <div className="relative">
                        <input
                          id="phone_primary"
                          type="tel"
                          placeholder="+1 (530) 555-1212"
                          className={`form-input pr-7 ${errors.phone_primary ? "border-red-500" : ""}`}
                          {...register("phone_primary")}
                        />
                        {errors.phone_primary && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.phone_primary && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.phone_primary.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* SECONDARY PHONE NUMBER */}

                    <div>
                      <label htmlFor="phone_secondary">
                        Secondary Phone Number
                      </label>
                      <div className="relative">
                        <input
                          id="phone_secondary"
                          type="tel"
                          placeholder="+1 (530) 555-1212"
                          className={`form-input pr-7 ${errors.phone_secondary ? "border-red-500" : ""}`}
                          {...register("phone_secondary")}
                        />
                        {errors.phone_secondary && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.phone_secondary && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.phone_secondary.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* EMAIL ADDRESS */}

                    <div>
                      <label htmlFor="email_address">Email Address</label>
                      <div className="relative">
                        <input
                          id="email_address"
                          type="email"
                          className={`form-input pr-7 ${errors.email_address ? "border-red-500" : ""}`}
                          placeholder="Enter your email address"
                          {...register("email_address")}
                        />
                        {errors.email_address && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.email_address && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.email_address.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* WORK ADDRESS */}

                    <div>
                      <label htmlFor="work_address">Work Address</label>
                      <div className="relative">
                        <input
                          id="work_address"
                          type="text"
                          className={`form-input pr-7 ${errors.work_address ? "border-red-500" : ""}`}
                          placeholder="Enter your work address"
                          {...register("work_address")}
                        />
                        {errors.work_address && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.work_address && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.work_address.message}
                          </span>
                        </div>
                      )}
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
                        onClick={handleSubmit(handleFolderSubmit)}
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
        </>
      )}
    </div>
  );
};

export default ComponentsUsersAccountSettingsTabs;
