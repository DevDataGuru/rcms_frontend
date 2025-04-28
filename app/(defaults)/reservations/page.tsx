"use client";
import IconPlus from "@/components/icon/icon-plus";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import IconXCircle from "@/components/icon/icon-x-circle";
import IconSave from "@/components/icon/icon-save";
import * as yup from "yup";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { FaEdit, FaExclamationCircle, FaTrash } from "react-icons/fa";
import ButtonLoader from "@/components/button-loader";
import { useDropzone } from "react-dropzone";
import { getBranches } from "@/services/branchService";
import { getFolder } from "@/services/folders";
import { getVehicles } from "@/services/vehicles";
import { getCustomers } from "@/services/customers";
import {
  deleteVehicleReservations,
  getVehicleReservations,
  saveVehicleReservation,
  updateVehicleReservation,
} from "@/services/vehicle-reservations";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import IconSend from "@/components/icon/icon-send";
import IconPrinter from "@/components/icon/icon-printer";
import IconDownload from "@/components/icon/icon-download";
import { getVehiclePlateSources } from "@/services/commonService";
import { sortData, toISO } from "@/utils/sortingHelper";
import { format } from "date-fns";

const Reservations = () => {
  // ======================= A: STATE MANAGEMENT =========================

  // 1. REACT HOOKS FOR GLOBAL AND LOCAL STATE
  const [vehicleReservations, setVehicleReservations] = useState([]);
  const [vehiclePlateSource, setVehiclePlateSource] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [reloadRecord, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction: "asc",
  });

  // ======================= C: VALIDATION SCHEMA (YUP) =========================
  const schema = yup.object({
    branch_Id: yup.string().required("Branch name is required"),
    company_Id: yup.string().required("Company name is required"),
    vehicle_Id: yup.string().required("Vehicle is Required"),
    customer_id: yup.string(),
    plate_source_id: yup.string().required("Source name is required"),
    mobile: yup.string().required("Mobile number is required"),
    email: yup.string().required("Email is required"),
    pickup_location: yup.string().required("Pickup location is required"),
    pick_up_date: yup.string().required("Pickup date is required"),
    return_location: yup.string().required("Return location is required"),
    return_date: yup.string().required("Return date is required"),
    rate: yup.string().required("Rate is required"),
    acriss_car_code: yup.string().required("Acriss Car Code is required"),
    vehicle_category: yup.string().required("Vehicle category is required"),
    reservations_status: yup.string(),
    reference: yup.string().required("Reference is required"),
    special_notes: yup.string(),
    date: yup.string().required("Date is required"),
    attached_file: yup.string().required("Attached file is required"),
    nRef: yup.string().required("nRef is required"),
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

  // 1. FETCH BRANCHES
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
        }).toString();
        const result = await getBranches();

        if (result?.data?.records) {
          setBranches(result.data.records);
          setTotalRecords(result.data.totalCount);
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    fetchBranches();
  }, [page, pageSize, reloadRecord]);

  // 2. FETCH COMPANIES
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
        }).toString();
        const result = await getFolder(queryParams);
        if (result?.data?.records) {
          setCompanies(result.data.records);
          setTotalRecords(result.data.totalCount);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };
    fetchCompanies();
  }, [page, pageSize, reloadRecord]);

  // 3. FETCH VEHICLES
  useEffect(() => {
    const fetchVehicles = async () => {
      try {
        // Create query params properly
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
        }).toString();

        const result = await getVehicles(queryParams);
        if (result?.data?.records) {
          setVehicles(result.data.records); // Access the records array'
          setTotalRecords(result.data.totalCount);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        setError("Failed to fetch orders");
        setVehicles([]);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicles();
  }, [page, pageSize, reloadRecord]);

  // 4. FETCH CUSTOMERS
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        // Create query params properly
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
        }).toString();

        const result = await getCustomers(queryParams);
        if (result?.data?.records) {
          setCustomers(result.data.records);
          setTotalRecords(result.data.totalCount);
        } else {
          setCustomers([]);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch customers");
        setCustomers([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };
    fetchCustomers();
  }, [page, pageSize, reloadRecord]);

  // 5. VEHCILE PLATE SOURCE
  useEffect(() => {
    const fetchVehiclePlateSource = async () => {
      try {
        // Create query params properly
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
        }).toString();
        const result = await getVehiclePlateSources(queryParams);
        console.log("data", { result });
        // return result;
        if (result?.data?.records) {
          setVehiclePlateSource(result.data.records);
          setTotalRecords(result.data.totalCount);
        }
      } catch (error) {
        console.error("Error fetching vehicle plate sources:", error);
        setVehiclePlateSource([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };
    fetchVehiclePlateSource();
  }, [page, pageSize, reloadRecord]);

  // 6. FETCH RSERVATIONS
  useEffect(() => {
    const fetchVehicleReservations = async () => {
      setLoading(true);
      try {
        // Create query params properly
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
        }).toString();

        const result = await getVehicleReservations(queryParams);
        if (result?.data?.records) {
          setVehicleReservations(result.data.records);
          setTotalRecords(result.data.totalCount);
        } else {
          setVehicleReservations([]);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch customers");
        setVehicleReservations([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };
    fetchVehicleReservations();
  }, [page, pageSize, reloadRecord, sortStatus]);

  // ======================= F: EVENT HANDLERS =========================

  // 1. TOGGLE USER FORM VISIBILITY
  const onCLickAdd = () => {
    setIsEditMode(false);
    setAlert(null);
    setUpdateForm(!showUpdateForm);
    reset();
  };

  // 2. FORM SUBMISSION HANDLER
  const handleSubmitData = async (formData) => {
    setIsEditMode(false); // Reset edit mode
    setLoading(true);
    setLoadingForm(true);
    // reset();
    try {
      const userToken = localStorage.getItem("user");
      const decodedData = jwtDecode(userToken);
      // Map the form data to match your backend DTO
      const reservationData = {
        branch_Id: parseInt(formData.branch_Id),
        company_Id: parseInt(formData.company_Id),
        vehicle_Id: parseInt(formData.vehicle_Id),
        customer_id: parseInt(formData.customer_id),
        plate_source_id: parseInt(formData.plate_source_id), // Correctly map plate_source_id
        mobile: formData.mobile,
        email: formData.email,
        pickup_location: formData.pickup_location,
        pick_up_date: toISO(formData.pick_up_date),
        return_location: formData.return_location,
        return_date: toISO(formData.return_date),
        rate: formData.rate,
        acriss_car_code: formData.acriss_car_code,
        vehicle_category: formData.vehicle_category,
        reservations_status: formData.reservations_status,
        reference: formData.reference,
        special_notes: formData.special_notes,
        date: toISO(formData.date),
        attached_file: formData.attached_file,
        nRef: formData.nRef,
      };

      let result;
      if (updateId) {
        result = await updateVehicleReservation(updateId, reservationData);
        setAlert({
          type: "success",
          message: "Reservation updated successfully.",
        });
      } else {
        result = await saveVehicleReservation(
          reservationData,
          decodedData?.sub
        );
        setAlert({
          type: "success",
          message: "Reservation saved successfully.",
        });
      }

      if (result) {
        // setShowAlert("success");
        reset();
        setUpdateForm(false);
        setUpdateId(null);
        setIsEditMode(false); // Reset edit mode
        handleReload();
      }
    } catch (error) {
      console.error("Save/Update customer error:", error);
      // setShowAlert("error");
    } finally {
      setLoading(false);
      setLoadingForm(false);
    }
  };

  // 3. DELETE HANDLER
  const handleDelete = async (userId) => {
    try {
      const response = await deleteVehicleReservations(userId);
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

  // 2. SORT DATA
  const dataMap = {
    customer_id: customers.map((cst) => ({ id: cst.id, name: cst.full_name })),
    vehicle_Id: vehicles.map((veh) => ({ id: veh.id, name: veh.model })),
    branch_id: branches.map((brh) => ({ id: brh.id, name: brh.name })),
    company_id: companies.map((comp) => ({
      id: comp.id,
      name: comp.company_name,
    })),
    plate_source_id: vehiclePlateSource.map((plt) => ({
      id: plt.id,
      name: plt.plate_source,
    })),
  };

  // Custom hook or useMemo for sorted data
  const sortedData = useMemo(() => {
    return sortData(vehicleReservations, sortStatus, dataMap);
  }, [
    sortStatus,
    vehicleReservations,
    customers,
    vehicles,
    branches,
    companies,
    vehiclePlateSource,
  ]);

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
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleUpdateFormOpen = (id: number) => {
    const reservationData = vehicleReservations.find(
      (reservation) => reservation.id === id
    );
    if (!reservationData) return;
    // console.log()
    setIsEditMode(true);
    reset();

    setValue("branch_Id", reservationData.branch_Id);
    setValue("company_Id", reservationData.company_Id);
    setValue("vehicle_Id", reservationData.vehicle_Id);
    setValue("customer_id", reservationData.customer_id);
    setValue("mobile", reservationData.mobile);
    setValue("email", reservationData.email);
    setValue("pickup_location", reservationData.pickup_location);
    setValue(
      "pick_up_date",
      format(reservationData.pick_up_date, "yyyy-MM-dd")
    );
    setValue("return_location", reservationData.return_location);
    setValue("return_date", format(reservationData.return_date, "yyyy-MM-dd"));
    setValue("rate", reservationData.rate);
    setValue("acriss_car_code", reservationData.acriss_car_code);
    setValue("vehicle_category", reservationData.vehicle_category);
    setValue("reservations_status", reservationData.reservations_status);
    setValue("plate_source_id", reservationData.plate_source_id);
    setValue("reference", reservationData.reference);
    setValue("special_notes", reservationData.special_notes);
    setValue("date", format(reservationData.date, "yyyy-MM-dd"));
    setValue("attached_file", reservationData.attached_file);
    setValue("nRef", reservationData.nRef);

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

  return (
    <div className="pt-5">
      {/* ============================================================== ALERTS ============================================================== */}
      {!showUpdateForm ? (
        <>
          {alert?.type && (
            <div
              className={`flex items-center ml-[500px] mb-4 mr-[500px] p-3.5 rounded text-white ${alert.type === "success"
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
              <button type="button" className="btn btn-info gap-2">
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
              </button>

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
                  records={sortedData || []} // Provide fallback empty array
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
                      render: ({ id }) => (
                        <strong className="text-info pointer-cursor">
                          {id}
                        </strong>
                      ),
                    },
                    {
                      accessor: "customer_id",
                      title: "Customer",
                      sortable: true,
                      render: (row) => {
                        const customer = customers.find(
                          (cst) => cst.id === row.customer_id
                        );
                        return customer?.full_name || "N/A";
                      },
                    },

                    {
                      accessor: "email",
                      title: "Email",
                      sortable: true,
                    },
                    {
                      accessor: "acriss_car_code",
                      sortable: true,
                      title: "Acriss Car Code",
                    },
                    {
                      accessor: "vehicle_Id",
                      sortable: true,
                      title: "Vehicle",
                      render: (row) => {
                        const vehicle = vehicles.find(
                          (veh) => veh.id === row.vehicle_Id
                        );
                        return vehicle?.model || "N/A";
                      },
                    },
                    {
                      accessor: "vehicle_category",
                      title: "Category",
                      sortable: true,
                    },
                    {
                      accessor: "rate",
                      sortable: true,
                      title: "rate",
                    },
                    {
                      accessor: "pickup_location",
                      sortable: true,
                      title: "Pickup location",
                    },
                    {
                      accessor: "return_date",
                      sortable: true,
                      title: "Return date",
                    },

                    {
                      accessor: "return_location",
                      sortable: true,
                      title: "Return Location",
                    },
                    {
                      accessor: "reservations_status",
                      title: "Status",
                      sortable: true,
                      render: ({ reservations_status }) => (
                        <span
                          className={`badge bg-${!reservations_status ? "success" : "danger"} rounded-full`}
                        >
                          {reservations_status ? "In active" : "Active"}
                        </span>
                      ),
                    },
                    {
                      accessor: "vehicle_category",
                      sortable: true,
                      title: "Category",
                    },
                    {
                      accessor: "plate_source_id",
                      title: "Vehicle Plate Source",
                      sortable: true,
                      render: (row) => {
                        // Find the branch name from branches array
                        const source = vehiclePlateSource.find(
                          (vp) => vp.id === row.plate_source_id
                        );
                        return source?.plate_source || "N/A";
                      },
                    },
                    {
                      accessor: "reference",
                      sortable: true,
                      title: "Reference",
                    },
                    {
                      accessor: "date",
                      sortable: true,
                      title: "Reservation Date",
                    },
                    {
                      accessor: "special_notes",
                      sortable: true,
                      title: "Recent note",
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
                  // loading={loading} // Add loading state
                  paginationText={({ from, to, totalRecords }) =>
                    `Showing ${from} to ${to} of ${totalRecords} entries`
                  }
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <>
            {/* ============================================================== EMPLOYEE FORM ============================================================== */}

            <div>
              <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                <h6 className="mb-5 text-lg font-bold">
                  {isEditMode ? "UPDATE RESERVATION" : "ADD NEW RESERVATION"}
                </h6>
                {/* =================================== PERSONAL INFORMATION =================================== */}

                <div className="flex flex-col sm:flex-row">
                  <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4 ">
                    <img
                      src="/assets//images/profile-34.jpeg"
                      alt="img"
                      className="mx-auto h-20 w-20 rounded-full object-cover md:h-32 md:w-32"
                    />
                  </div>
                  <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 p-4 bg-yellow-50 dark:border-[#191e3a] dark:bg-black">
                    {/* BRANCH NAME */}

                    <div className="form-group">
                      <label
                        htmlFor="iban-code"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Current Branch
                      </label>
                      <div className="relative">
                        <select
                          id="branch_Id"
                          name="branch_Id"
                          {...register("branch_Id")}
                          className={`form-input flex-1 ${errors.branch_Id ? "border-red-500" : ""}`}
                        >
                          <option value="">Choose Branch</option>
                          {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                              {/* Adjust based on your branch model */}
                            </option>
                          ))}
                        </select>
                        {errors.branch_Id && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.branch_Id && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {String(errors.branch_Id.message)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* COMPANY NAME */}

                    <div className="form-group">
                      <label
                        htmlFor="iban-code"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Company
                      </label>
                      <div className="relative">
                        <select
                          id="company_Id"
                          name="company_Id"
                          {...register("company_Id")}
                          className={`form-input flex-1 ${errors.company_Id ? "border-red-500" : ""}`}
                        >
                          <option value="">Choose Company</option>
                          {Array.isArray(companies) &&
                            companies.map((company) => (
                              <option key={company.id} value={company.id}>
                                {company.company_name || "Unnamed Company"}
                              </option>
                            ))}
                        </select>
                        {errors.company_Id && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.company_Id && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {String(errors.company_Id.message)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE NAME */}

                    <div className="form-group">
                      <label
                        htmlFor="iban-code"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Vehicle
                      </label>
                      <div className="relative">
                        <select
                          id="vehicle_Id"
                          name="vehicle_Id"
                          {...register("vehicle_Id")}
                          className={`form-input flex-1 ${errors.vehicle_Id ? "border-red-500" : ""}`}
                        >
                          <option value="">Choose Vehicle</option>
                          {Array.isArray(vehicles) &&
                            vehicles.map((vehicle) => (
                              <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.model || "Unnamed Vehicle"}
                              </option>
                            ))}
                        </select>
                        {errors.vehicle_Id && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.vehicle_Id && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {String(errors.vehicle_Id.message)}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* CUSTOMER NAME */}

                    <div className="form-group">
                      <label
                        htmlFor="iban-code"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Customer Name
                      </label>
                      <div className="relative">
                        <select
                          id="customer_id"
                          name="customer_id"
                          {...register("customer_id")}
                          className={`form-input flex-1 ${errors.customer_id ? "border-red-500" : ""}`}
                        >
                          <option value="">Choose Customer</option>
                          {Array.isArray(customers) &&
                            customers.map((customer) => (
                              <option key={customer.id} value={customer.id}>
                                {customer.full_name || "Unnamed Customer"}
                              </option>
                            ))}
                        </select>
                        {errors.customer_id && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.customer_id && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {String(errors.customer_id.message)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* NAME */}
                    {/* <div>
                      <label htmlFor="name">Name</label>
                      <div className="relative">
                        <input
                          id="name"
                          type="text"
                          className={`form-input pr-7 ${errors.name ? "border-red-500" : ""}`}
                          placeholder="Name"
                          {...register("name")}
                        />
                        {errors.name && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.name && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.name.message}
                          </span>
                        </div>
                      )}
                    </div> */}

                    {/* MOBILE NUMBER */}

                    <div>
                      <label htmlFor="mobile">Mobile Number</label>
                      <div className="relative">
                        <input
                          id="mobile_no"
                          type="text"
                          placeholder="+1 (530) 555-1212"
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

                    {/* EMAIL ADDRESS */}

                    <div>
                      <label htmlFor="email">Email Address</label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          className={`form-input pr-7 ${errors.email ? "border-red-500" : ""}`}
                          placeholder="Enter your email address"
                          {...register("email")}
                        />
                        {errors.email && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.email && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.email.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PICKUP LOCATION */}
                    <div>
                      <label htmlFor="pickup_location">Pickup Location</label>
                      <div className="relative">
                        <input
                          id="pickup_location"
                          type="text"
                          className={`form-input pr-7 ${errors.pickup_location ? "border-red-500" : ""}`}
                          placeholder="Name"
                          {...register("pickup_location")}
                        />
                        {errors.pickup_location && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.pickup_location && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.pickup_location.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PICKUP DATE */}

                    <div>
                      <label htmlFor="pick_up_date">Pickup Date</label>
                      <div className="relative">
                        <input
                          id="pick_up_date"
                          type="date"
                          className={`form-input pr-7 ${errors.pick_up_date ? "border-red-500" : ""}`}
                          {...register("pick_up_date")}
                        />
                        {errors.pick_up_date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.pick_up_date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.pick_up_date.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* RETURN LOCATION */}
                    <div>
                      <label htmlFor="return_location">Return Location</label>
                      <div className="relative">
                        <input
                          id="return_location"
                          type="text"
                          className={`form-input pr-7 ${errors.return_location ? "border-red-500" : ""}`}
                          placeholder="Name"
                          {...register("return_location")}
                        />
                        {errors.return_location && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.return_location && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.return_location.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* RETURN DATE */}

                    <div>
                      <label htmlFor="return_date">Return Date</label>
                      <div className="relative">
                        <input
                          id="return_date"
                          type="date"
                          className={`form-input pr-7 ${errors.return_date ? "border-red-500" : ""}`}
                          {...register("return_date")}
                        />
                        {errors.return_date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.return_date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.return_date.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* RATE */}
                    <div>
                      <label htmlFor="rate">Rate</label>
                      <div className="relative">
                        <input
                          id="rate"
                          type="text"
                          placeholder="Rate"
                          className={`form-input pr-7 ${errors.rate ? "border-red-500" : ""}`}
                          {...register("rate")}
                        />
                        {errors.rate && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.rate && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.rate.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ACRISS CAR CODE */}

                    <div>
                      <label htmlFor="acriss_car_code">Acriss Car Code</label>
                      <div className="relative">
                        <input
                          id="acriss_car_code"
                          type="text"
                          className={`form-input pr-7 ${errors.acriss_car_code ? "border-red-500" : ""}`}
                          placeholder="Enter your acriss car code"
                          {...register("acriss_car_code")}
                        />
                        {errors.acriss_car_code && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.acriss_car_code && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.acriss_car_code.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE CATEGORY */}
                    <div>
                      <label htmlFor="vehicle_category">Vehicle Category</label>
                      <div className="relative">
                        <select
                          id="vehicle_category"
                          className={`form-select ${errors.vehicle_category ? "border-red-500" : ""}`}
                          {...register("vehicle_category")}
                        >
                          <option value="">Select Category</option>
                          <option value="Luxury">Luxury</option>
                          <option value="Fancy">Fancy</option>
                          <option value="Racing">Racing</option>
                          <option value="Premium">Premium</option>
                        </select>
                        {errors.vehicle_category && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.vehicle_category && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.vehicle_category.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* RESERVATION STATUS */}
                    <div>
                      <label htmlFor="reservations_status">Status</label>
                      <div className="relative">
                        <select
                          id="reservations_status"
                          className={`form-select ${errors.reservations_status ? "border-red-500" : ""}`}
                          {...register("reservations_status")}
                        >
                          <option value="">Select Status</option>
                          <option value="Active">1</option>
                          <option value="In active">2</option>
                        </select>
                        {errors.reservations_status && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.reservations_status && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.reservations_status.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE PLATE SOURCE */}
                    <div className="">
                      <label
                        htmlFor="iban-code"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Plate Source
                      </label>
                      <div className="relative">
                        <select
                          id="plate_source_id"
                          name="plate source"
                          {...register("plate_source_id")}
                          className={`form-input flex-1 ${errors.plate_source_id ? "border-red-500" : ""}`}
                        >
                          <option value="">Choose Plate Source</option>
                          {vehiclePlateSource.map((plateSource) => (
                            <option key={plateSource.id} value={plateSource.id}>
                              {plateSource.plate_source}
                              {/* Adjust based on your branch model */}
                            </option>
                          ))}
                        </select>
                        {errors.plate_source_id && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.plate_source_id && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {String(errors.plate_source_id.message)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* REFERENCE */}

                    <div>
                      <label htmlFor="reference">Reference</label>
                      <div className="relative">
                        <input
                          id="reference"
                          type="text"
                          className={`form-input pr-7 ${errors.reference ? "border-red-500" : ""}`}
                          {...register("reference")}
                        />
                        {errors.reference && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.reference && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.reference.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* SPECIAL NOTES */}

                    <div>
                      <label htmlFor="special_notes">Special Notes</label>
                      <div className="relative">
                        <input
                          id="special_notes"
                          type="text"
                          placeholder="note..."
                          className={`form-input pr-7 ${errors.special_notes ? "border-red-500" : ""}`}
                          {...register("special_notes")}
                        />
                        {errors.special_notes && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.special_notes && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.special_notes.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DATE OF RESERVATION */}

                    <div>
                      <label htmlFor="date">Reservation Date</label>
                      <div className="relative">
                        <input
                          id="date"
                          type="date"
                          placeholder="Date of Reservation"
                          className={`form-input pr-7 ${errors.date ? "border-red-500" : ""}`}
                          {...register("date")}
                        />
                        {errors.date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.date.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ATTACHED FILE */}
                    <div className="form-group">
                      <label
                        htmlFor="attached_file"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Attach File(s)
                      </label>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <div className="relative w-full">
                            <input
                              id="attached_file"
                              type="file"
                              name="attached_file"
                              className={`form-input flex-1 ${errors.attached_file ? "border-red-500" : ""}`}
                              {...register("attached_file")}
                            />
                            {errors.attached_file && (
                              <FaExclamationCircle
                                className="absolute top-1/2 right-6 transform -translate-y-1/2 text-red-500"
                                style={{ fontSize: "calc(1em + 5px)" }}
                              />
                            )}
                          </div>
                        </div>
                        {errors.attached_file && (
                          <div className="mt-1">
                            <span className="inline-block pl-2 pr-3 text-sm font-medium text-white bg-red-500 rounded-lg shadow-sm">
                              {String(errors.attached_file.message)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* nREF */}

                    <div>
                      <label htmlFor="passport_no">nREF</label>
                      <div className="relative">
                        <input
                          id="nRef"
                          type="text"
                          placeholder="nREF"
                          className={`form-input pr-7 ${errors.nRef ? "border-red-500" : ""}`}
                          {...register("nRef")}
                        />
                        {errors.nRef && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.nRef && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.nRef.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* SAVE BUTTON */}
                    <div className="flex justify-end items-center gap-x-2">
                      <button
                        type="button"
                        onClick={onCLickAdd}
                        className="btn btn-danger ltr:mr-3 rtl:ml-3 rounded-full"
                      >
                        <IconXCircle className="shrink-0 ltr:mr-2 rtl:ml-2" />
                        Close
                      </button>

                      <button
                        type="button"
                        className="btn btn-success ltr:mr-3 rtl:ml-3 rounded-full"
                        onClick={handleSubmit(handleSubmitData)}
                      >
                        {loadingForm ? (
                          <ButtonLoader />
                        ) : (
                          <>
                            <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                            {"Save"}
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </>
        </>
      )}
    </div >
  );
};

export default Reservations;
