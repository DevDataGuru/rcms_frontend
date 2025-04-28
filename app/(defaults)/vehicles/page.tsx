"use client";
import IconPlus from "@/components/icon/icon-plus";
import {
  ActionIcon,
  Button,
  Checkbox,
  MultiSelect,
  Stack,
  TextInput,
} from "@mantine/core";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import IconXCircle from "@/components/icon/icon-x-circle";
import IconSave from "@/components/icon/icon-save";
import * as yup from "yup";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import { getBranches } from "@/services/branchService";
import { FaEdit, FaExclamationCircle, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import {
  getVehicleColors,
  getVehicleMakes,
  getVehiclePlateSources,
} from "@/services/commonService";
import {
  deleteVehicle,
  getVehicles,
  saveVehicle,
  updateVehicle,
} from "@/services/vehicles";
import { jwtDecode } from "jwt-decode";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import ButtonLoader from "@/components/button-loader";
import IconSend from "@/components/icon/icon-send";
import IconPrinter from "@/components/icon/icon-printer";
import IconDownload from "@/components/icon/icon-download";
import IconSearch from "@/components/icon/icon-search";
import IconX from "@/components/icon/icon-x";
import { sortData, toISO } from "@/utils/sortingHelper";
import { format } from "date-fns";

const Vehicles = () => {
  // ======================= A: STATE MANAGEMENT =========================

  const [vehicles, setVehicles] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [reloadRecord, setReload] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState({ type: null, message: null });
  const [showVehicleForm, setVehiclesForm] = useState(false);
  const [page, setPage] = useState(1);
  const [updateId, setUpdateId] = useState(null);
  const [error, setError] = useState(null);
  const [loadingForm, setLoadingForm] = useState(false);
  const [branches, setBranches] = useState([]);
  const [vehicleMakes, setVehicleMake] = useState([]);
  const [vehicleColor, setvehicleColor] = useState([]);
  const [vehiclePlateSource, setVehiclePlateSource] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [query, setQuery] = useState("");
  // ======================= B: CONSTANTS AND CONFIGURATIONS =========================
  const PAGE_SIZES = [10, 2, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction: "asc",
  });

  // ======================= C: VALIDATION SCHEMA (YUP) =========================
  const schema = yup.object({
    make_id: yup.string().required("Vehicle maker is Required"),
    model: yup.string().required("Vehicle model is Required"),
    insurance_expiry_date: yup
      .string()
      .required("Insurance expiry date is Required"),
    insurance_provider_name: yup
      .string()
      .required("Insurance provider name is Required"),
    engine: yup.string(),
    chassis_num: yup.string().required("Chassis number is Required"),
    year: yup.number().required("Year is Required"),
    current_odometer: yup.string().required("Current odometer is Required"),
    color_id: yup.string().required("Color is Required"),
    daily_odometer_limit: yup
      .string()
      .required("Daily odometer limit is Required"),
    traffic_file: yup.string().required("Traffic file is Required"),
    odometer_extra_fees_per_unit: yup
      .string()
      .required("Odometer extra fees per unit is Required"),
    plate_source_id: yup.string().required("Plate source is Required"),
    curr_fuel: yup.string().required("Current fuel is Required"),
    plate_num: yup.string().required("Plaet number is Required"),
    daily_rate: yup.string().required("Daily rate is Required"),
    plate_category: yup.string().required("Plate categories is Required"),
    weekly_rate: yup.string().required("Weekly rate is Required"),
    license_issuance_date: yup
      .string()
      .required("license issuance date is Required"),
    monthly_rate: yup.string().required("Monthly rate is Required"),
    license_expiry_date: yup
      .string()
      .required("License expiry date is Required"),
    yearly_rate: yup.string().required("Yearly rate is Required"),
    salik_account: yup.string().required("Salik account is Required"),
    current_location: yup.string().required("Current location is Required"),
    current_status: yup.string().required("Current status is Required"),
    categories: yup.string(),
    branch_id: yup.string().required("Branch name is Required"),
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

  // 2. VEHCILE COLOR
  useEffect(() => {
    const fetchVehicleColors = async () => {
      try {
        const result = await getVehicleColors();
        if (result?.data?.records) {
          setvehicleColor(result.data.records);
          // Optionally dispatch to Redux if needed
          // dispatch(setBranches(result.data));
        }
      } catch (error) {
        console.error("Error fetching vehicle colors:", error);
      }
    };
    fetchVehicleColors();
  }, [page, pageSize, reloadRecord]);

  // 3. VEHCILE MAKE
  useEffect(() => {
    const fetchVehicleMake = async () => {
      try {
        const result = await getVehicleMakes();
        if (result?.data?.records) {
          setVehicleMake(result.data.records);
          // Optionally dispatch to Redux if needed
          // dispatch(setBranches(result.data));
        }
      } catch (error) {
        console.error("Error fetching vehicle makes:", error);
      }
    };
    fetchVehicleMake();
  }, [page, pageSize, reloadRecord]);

  // 4. VEHCILE PLATE SOURCE
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

  // 5. FETCH VEHICLES
  useEffect(() => {
    const fetchVehicles = async () => {
      setLoading(true);
      try {
        // Create query params properly
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
        }).toString();

        console.log("Query Params:", queryParams); // Debug log

        const result = await getVehicles(queryParams);
        // console.log("Fetch Result:", result.data.records); // Debug log

        if (result && result.data && result.data.records) {
          setVehicles(result.data.records);
          setTotalRecords(result.data.totalCount);
        } else {
          setVehicles([]);
          setTotalRecords(0);
        }
      } catch (err) {
        console.error("Error:", err);
        setError("Failed to fetch employees");
        setVehicles([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    };

    fetchVehicles();
  }, [page, pageSize, reloadRecord, sortStatus]);

  // ======================= F: EVENT HANDLERS =========================

  // 1. TOGGLE USER FORM VISIBILITY
  const onCLickAdd = () => {
    setIsEditMode(false);
    setAlert(null);
    setVehiclesForm(!showVehicleForm);
    reset();
  };

  // 2. FORM SUBMISSION HANDLER
  const handleVehicleSubmit = async (formData) => {
    setIsEditMode(false); // Reset edit mode
    setLoading(true);
    setLoadingForm(true);
    // reset();
    try {
      const userToken = localStorage.getItem("user");
      const decodedData = jwtDecode(userToken);
      // Map the form data to match your backend DTO
      const vehicleData = {
        make_id: parseInt(formData.make_id),
        model: formData.model,
        insurance_expiry_date: toISO(formData.insurance_expiry_date),
        insurance_provider_name: formData.insurance_provider_name,
        engine: formData.engine,
        chassis_num: formData.chassis_num,
        year: formData.year,
        current_odometer: formData.current_odometer,
        color_id: parseInt(formData.color_id),
        daily_odometer_limit: formData.daily_odometer_limit,
        traffic_file: formData.traffic_file,
        odometer_extra_fees_per_unit: formData.odometer_extra_fees_per_unit,
        plate_source_id: parseInt(formData.plate_source_id),
        curr_fuel: formData.curr_fuel,
        plate_num: formData.plate_num,
        daily_rate: formData.daily_rate,
        plate_category: formData.plate_category,
        weekly_rate: formData.weekly_rate,
        license_issuance_date: toISO(formData.license_issuance_date),
        monthly_rate: formData.monthly_rate,
        license_expiry_date: toISO(formData.license_expiry_date),
        yearly_rate: formData.yearly_rate,
        salik_account: formData.salik_account,
        current_location: formData.current_location,
        current_status: formData.current_status,
        categories: formData.categories,
        branch_id: parseInt(formData.branch_id),
      };

      let result;
      if (updateId) {
        result = await updateVehicle(updateId, vehicleData);
        setAlert({
          type: "success",
          message: "Vehicle updated successfully.",
        });
      } else {
        result = await saveVehicle(vehicleData);
        setAlert({
          type: "success",
          message: "Vehicle registered successfully.",
        });
      }

      if (result) {
        reset();
        setVehiclesForm(false);
        setUpdateId(null);
        setIsEditMode(false); // Reset edit mode
        handleReload();
      }
    } catch (error) {
      console.error("Save/Update vehicle error:", error);
      // setShowAlert("error");
    } finally {
      setLoading(false);
      setLoadingForm(false);
    }
  };

  // 3. DELETE HANDLER
  const handleDelete = async (userId) => {
    try {
      const response = await deleteVehicle(userId);
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
    branch_id: branches.map((brh) => ({ id: brh.id, name: brh.name })),
    color_id: vehicleColor.map((color) => ({
      id: color.id,
      name: color.color,
    })),
    make_id: vehicleMakes.map((make) => ({ id: make.id, name: make.make })),
    plate_source_id: vehiclePlateSource.map((plt) => ({
      id: plt.id,
      name: plt.plate_source,
    })),
  };

  // Custom hook or useMemo for sorted data
  const sortedData = useMemo(() => {
    return sortData(vehicles, sortStatus, dataMap);
  }, [
    sortStatus,
    vehicles,
    vehicleColor,
    vehicleMakes,
    branches,
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
  } = useForm({ resolver: yupResolver(schema) });
  useEffect(() => {
    console.log(errors);
  }, [errors]);

  const handleUpdateFormOpen = (id: number) => {
    setIsEditMode(true);
    const vehicleData = vehicles.find((vehicle) => vehicle.id === id);
    if (!vehicleData) return;

    setValue("make_id", vehicleData.make_id);
    setValue("model", vehicleData.model);
    setValue(
      "insurance_expiry_date",
      format(vehicleData.insurance_expiry_date, "yyyy-MM-dd")
    );
    setValue("insurance_provider_name", vehicleData.insurance_provider_name);
    setValue("engine", vehicleData.engine);
    setValue("chassis_num", vehicleData.chassis_num);
    setValue("year", vehicleData.year);
    setValue("current_odometer", vehicleData.current_odometer);
    setValue("color_id", vehicleData.color_id);
    setValue("daily_odometer_limit", vehicleData.daily_odometer_limit);
    setValue("traffic_file", vehicleData.traffic_file);
    setValue(
      "odometer_extra_fees_per_unit",
      vehicleData.odometer_extra_fees_per_unit
    );
    setValue("plate_source_id", vehicleData.plate_source_id);
    setValue("curr_fuel", vehicleData.curr_fuel);
    setValue("plate_num", vehicleData.plate_num);
    setValue("daily_rate", vehicleData.daily_rate);
    setValue("plate_category", vehicleData.plate_category);
    setValue("weekly_rate", vehicleData.weekly_rate);
    setValue(
      "license_issuance_date",
      format(vehicleData.license_issuance_date, "yyyy-MM-dd")
    );
    setValue("monthly_rate", vehicleData.monthly_rate);
    setValue(
      "license_expiry_date",
      format(vehicleData.license_expiry_date, "yyyy-MM-dd")
    );
    setValue("yearly_rate", vehicleData.yearly_rate);
    setValue("salik_account", vehicleData.salik_account);
    setValue("current_location", vehicleData.current_location);
    setValue("current_status", vehicleData.current_status);
    setValue("categories", vehicleData.categories);
    setValue("branch_id", vehicleData.branch_id);
    setVehiclesForm(true);
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
      {/* ============================================================== BUTTONS ============================================================== */}
      {!showVehicleForm ? (
        <>
          {/* ============================================================== ALERTS ============================================================== */}
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

            {/* ============================================================== DATATABLE ============================================================== */}

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
                      title: "Vehicles ID",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search id..."
                          rightSection={
                            <ActionIcon
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => setQuery("")}
                            ></ActionIcon>
                          }
                          value={query}
                          onChange={(e) => setQuery(e.currentTarget.value)}
                        />
                      ),
                      filtering: query !== "",

                      render: ({ id }) => (
                        <strong className="flex justify-center  text-info pointer-cursor">
                          {id}
                        </strong>
                      ),
                    },
                    {
                      accessor: "branch_id",
                      title: "Branch Name",
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Branch..."
                          rightSection={
                            <ActionIcon
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => setQuery("")}
                            ></ActionIcon>
                          }
                          value={query}
                          onChange={(e) => setQuery(e.currentTarget.value)}
                        />
                      ),
                      filtering: query !== "",

                      sortable: true,
                      render: (row) => {
                        // Find the branch name from branches array
                        const branch = branches.find(
                          (b) => b.id === row.branch_id
                        );
                        return branch?.name || "N/A";
                      },
                    },
                    {
                      accessor: "make_id",
                      title: "Vehicle Make",
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search vehicle make..."
                          rightSection={
                            <ActionIcon
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => setQuery("")}
                            ></ActionIcon>
                          }
                          value={query}
                          onChange={(e) => setQuery(e.currentTarget.value)}
                        />
                      ),
                      filtering: query !== "",

                      sortable: true,
                      render: (row) => {
                        // Find the branch name from branches array
                        const make = vehicleMakes.find(
                          (vm) => vm.id === row.make_id
                        );
                        return make?.make || "N/A";
                      },
                    },
                    {
                      accessor: "model",
                      title: "Model Name",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Model..."
                          rightSection={
                            <ActionIcon
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => setQuery("")}
                            ></ActionIcon>
                          }
                          value={query}
                          onChange={(e) => setQuery(e.currentTarget.value)}
                        />
                      ),
                      filtering: query !== "",
                    },
                    {
                      accessor: "year",
                      title: "Year",
                      sortable: true,
                    },
                    {
                      accessor: "color_id",
                      title: "Vehicle Color",
                      sortable: true,
                      render: (row) => {
                        // Find the branch name from branches array
                        const color = vehicleColor.find(
                          (vc) => vc.id === row.color_id
                        );
                        return color?.color || "N/A";
                      },
                    },
                    {
                      accessor: "engine",
                      title: "Engine",
                      sortable: true,
                    },
                    {
                      accessor: "chassis_num",
                      title: "Chassis Number",
                      sortable: true,
                    },
                    {
                      accessor: "plate_num",
                      title: "Plate Number",
                      sortable: true,
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
                      accessor: "plate_category",
                      title: "Plate Category",
                      sortable: true,
                    },
                    {
                      accessor: "current_odometer",
                      title: "Cuurrent Odometer",
                      sortable: true,
                    },
                    {
                      accessor: "daily_odometer_limit",
                      title: "Daily Odometer Limit",
                      sortable: true,
                    },
                    {
                      accessor: "odometer_extra_fees_per_unit",
                      title: "Odometer Extra Fees Per Unit",
                      sortable: true,
                    },
                    {
                      accessor: "curr_fuel",
                      title: "Current Fuel",
                      sortable: true,
                    },
                    {
                      accessor: "daily_rate",
                      title: "Daily Rate",
                      sortable: true,
                    },
                    {
                      accessor: "weekly_rate",
                      title: "Weekly Rate",
                      sortable: true,
                    },
                    {
                      accessor: "monthly_rate",
                      title: "Monthly Rate",
                      sortable: true,
                    },
                    {
                      accessor: "yearly_rate",
                      title: "Yearly Rate",
                      sortable: true,
                    },
                    {
                      accessor: "insurance_provider_name",
                      title: "Insurance Provider Name",
                      sortable: true,
                    },
                    {
                      accessor: "insurance_expiry_date",
                      title: "Insurance Expiry Date",
                      sortable: true,
                    },
                    {
                      accessor: "license_issuance_date",
                      title: "Insurance Issuance Date",
                      sortable: true,
                    },
                    {
                      accessor: "license_expiry_date",
                      title: "License Expiry Date",
                      sortable: true,
                    },
                    {
                      accessor: "salik_account",
                      title: "Salik Account",
                      sortable: true,
                    },
                    {
                      accessor: "traffic_file",
                      title: "Trafic File",
                      sortable: true,
                    },
                    {
                      accessor: "current_location",
                      title: "Current Location",
                      sortable: true,
                    },
                    {
                      accessor: "current_status",
                      title: "Current Status",
                      sortable: true,
                    },
                    {
                      accessor: "categories",
                      title: "Categories",
                      sortable: true,
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
      ) : (
        <>
          <>
            {/* ============================================================== VEHICLE FORM ============================================================== */}

            <div>
              <form className="mb-5 rounded-md border border-[#ebedf2] bg-white p-4 dark:border-[#191e3a] dark:bg-black">
                <h6 className="mb-5 text-lg font-bold">
                  {isEditMode ? "UPDATE VEHICLE" : "ADD NEW VEHICLE"}
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
                          id="country"
                          name="country"
                          {...register("branch_id")}
                          className={`form-input flex-1 ${errors.branch_id ? "border-red-500" : ""}`}
                        >
                          <option value="">Choose Branch</option>
                          {branches.map((branch) => (
                            <option key={branch.id} value={branch.id}>
                              {branch.name}
                              {/* Adjust based on your branch model */}
                            </option>
                          ))}
                        </select>
                        {errors.branch_id && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.branch_id && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {String(errors.branch_id.message)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE MAKE */}
                    <div className="form-group">
                      <label
                        htmlFor="iban-code"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Vehice Make*
                      </label>
                      <div className="relative">
                        <select
                          id="make_id"
                          name="make"
                          {...register("make_id")}
                          className={`form-input flex-1 ${errors.make_id ? "border-red-500" : ""}`}
                        >
                          <option value="">Choose Vehicle Make</option>
                          {vehicleMakes.map((make) => (
                            <option key={make.id} value={make.id}>
                              {make.make}
                              {/* Adjust based on your branch model */}
                            </option>
                          ))}
                        </select>
                        {errors.make_id && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.make_id && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {String(errors.make_id.message)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE MODEL */}
                    <div>
                      <label htmlFor="model">Vehicle Model*</label>
                      <div className="relative">
                        <input
                          id="model"
                          type="text"
                          className={` form-input ${errors.model ? "border-red-500" : ""}`}
                          {...register("model")}
                        />
                        {errors.model && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.model && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.model.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE YEAR */}
                    <div>
                      <label htmlFor="year">Vehicle Year*</label>
                      <div className="relative">
                        <input
                          id="year"
                          type="text"
                          className={` form-input ${errors.year ? "border-red-500" : ""}`}
                          {...register("year")}
                        />
                        {errors.year && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.year && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.year.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE COLOR */}
                    <div className="form-group">
                      <label
                        htmlFor="iban-code"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Current Color
                      </label>
                      <div className="relative">
                        <select
                          id="color_id"
                          name="color"
                          {...register("color_id")}
                          className={`form-input flex-1 ${errors.color_id ? "border-red-500" : ""}`}
                        >
                          <option value="">Choose Color</option>
                          {vehicleColor.map((color) => (
                            <option key={color.id} value={color.id}>
                              {color.color}
                            </option>
                          ))}
                        </select>
                        {errors.color_id && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.color_id && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {String(errors.color_id.message)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE ENGINE */}
                    <div>
                      <label htmlFor="engine">Vehicle Engine</label>
                      <div className="relative">
                        <input
                          id="engine"
                          type="text"
                          className={` form-input ${errors.engine ? "border-red-500" : ""}`}
                          {...register("engine")}
                        />
                        {errors.engine && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.engine && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.engine.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE CHASSIS NUMBER */}
                    <div>
                      <label htmlFor="chassis_num">
                        Vehicle Chassis Number*
                      </label>
                      <div className="relative">
                        <input
                          id="chassis_num"
                          type="text"
                          className={` form-input ${errors.chassis_num ? "border-red-500" : ""}`}
                          {...register("chassis_num")}
                        />
                        {errors.chassis_num && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.chassis_num && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.chassis_num.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE PLATE NUMBER */}
                    <div>
                      <label htmlFor="plate_num">Vehicle Plate Number*</label>
                      <div className="relative">
                        <input
                          id="plate_num"
                          type="text"
                          className={` form-input ${errors.plate_num ? "border-red-500" : ""}`}
                          {...register("plate_num")}
                        />
                        {errors.plate_num && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.plate_num && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.plate_num.message}
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

                    {/* VEHICLE PLATE CATEGORY */}
                    <div>
                      <label htmlFor="plate_category">
                        Vehicle Plate Category*
                      </label>
                      <div className="relative">
                        <input
                          id="plate_category"
                          type="plate category"
                          className={` form-input ${errors.plate_category ? "border-red-500" : ""}`}
                          {...register("plate_category")}
                        />
                        {errors.plate_category && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.plate_category && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.plate_category.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE CURRENT ODODMETER */}
                    <div>
                      <label htmlFor="current_odometer">
                        Vehicle Current Odometer*
                      </label>
                      <div className="relative">
                        <input
                          id="current_odometer"
                          type="current odometer"
                          className={` form-input ${errors.current_odometer ? "border-red-500" : ""}`}
                          {...register("current_odometer")}
                        />
                        {errors.current_odometer && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.current_odometer && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.current_odometer.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VEHICLE DAILY ODODMETER LIMIT */}
                    <div>
                      <label htmlFor="daily_odometer_limit">
                        Vehicle Daily Odometer limit*
                      </label>
                      <div className="relative">
                        <input
                          id="daily_odometer_limit"
                          type="daily odometer limit"
                          className={` form-input ${errors.daily_odometer_limit ? "border-red-500" : ""}`}
                          {...register("daily_odometer_limit")}
                        />
                        {errors.daily_odometer_limit && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.daily_odometer_limit && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.daily_odometer_limit.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* ODODMETER EXTRA FEES PER UNIT */}
                    <div>
                      <label htmlFor="odometer_extra_fees_per_unit">
                        Vehicle Odometer Extra Fees Per Unit*
                      </label>
                      <div className="relative">
                        <input
                          id="odometer_extra_fees_per_unit"
                          type="odometer extra fees per unit"
                          className={` form-input ${errors.odometer_extra_fees_per_unit ? "border-red-500" : ""}`}
                          {...register("odometer_extra_fees_per_unit")}
                        />
                        {errors.odometer_extra_fees_per_unit && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.odometer_extra_fees_per_unit && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.odometer_extra_fees_per_unit.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CURRENT FUEL */}
                    <div>
                      <label htmlFor="curr_fuel">Vehicle Current Fuel*</label>
                      <div className="relative">
                        <input
                          id="curr_fuel"
                          type="current fueld"
                          className={` form-input ${errors.curr_fuel ? "border-red-500" : ""}`}
                          {...register("curr_fuel")}
                        />
                        {errors.curr_fuel && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.curr_fuel && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.curr_fuel.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DAILY RATE */}
                    <div>
                      <label htmlFor="daily_rate">Vehicle Daily Rate*</label>
                      <div className="relative">
                        <input
                          id="daily_rate"
                          type="daily rate"
                          className={` form-input ${errors.daily_rate ? "border-red-500" : ""}`}
                          {...register("daily_rate")}
                        />
                        {errors.daily_rate && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.daily_rate && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.daily_rate.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* WEEKLY RATE */}
                    <div>
                      <label htmlFor="weekly_rate">Vehicle Weekly Rate*</label>
                      <div className="relative">
                        <input
                          id="weekly_rate"
                          type="weekly rate"
                          className={` form-input ${errors.weekly_rate ? "border-red-500" : ""}`}
                          {...register("weekly_rate")}
                        />
                        {errors.weekly_rate && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.weekly_rate && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.weekly_rate.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* MONTHLY RATE */}
                    <div>
                      <label htmlFor="monthly_rate">
                        Vehicle Monthly Rate*
                      </label>
                      <div className="relative">
                        <input
                          id="monthly_rate"
                          type="monthly rate"
                          className={` form-input ${errors.monthly_rate ? "border-red-500" : ""}`}
                          {...register("monthly_rate")}
                        />
                        {errors.monthly_rate && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.monthly_rate && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.monthly_rate.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* YEARLY RATE */}
                    <div>
                      <label htmlFor="yearly_rate">Vehicle Yearly Rate*</label>
                      <div className="relative">
                        <input
                          id="monthly_rate"
                          type="yearly rate"
                          className={` form-input ${errors.monthly_rate ? "border-red-500" : ""}`}
                          {...register("yearly_rate")}
                        />
                        {errors.yearly_rate && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.yearly_rate && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.yearly_rate.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* INSURANCE PROVIDER NAME */}
                    <div>
                      <label htmlFor="insurance_provider_name">
                        Insurance Provider Name*
                      </label>
                      <div className="relative">
                        <input
                          id="insurance_provider_name"
                          type="insurance provoder name"
                          className={` form-input ${errors.insurance_provider_name ? "border-red-500" : ""}`}
                          {...register("insurance_provider_name")}
                        />
                        {errors.insurance_provider_name && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.insurance_provider_name && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.insurance_provider_name.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* INSURANCE EXPIRY DATE */}

                    <div>
                      <label htmlFor="insurance_expiry_date">
                        Insurance Expiry Date
                      </label>
                      <div className="relative">
                        <input
                          id="insurance_expiry_date"
                          type="date"
                          className={`form-input pr-7 ${errors.insurance_expiry_date ? "border-red-500" : ""}`}
                          {...register("insurance_expiry_date")}
                        />
                        {errors.insurance_expiry_date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.insurance_expiry_date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.insurance_expiry_date.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* LICENSE ISSUED DATE */}

                    <div>
                      <label htmlFor="license_issuance_date">
                        License Issued Date
                      </label>
                      <div className="relative">
                        <input
                          id="license_issuance_date"
                          type="date"
                          className={`form-input pr-7 ${errors.license_issuance_date ? "border-red-500" : ""}`}
                          {...register("license_issuance_date")}
                        />
                        {errors.license_issuance_date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.license_issuance_date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.license_issuance_date.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* LICENSE EXPIRY DATE */}

                    <div>
                      <label htmlFor="license_expiry_date">
                        License Expiry Date
                      </label>
                      <div className="relative">
                        <input
                          id="license_expiry_date"
                          type="date"
                          className={`form-input pr-7 ${errors.license_expiry_date ? "border-red-500" : ""}`}
                          {...register("license_expiry_date")}
                        />
                        {errors.license_expiry_date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.license_expiry_date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.license_expiry_date.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* SALIK ACCOUNT */}
                    <div>
                      <label htmlFor="salik_account">Salik Account*</label>
                      <div className="relative">
                        <input
                          id="salik_account"
                          type="salik account"
                          className={` form-input ${errors.salik_account ? "border-red-500" : ""}`}
                          {...register("salik_account")}
                        />
                        {errors.salik_account && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.salik_account && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.salik_account.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* TRAFFIC FILE */}
                    <div>
                      <label htmlFor="traffic_file">Traffic File*</label>
                      <div className="relative">
                        <input
                          id="traffic_file"
                          type="traffic file"
                          className={` form-input ${errors.traffic_file ? "border-red-500" : ""}`}
                          {...register("traffic_file")}
                        />
                        {errors.traffic_file && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.traffic_file && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.traffic_file.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CURRENT LOCATION */}
                    <div>
                      <label htmlFor="current_location">
                        Vehicle Current Location*
                      </label>
                      <div className="relative">
                        <input
                          id="current_location"
                          type="current location"
                          className={` form-input ${errors.current_location ? "border-red-500" : ""}`}
                          {...register("current_location")}
                        />
                        {errors.current_location && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.current_location && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.current_location.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CURRENT STATUS */}
                    <div>
                      <label htmlFor="current_status">Status</label>
                      <div className="relative">
                        <select
                          id="current_status"
                          className={`form-select ${errors.current_status ? "border-red-500" : ""}`}
                          {...register("current_status")}
                        >
                          <option value="">Select Current Status</option>
                          <option value="Active">1</option>
                          <option value="In active">2</option>
                        </select>
                        {errors.current_status && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.current_status && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.current_status.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* CATEGORY */}
                    <div>
                      <label htmlFor="categories">Category</label>
                      <div className="relative">
                        <select
                          id="categories"
                          className={`form-select ${errors.categories ? "border-red-500" : ""}`}
                          {...register("categories")}
                        >
                          <option value="">Select Category</option>
                          <option value="Luxury">Luxury</option>
                          <option value="Old">Old</option>
                        </select>
                        {errors.categories && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.categories && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.categories.message}
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
                        onClick={handleSubmit(handleVehicleSubmit)}
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

export default Vehicles;
