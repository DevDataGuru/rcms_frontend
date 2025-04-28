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
import { getVehicles } from "@/services/vehicles";
import { getCustomers } from "@/services/customers";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Swal from "sweetalert2";
import IconSend from "@/components/icon/icon-send";
import IconPrinter from "@/components/icon/icon-printer";
import IconDownload from "@/components/icon/icon-download";
import {
  deleteVehicleOrders,
  getVehicleOrders,
  savevehicleOrder,
  updateVehicleOrders,
} from "@/services/orders";
import { sortData, toISO } from "@/utils/sortingHelper";
import { format } from "date-fns";
const Reservations = () => {
  // ======================= A: STATE MANAGEMENT =========================

  // 1. REACT HOOKS FOR GLOBAL AND LOCAL STATE
  const [orders, setOrders] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [customers, setCustomers] = useState([]);
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
  const [sortDataTable, setsortDataTable] = useState(null);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction: "asc",
  });

  // ======================= C: VALIDATION SCHEMA (YUP) =========================
  const schema = yup.object({
    custom_opening_date: yup
      .string()
      .required("Customor opening date is required"),
    custom_closing_date: yup
      .string()
      .required("Customor closing date is required"),
    customer_id: yup.string().required("Customor name is required"),
    vehicle_id: yup.string().required("Vehicle name is required"),
    order_type: yup.string().required("Order type is Required"),
    rate: yup.string().required("Rate is required"),
    period: yup.string().required("Period is required"),
    return_location: yup.string().required("Return location is required"),
    daily_km_limit: yup.string().required("Daily km limit is required"),
    salesman: yup.string().required("Salesman name is required"),
    special_notes: yup.string(),
    nref: yup.string().required("nref is required"),
    ReturnDate: yup.string().required("Return Date is required"),
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

  // 1. FETCH VEHICLES
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

  // 2. FETCH CUSTOMERS
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
        if (result && result.data && result.data.records) {
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

  // 3. FETCH ORDERS
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Create query params properly
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
          sortField: sortStatus.columnAccessor,
          sortOrder: sortStatus.direction,
        }).toString();

        const result = await getVehicleOrders(queryParams);
        if (result?.data?.records) {
          setOrders(result.data.records);
          setTotalRecords(result.data.totalCount);
        } else {
          setOrders([]);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch orders");
        setOrders([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
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
      const orderData = {
        userId: decodedData?.sub,
        custom_opening_date: toISO(formData.custom_opening_date),
        custom_closing_date: toISO(formData.custom_closing_date),
        customer_id: parseInt(formData.customer_id),
        vehicle_id: parseInt(formData.vehicle_id),
        order_type: formData.order_type,
        rate: parseInt(formData.rate),
        period: formData.period,
        return_location: formData.return_location,
        daily_km_limit: formData.daily_km_limit,
        salesman: formData.salesman,
        special_notes: formData.special_notes,
        nref: formData.nref,
        ReturnDate: toISO(formData.ReturnDate),
      };

      let result;
      if (updateId) {
        result = await updateVehicleOrders(updateId, orderData);
        setAlert({
          type: "success",
          message: "Order updated successfully.",
        });
      } else {
        result = await savevehicleOrder(orderData);
        setAlert({
          type: "success",
          message: "Order saved successfully.",
        });
      }

      if (result) {
        // setAlert("success");
        reset();
        setUpdateForm(false);
        setUpdateId(null);
        setIsEditMode(false); // Reset edit mode
        handleReload(); // Refresh the list
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
      const response = await deleteVehicleOrders(userId);
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

  // ======================= G: UTILITIES AND HELPERS =========================

  // 1. RELOAD GRID DATA
  const handleReload = () => {
    setReload(!reloadRecord);
  };

  // 2. SORT DATA
  const dataMap = {
    customer_id: customers.map((cst) => ({ id: cst.id, name: cst.full_name })),
    vehicle_Id: vehicles.map((veh) => ({ id: veh.id, name: veh.name })),
  };

  // Custom hook or useMemo for sorted data
  const sortedData = useMemo(() => {
    return sortData(orders, sortStatus, dataMap);
  }, [orders, sortStatus, customers, vehicles]);

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
    // console.log()
    setIsEditMode(true);
    const ordersData = orders.find((order) => order.id === id);
    console.log({ ordersData })
    // Add validation to check if ordersData exists
    if (!ordersData) {
      console.error("Order data not found");
      return;
    }
    setValue("custom_opening_date", format(ordersData.custom_opening_date, "yyyy-MM-dd"));
    setValue("custom_closing_date", format(ordersData.custom_closing_date, "yyyy-MM-dd"));
    setValue("customer_id", ordersData.customer_id);
    setValue("vehicle_id", ordersData.vehicle_id);
    setValue("order_type", ordersData.order_type);
    setValue("rate", ordersData.rate);
    setValue("period", ordersData.period);
    setValue("return_location", ordersData.return_location);
    setValue("daily_km_limit", ordersData.daily_km_limit);
    setValue("salesman", ordersData.salesman);
    setValue("special_notes", ordersData.special_notes);
    setValue("nref", ordersData.nref);
    setValue("ReturnDate", format(ordersData.ReturnDate, "yyyy-MM-dd"));

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
                      accessor: "vehicle_id",
                      sortable: true,
                      title: "Vehicle",
                      render: (row) => {
                        const vehicle = vehicles.find(
                          (veh) => veh.id === row.vehicle_id
                        );
                        return vehicle?.model || "N/A";
                      },
                    },
                    {
                      accessor: "order_type",
                      title: "Order Type",
                      sortable: true,
                    },
                    {
                      accessor: "rate",
                      sortable: true,
                      title: "Rate",
                    },

                    {
                      accessor: "period",
                      title: "Period",
                      sortable: true,
                    },
                    {
                      accessor: "return_location",
                      sortable: true,
                      title: "Return Location",
                    },
                    {
                      accessor: "ReturnDate",
                      sortable: true,
                      title: "return Date",
                      render: ({ ReturnDate }) => (
                        <div>{format(ReturnDate, "yyyy-MM-dd")}</div>
                      )
                    },
                    {
                      accessor: "daily_km_limit",
                      sortable: true,
                      title: "Daily KM Limit",
                    },

                    {
                      accessor: "salesman",
                      sortable: true,
                      title: "Sales Person",
                    },

                    {
                      accessor: "nref",
                      sortable: true,
                      title: "Reference",
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
                  {isEditMode ? "UPDATE ORDER" : "ADD NEW ORDER"}
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
                          id="vehicle_id"
                          name="vehicle_Id"
                          {...register("vehicle_id")}
                          className={`form-input flex-1 ${errors.vehicle_id ? "border-red-500" : ""}`}
                        >
                          <option value="">Choose Vehicle</option>
                          {Array.isArray(vehicles) &&
                            vehicles.map((vehicle) => (
                              <option key={vehicle.id} value={vehicle.id}>
                                {vehicle.model || "Unnamed Vehicle"}
                              </option>
                            ))}
                        </select>
                        {errors.vehicle_id && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.vehicle_id && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {String(errors.vehicle_id.message)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ORDER TYPE */}

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

                    <div>
                      <label htmlFor="mobile">Order Type</label>
                      <div className="relative">
                        <input
                          id="order_type"
                          type="text"
                          className={`form-input pr-7 ${errors.order_type ? "border-red-500" : ""}`}
                          {...register("order_type")}
                        />
                        {errors.order_type && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.order_type && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.order_type.message}
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

                    {/* PERIOD */}
                    <div>
                      <label htmlFor="period">Period</label>
                      <div className="relative">
                        <input
                          id="period"
                          type="text"
                          placeholder="period"
                          className={`form-input pr-7 ${errors.period ? "border-red-500" : ""}`}
                          {...register("period")}
                        />
                        {errors.period && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.period && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.period.message}
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

                    {/* EMAIL ADDRESS */}

                    <div>
                      <label htmlFor="daily_km_limit">Daily KM Limit</label>
                      <div className="relative">
                        <input
                          id="daily_km_limit"
                          type="daily_km_limit"
                          className={`form-input pr-7 ${errors.daily_km_limit ? "border-red-500" : ""}`}
                          placeholder="Enter your email address"
                          {...register("daily_km_limit")}
                        />
                        {errors.daily_km_limit && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.daily_km_limit && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.daily_km_limit.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* SALES MAN*/}
                    <div>
                      <label htmlFor="salesman">Sales Person</label>
                      <div className="relative">
                        <input
                          id="salesman"
                          type="text"
                          className={`form-input pr-7 ${errors.salesman ? "border-red-500" : ""}`}
                          placeholder="Name"
                          {...register("salesman")}
                        />
                        {errors.salesman && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.salesman && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.salesman.message}
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

                    {/* nREF */}

                    <div>
                      <label htmlFor="passport_no">nref</label>
                      <div className="relative">
                        <input
                          id="nref"
                          type="text"
                          placeholder="nref"
                          className={`form-input pr-7 ${errors.nref ? "border-red-500" : ""}`}
                          {...register("nref")}
                        />
                        {errors.nref && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.nref && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.nref.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* RETURN DATE */}

                    <div>
                      <label htmlFor="ReturnDate">Return Date</label>
                      <div className="relative">
                        <input
                          id="ReturnDate"
                          type="date"
                          className={`form-input pr-7 ${errors.ReturnDate ? "border-red-500" : ""}`}
                          {...register("ReturnDate")}
                        />
                        {errors.ReturnDate && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.ReturnDate && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.ReturnDate.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CUSTIOM OPENING DATE */}

                    <div>
                      <label htmlFor="custom_opening_date">
                        Custom Opening Date
                      </label>
                      <div className="relative">
                        <input
                          id="custom_opening_date"
                          type="date"
                          className={`form-input pr-7 ${errors.custom_opening_date ? "border-red-500" : ""}`}
                          {...register("custom_opening_date")}
                        />
                        {errors.custom_opening_date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.custom_opening_date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.custom_opening_date.message}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* CUSTOM CLOSING DATE */}

                    <div>
                      <label htmlFor="custom_closing_date">
                        Custom Clossing Date
                      </label>
                      <div className="relative">
                        <input
                          id="custom_closing_date"
                          type="date"
                          className={`form-input pr-7 ${errors.custom_closing_date ? "border-red-500" : ""}`}
                          {...register("custom_closing_date")}
                        />
                        {errors.custom_closing_date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.custom_closing_date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.custom_closing_date.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* SAVE BUTTON */}
                    <div className="flex justify-end items-center gap-x-2">
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
    </div>
  );
};

export default Reservations;
