"use client";
import IconPlus from "@/components/icon/icon-plus";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import IconXCircle from "@/components/icon/icon-x-circle";
import IconSave from "@/components/icon/icon-save";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { DataTable, DataTableSortStatus } from "mantine-datatable";
import Select from "react-select";
import sortBy from "lodash/sortBy";
import ComponentUserRolePage from "@/components/users/user-role/component-user-role";
import { deleteUsers, getUsers, updateUsers } from "@/services/usersService";
import { registerUser } from "@/services/authService";
import { getBranches } from "@/services/branchService";
import { getRoleNames } from "@/services/userRolesService";
import { FaEdit, FaExclamationCircle, FaTrash } from "react-icons/fa";
import Swal from "sweetalert2";
import ButtonLoader from "@/components/button-loader";
import {
  ActionIcon,
  TextInput,
} from "@mantine/core";

const ComponentsAppsInvoiceList = () => {
  const router = useRouter();
  const [showUserForm, setUserForm] = useState(false);
  const [showUserRole, setUserRole] = useState(false);
  const [roleNames, setRoleNames] = useState([]);
  const [branches, setBranches] = useState([]);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingForm, setLoadingForm] = useState(false);
  const [showAlert, setShowAlert] = useState("");
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [updateId, setUpdateId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [page, setPage] = useState(1);
  const PAGE_SIZES = [10, 2, 20, 30, 50, 100];
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
  const [initialRecords, setInitialRecords] = useState(sortBy(users, "id"));
  const [recordsData, setRecordsData] = useState(initialRecords);
  const [reloadGrid, setReloadGrid] = useState(false);
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "created_at",
    direction: "desc",
  });
  const [query, setQuery] = useState("");
  const [filters, setFilters] = useState({
    id: "",
    first_name: "",
    email: "",
    branch: "",
    inactivity_status: "",
  });

  const [isMounted, setIsMounted] = useState(false);
  const reloadGridData = () => {
    setReloadGrid(!reloadGrid);
  };
  const showUserRolePage = () => {
    setUserForm(false);
    setUserRole(!showUserRole);
  };
  const onCLickAdd = () => {
    setUpdateId(null);
    setUserRole(false);
    setUserForm(!showUserForm);
    setShowAlert(null);
    reset();
    setSelectedOptions([]);
  };
  const onClickUpdate = () => {
    setShowUpdateForm(true);
    setUserForm(false);
    setShowAlert(null);
  };

  const handleDelete = async (userId) => {
    try {
      const response = await deleteUsers(userId);
      if (response) {
        // Refresh the users list
        reloadGridData();
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  };
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const result = await getUsers(
          `page=${page}&limit=${pageSize}&filter=${JSON.stringify(filters)}`
        );
        console.log("API Result:", result);
        if (result && result.data) {
          setUsers(result.data);
          setTotalRecords(result.totalCount);
        } else {
          throw new Error("Invalid response structure");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch users");
      }
    };
    fetchUsers();
  }, [page, pageSize, reloadGrid, filters]);
  interface UserRole {
    id: string | number; // Adjust based on the actual type
    role: string;
  }

  useEffect(() => {
    const fetchRoleNames = async () => {
      try {
        const result = await getRoleNames();
        console.log("Fetched Role Names:", result.data);
        if (result && result.data) {
          const usersRolesArray: object[] = []; // Adjust the type based on the expected role ID type
          const usersRoles = result.data as UserRole[] | undefined; // Explicitly define the type of user.role_id

          usersRoles?.forEach((val) => {
            usersRolesArray.push({ value: val?.id, label: val?.role });
          });

          setRoleNames(usersRolesArray);
          // Optionally dispatch to Redux if needed
          // dispatch(setRoleNames(result.data));
        }
      } catch (error) {
        console.error("Error fetching role names:", error);
      }
    };
    // if (accessToken) {
    fetchRoleNames();
    // }
  }, []);

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const result = await getBranches();
        console.log(result)
        if (result && result.data) {
          setBranches(result.data.records);

          // Optionally dispatch to Redux if needed
          // dispatch(setBranches(result.data));
        }
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    };
    // if (accessToken) {
    fetchBranches();
    // }
  }, []);

  const handleRegisterUser = async (formData) => {
    setLoadingForm(true);
    try {
      let response;
      if (updateId !== null) {
        response = await updateUsers(updateId, formData);
      } else {
        response = await registerUser(formData);
      }
      if (response) {
        response.data;
        setShowAlert("success");
        setTimeout(() => setShowAlert(null), 3000);
        reset();
        setUpdateId(null);
        reloadGridData();
      } else {
        setShowAlert("error");
      }
    } catch (error) {
      console.error("Error registering user:", error);
      setShowAlert("error");
    } finally {
      setLoadingForm(false);
    }
  };
  const [schema, setSchema] = useState(null);
  useEffect(() => {
    if (updateId) {
      const schema1 = yup.object({
        first_name: yup.string().required("First name is Required"),
        last_name: yup.string().required("Last name is Required"),
        email: yup
          .string()
          .email("Email is not valid")
          .required("Email is Required"),
        username: yup.string().required("Username is Required"),
        prefered_language: yup.string().required("Language is Required"),
        phone_no: yup.string().required("Phone number is Required"),
        branch_id: yup.number().required("Current branch is Required"),
        role_id: yup.array().required("User role is Required"),
      });

      setSchema(schema1);
    } else {
      const schema2 = yup.object({
        first_name: yup.string().required("First name is Required"),
        last_name: yup.string().required("Last name is Required"),
        email: yup
          .string()
          .email("Email is not valid")
          .required("Email is Required"),
        username: yup.string().required("Username is Required"),
        prefered_language: yup.string().required("Language is Required"),
        phone_no: yup.string().required("Phone number is Required"),
        branch_id: yup.number().required("Current branch is Required"),
        role_id: yup.array().required("User role is Required"),
        password: yup
          .string()
          .required("Password is Required")
          .min(6, "Password must be at least 6 characters")
          .max(32, "Password must be at most 32 characters"),
      });
      setSchema(schema2);
    }
  }, [updateId]);
  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setPage(1);
  }, [pageSize]);

  useEffect(() => {
    const from = (page - 1) * pageSize;
    const to = from + pageSize;
    setRecordsData([...initialRecords.slice(from, to)]);
  }, [page, pageSize, initialRecords]);

  useEffect(() => {
    const data = sortBy(initialRecords, sortStatus.columnAccessor);
    setInitialRecords(sortStatus.direction === "desc" ? data.reverse() : data);
    setPage(1);
  }, [sortStatus]);

  const randomColor = () => {
    const color = [
      "#4361ee",
      "#805dca",
      "#00ab55",
      "#e7515a",
      "#e2a03f",
      "#2196f3",
    ];
    const random = Math.floor(Math.random() * color.length);
    return color[random];
  };
  const handleUpdateFormOpen = (id: number) => {
    const gridData = users.find((staff) => staff.id === id);
    const roleData = roleNames.filter((role) =>
      gridData.role_id.includes(role.value)
    );
    console.log(roleData);
    setValue("first_name", gridData.first_name);
    setValue("last_name", gridData.last_name);
    setValue("email", gridData.email);
    setValue("username", gridData.username);
    setValue("prefered_language", gridData.prefered_language);
    setValue("phone_no", gridData.phone_no);
    setValue("branch_id", gridData.branch_id);
    setValue("role_id", gridData.role_id);
    setSelectedOptions(roleData);
    setUserForm(true);
    setUpdateId(id);
  };

  const chart_options = () => {
    let option = {
      chart: { sparkline: { enabled: true } },
      stroke: { curve: "smooth", width: 2 },
      markers: { size: [4, 7], strokeWidth: 0 },
      colors: [randomColor()],
      grid: { padding: { top: 5, bottom: 5 } },
      tooltip: {
        x: { show: false },
        y: {
          title: {
            formatter: () => {
              return "";
            },
          },
        },
      },
    };
    return option;
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

  const handleChange = (selected) => {
    setSelectedOptions(selected); // Update state with selected options
    const idArray = [];
    selected.map((val) => {
      idArray.push(val.value);
    });
    setValue("role_id", idArray);
  };

  // Use the table hooks
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === "id" ? Number(value) : value,
    }));
    setPage(1); // Reset to the first page on filter change
  };

  return (
    <>
      {!showUserRole && (
        <div className="panel border-white-light px-0 dark:border-[#1b2e4b] overflow-hidden	">
          <div className="mb-2.5 relative pt-2 pb-4  top-[-20px] flex flex-col justify-between  rounded-t-md	 px-5 md:flex-row md:items-center bg-[linear-gradient(225deg,rgba(239,18,98,0.6)_0%,rgba(67,97,238,0.6)_100%)] text-white">
            <h2 style={{ margin: 0 }} className="font-bold text-2xl">
              {!showUserForm ? "User Records" : "Add new user"}
            </h2>

            <div className="flex items-center gap-2">
              {!showUserForm && !showUserRole ? (
                <Link
                  href="#"
                  onClick={onCLickAdd}
                  className="btn btn-primary gap-2"
                >
                  <IconPlus />
                  Add User
                </Link>
              ) : (
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={showUserRolePage}
                >
                  <IconPlus />
                  Add new role
                </button>
              )}
            </div>
          </div>

          <div className="invoice-table">
            <div className="">
              <div style={{ padding: "20px" }}>
                {!showUserForm && !showUserRole && (
                  <>
                    {/* Table */}
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
                          filter: (
                            <TextInput
                              // label="Id"
                              placeholder="Search id..."
                              rightSection={
                                <ActionIcon
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
                              #{id}
                            </strong>
                          ),
                        },
                        {
                          accessor: "first_name",
                          title: "User",
                          sortable: true,
                          filter: (
                            <TextInput
                              // label="Id"
                              placeholder="Search Name ..."
                              rightSection={
                                <ActionIcon
                                  size="sm"
                                  variant="transparent"
                                  c="dimmed"
                                  onClick={() =>
                                    handleFilterChange("first_name", "")
                                  }
                                ></ActionIcon>
                              }
                              value={filters.first_name || ""}
                              onChange={(e) =>
                                handleFilterChange(
                                  "first_name",
                                  e.currentTarget.value
                                )
                              }
                            />
                          ),

                          render: ({ first_name, last_name }) => (
                            <div className="flex items-center gap-2">
                              <div className="font-semibold">{`${first_name} ${last_name}`}</div>
                            </div>
                          ),
                        },

                        {
                          accessor: "email",
                          title: "Email",
                          sortable: true,
                          filter: (
                            <TextInput
                              // label="Id"
                              placeholder="Search Email..."
                              rightSection={
                                <ActionIcon
                                  size="sm"
                                  variant="transparent"
                                  c="dimmed"
                                  onClick={() =>
                                    handleFilterChange("email", "")
                                  }
                                ></ActionIcon>
                              }
                              value={filters.email || ""}
                              onChange={(e) =>
                                handleFilterChange(
                                  "email",
                                  e.currentTarget.value
                                )
                              }
                            />
                          ),

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
                          filter: (
                            <TextInput
                              // label="Id"
                              placeholder="Search Branch..."
                              rightSection={
                                <ActionIcon
                                  size="sm"
                                  variant="transparent"
                                  c="dimmed"
                                  onClick={() =>
                                    handleFilterChange("branch", "")
                                  }
                                ></ActionIcon>
                              }
                              value={filters.branch || ""}
                              onChange={(e) =>
                                handleFilterChange(
                                  "branch",
                                  e.currentTarget.value
                                )
                              }
                            />
                          ),

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
                          filter: (
                            <TextInput
                              // label="Id"
                              placeholder="Search Status..."
                              rightSection={
                                <ActionIcon
                                  size="sm"
                                  variant="transparent"
                                  c="dimmed"
                                  onClick={() =>
                                    handleFilterChange("inactivity_status", "")
                                  }
                                ></ActionIcon>
                              }
                              value={filters.inactivity_status || ""}
                              onChange={(e) =>
                                handleFilterChange(
                                  "inactivity_status",
                                  e.currentTarget.value
                                )
                              }
                            />
                          ),

                          render: ({ inactivity_status }) => (
                            <span
                              className={`badge bg-${!inactivity_status ? "success" : "danger"} rounded-full`}
                            >
                              {inactivity_status ? "In active" : "Active"}
                            </span>
                          ),
                        },
                        {
                          accessor: "id",
                          title: "Action",
                          render: ({ id }) => (
                            <div className="flex justify-center gp-x-2">
                              <Link
                                href={"#"}
                                onClick={() => {
                                  handleUpdateFormOpen(id);
                                }}
                              >
                                <button className="p-1 text-blue-600 hover:bg-blue-100 rounded-full">
                                  <FaEdit className="w-5 h-5" />
                                </button>
                                <button
                                  onClick={() => showAlertSwal(10, id)}
                                  className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                                >
                                  <FaTrash className="w-5 h-5" />
                                </button>
                              </Link>
                            </div>
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
                  </>
                )}
              </div>
            </div>
          </div>
          {showUserForm && (
            <>
              <div className="px-6">
                {showAlert && (
                  <div
                    className={`flex items-center p-3.5 rounded text-white ${
                      showAlert === "success"
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
                      {showAlert === "success" &&
                        "User registered successfully."}
                      {showAlert === "error" &&
                        "An error occurred. Please try again."}
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
                )}{" "}
              </div>
              <div className="h-full flex-1 overflow-x-hidden p-0">
                <div className="relative">
                  <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                    <div className="form-group">
                      <label
                        htmlFor="reciever-email"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        First Name
                      </label>
                      <div className="relative">
                        <input
                          id="firstName"
                          type="text"
                          name="firstName"
                          className={`form-input flex-1 ${errors.first_name ? "border-red-500" : ""}`}
                          placeholder="Enter Name"
                          {...register("first_name")}
                        />
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
                            {String(errors.first_name.message)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="Last Name"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Last Name
                      </label>
                      <div className="relative">
                        <input
                          id="LastName"
                          type="text"
                          name="last_name"
                          className={`form-input flex-1 ${errors.last_name ? "border-red-500" : ""}`}
                          placeholder="Enter Last Name"
                          {...register("last_name")}
                        />
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
                            {String(errors.last_name.message)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="form-group">
                      <label
                        htmlFor="country"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Language
                      </label>
                      <div className="relative">
                        <select
                          id="Language"
                          name="Language"
                          className={`form-input flex-1 ${errors.prefered_language ? "border-red-500" : ""}`}
                          {...register("prefered_language")}
                        >
                          <option value="">Choose Language</option>
                          <option value="United States">English</option>
                          <option value="United Kingdom">Arabic</option>
                          <option value="Canada">Canada</option>
                          <option value="Australia">Australia</option>
                          <option value="Germany">Germany</option>
                          <option value="Sweden">Sweden</option>
                          <option value="Denmark">Denmark</option>
                          <option value="Norway">Norway</option>
                          <option value="New-Zealand">New Zealand</option>
                          <option value="Afghanistan">Afghanistan</option>
                          <option value="Albania">Albania</option>
                          <option value="Algeria">Algeria</option>
                          <option value="American-Samoa">Andorra</option>
                          <option value="Angola">Angola</option>
                        </select>
                        {errors.prefered_language && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.prefered_language && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {String(errors.prefered_language.message)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="reciever-number"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Phone Number
                      </label>
                      <div className="relative">
                        <input
                          id="reciever-number"
                          type="text"
                          name="reciever-number"
                          className={`form-input flex-1 ${errors.phone_no ? "border-red-500" : ""}`}
                          placeholder="Enter Phone number"
                          {...register("phone_no")}
                        />

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
                            {String(errors.phone_no.message)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="reciever-email"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Email (required)
                      </label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          name="email"
                          className={`form-input flex-1 ${errors.email ? "border-red-500" : ""}`}
                          placeholder="Enter Email"
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
                            {String(errors.email.message)}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="form-group">
                      <label
                        htmlFor="bank-name"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        Username (required)
                      </label>

                      <div className="relative">
                        <input
                          id="bank-name"
                          type="text"
                          name="bank-name"
                          className={`form-input flex-1 ${errors.username ? "border-red-500" : ""}`}
                          placeholder="Enter Bank Name"
                          {...register("username")}
                        />
                        {errors.username && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.username && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {String(errors.username.message)}
                          </span>
                        </div>
                      )}
                    </div>
                    {!updateId && (
                      <div className="form-group">
                        <label
                          htmlFor="swift-code"
                          className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                        >
                          Password
                        </label>

                        <div className="relative">
                          <input
                            id="swift-code"
                            type="text"
                            name="swift-code"
                            className={`form-input flex-1 ${errors.password ? "border-red-500" : ""}`}
                            placeholder="Password"
                            {...register("password")}
                          />
                          {errors.password && (
                            <FaExclamationCircle
                              className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                              style={{ fontSize: "calc(1em + 5px)" }}
                            />
                          )}
                        </div>
                        {errors.password && (
                          <div className="mt-2">
                            <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                              {String(errors.password.message)}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

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

                    <div className="form-group">
                      <label
                        htmlFor="country"
                        className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                      >
                        User role
                      </label>
                      <div className="flex flex-col">
                        <div className="flex items-center">
                          <div className="relative w-full">
                            <Select
                              placeholder="Select an option"
                              options={roleNames}
                              isMulti
                              isSearchable={false}
                              className={`form-input w-full rounded p-2 ${errors.role_id ? "border-red-500" : "border-gray-300"}`}
                              onChange={handleChange} // Handle value changes
                            />

                            {errors.role_id && (
                              <FaExclamationCircle
                                className="absolute top-1/2 right-6 transform -translate-y-1/2 text-red-500"
                                style={{ fontSize: "calc(1em + 5px)" }}
                              />
                            )}
                          </div>
                        </div>
                        {errors.role_id && (
                          <div className="mt-1">
                            <span className="inline-block pl-2 pr-3 text-sm font-medium text-white bg-red-500 rounded-lg shadow-sm">
                              {String(errors.role_id.message)}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </form>

                  {/* <!-- Sticky Save Button --> */}
                  {/* <div className="sticky bottom-0 bg-white p-4 border-t">
  </div>
*/}
                  <div className="sticky bottom-0 bg-white dark:bg-[#181F32] border-t p-4 flex justify-end space-x-3">
                    <div className="flex justify-end items-center gap-x-2">
                      <button
                        type="button"
                        onClick={onCLickAdd}
                        className="btn btn-danger ltr:mr-3 rtl:ml-3 w-full rounded-full"
                      >
                        <IconXCircle className="shrink-0 ltr:mr-2 rtl:ml-2" />
                        Close
                      </button>

                      <button
                        type="button"
                        className="btn btn-success ltr:mr-3 rtl:ml-3 rounded-full"
                        onClick={handleSubmit(handleRegisterUser)}
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
              </div>
            </>
          )}
          {}
        </div>
      )}

      {showUserRole && (
        <>
          <ComponentUserRolePage setUserRole={setUserRole} />
        </>
      )}
    </>
  );
};

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPaginationRange = () => {
    const range = [];
    const siblingCount = 1;

    const totalNumbers = siblingCount * 2 + 5;
    if (totalPages <= totalNumbers) {
      for (let i = 1; i <= totalPages; i++) range.push(i);
      return range;
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const showLeftDots = leftSiblingIndex > 2;
    const showRightDots = rightSiblingIndex < totalPages - 2;

    if (!showLeftDots && showRightDots) {
      const leftRange = [1, 2, 3, 4];
      return [...leftRange, "...", totalPages];
    } else if (showLeftDots && !showRightDots) {
      const rightRange = [totalPages - 3, totalPages - 2, totalPages - 1];
      return [1, "...", ...rightRange, totalPages];
    } else {
      return [
        1,
        "...",
        ...Array.from(
          { length: rightSiblingIndex - leftSiblingIndex + 1 },
          (_, idx) => leftSiblingIndex + idx
        ),
        "...",
        totalPages,
      ];
    }
  };

  const paginationRange = getPaginationRange();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-2 border rounded-md ${
          currentPage === 1 ? "text-gray-400 cursor-not-allowed" : "text-black"
        }`}
      >
        &lt;
      </button>

      {paginationRange.map((page, index) =>
        page === "..." ? (
          <span key={index} className="px-3 py-2 text-gray-400">
            ...
          </span>
        ) : (
          <button
            key={index}
            onClick={() => onPageChange(page)}
            className={`px-3 py-2 border rounded-md ${
              page === currentPage
                ? "bg-blue-500 text-white"
                : "bg-white text-black hover:bg-gray-200"
            }`}
          >
            {page}
          </button>
        )
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-2 border rounded-md ${
          currentPage === totalPages
            ? "text-gray-400 cursor-not-allowed"
            : "text-black"
        }`}
      >
        &gt;
      </button>
    </div>
  );
};

export default ComponentsAppsInvoiceList;
