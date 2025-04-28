"use client"
import IconSave from "@/components/icon/icon-save"
import { yupResolver } from "@hookform/resolvers/yup"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import { FaEdit, FaExclamationCircle, FaTrash } from "react-icons/fa"
import * as yup from "yup"
import { DataTable, type DataTableSortStatus } from "mantine-datatable"
import IconXCircle from "@/components/icon/icon-x-circle"
import Link from "next/link"
import IconPlus from "@/components/icon/icon-plus"
import { getBranches } from "@/services/branchService"
import { getFolder } from "@/services/folders"
import { deleteEmployee, getEmployees, saveEmployee, updateEmployees } from "@/services/employee"
import { jwtDecode } from "jwt-decode"
import Swal from "sweetalert2"
import ButtonLoader from "@/components/button-loader"
import { format } from "date-fns"
import { sortData } from "@/utils/sortingHelper"
import { TextInput, ActionIcon } from "@mantine/core"

const ComponentsUsersAccountSettingsTabs = () => {
  // ======================= A: STATE MANAGEMENT =========================

  // 1. REACT HOOKS FOR GLOBAL AND LOCAL STATE
  const [employees, setEmployees] = useState([])
  const [branches, setBranches] = useState([])
  const [companies, setCompanies] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [reloadRecord, setReload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(null)
  const [showUserForm, setUserForm] = useState(false)
  const [page, setPage] = useState(1)
  const [updateId, setUpdateId] = useState(null)
  const [error, setError] = useState(null)
  const [loadingForm, setLoadingForm] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  // ======================= B: CONSTANTS AND CONFIGURATIONS =========================
  const PAGE_SIZES = [10, 2, 20, 30, 50, 100]
  const [pageSize, setPageSize] = useState(PAGE_SIZES[0])
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: "id",
    direction: "asc",
  })
  const [filters, setFilters] = useState({
    id: null,
    branch_id: "",
    company_id: "",
    full_name_english: "",
    mother_name: "",
    nationality: "",
    email_address: "",
    home_phone: "",
    home_address: "",
    work_address: "",
    status: "",
    p_o_box: "",
    identity_card_no: "",
    identity_issued_date: "",
    identity_expiry_date: "",
    profession: "",
    monthly_salary: "",
    gender: "",
    date_of_birth: "",
    place_of_birth: "",
    mobile: "",
  })
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
    setPage(1) // Reset to the first page on filter change
  }

  // ======================= C: VALIDATION SCHEMA (YUP) =========================

  const schema = yup.object({
    branch_id: yup.number().required("Current branch is Required"),
    company_id: yup.number().required("Company name is Required"),
    profile_type: yup.string().required("Profile type is required"),
    full_name_english: yup.string().required("English name is required"),
    gender: yup.string().required("Gender is required"),
    preferred_language: yup.string().required("Language name is required"),
    nationality: yup.string().required("Nationality is required"),
    date_of_birth: yup.string().optional(),
    place_of_birth: yup.string().required("Place of birth is required"),
    identity_card_no: yup.string().required("Identity card number is required"),
    identity_issued_date: yup.string().required("Identity card issued date is required"),
    identity_expiry_date: yup.string().required("Identity card expiry date is required"),
    status: yup.string().required("Status is required"),
    monthly_salary: yup.string().required("Monthly salary is required"),
    mobile: yup.string().required("Mobile number is required"),
    work_phone: yup.string().required("Work phone number is required"),
    mother_name: yup.string().required("Mother name is required"),
    profession: yup.string().required("Profession name is required"),
    email_address: yup.string().required("Email address is required"),
    home_phone: yup.string().required("Home phone is required"),
    home_address: yup.string().required("Home address is required"),
    work_address: yup.string().required("Work address is required"),
    p_o_box: yup.string().required("P.O. Box is required"),

    category: yup
      .array()
      .of(yup.string())
      .min(1, "At least one category must be selected")
      .required("Category is required"),
  })

  // ======================= D: CUSTOM HOOKS AND DROPZONE =========================
  // 1. FILE UPLOAD HANDLER USING REACT-DROPZONE
  const onDrop = useCallback((acceptedFiles) => {
    console.log("Accepted files:", acceptedFiles)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  })

  // ======================= E: USE EFFECTS =========================

  // 1. FETCH BRANCHES
  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
        }).toString()
        const result = await getBranches()

        if (result?.data?.records) {
          setBranches(result.data.records)
          setTotalRecords(result.data.totalCount)
        }
      } catch (error) {
        console.error("Error fetching branches:", error)
      }
    }
    fetchBranches()
  }, [page, pageSize, reloadRecord])

  // 2. FETCH COMPANIES
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
        }).toString()
        const result = await getFolder(queryParams)
        if (result?.data?.records) {
          setCompanies(result.data.records)
          setTotalRecords(result.data.totalCount)
        }
      } catch (error) {
        console.error("Error fetching companies:", error)
      }
    }
    fetchCompanies()
  }, [page, pageSize, reloadRecord])

  // 3. FETCH EMPLOYEES
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true)
      try {
        // Create query params properly
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: pageSize.toString(),
          sortField: sortStatus.columnAccessor,
          sortOrder: sortStatus.direction,
          filterField: JSON.stringify(filters),
        }).toString()

        console.log("Query Params:", queryParams) // Debug log

        const result = await getEmployees(queryParams)
        // console.log("Fetch Result:", result.data.records); // Debug log

        if (result && result.data && result.data.records) {
          setEmployees(result.data.records)
          setTotalRecords(result.data.totalCount)
        } else {
          setEmployees([])
          setTotalRecords(0)
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to fetch employees")
        setEmployees([])
        setTotalRecords(0)
      } finally {
        setLoading(false)
      }
    }

    fetchEmployees()
  }, [page, pageSize, reloadRecord, sortStatus, filters])

  // ======================= F: EVENT HANDLERS =========================

  // 1. TOGGLE USER FORM VISIBILITY
  const onCLickAdd = () => {
    setShowAlert(null)
    setUserForm(!showUserForm)
    reset()
  }

  // 2. FORM SUBMISSION HANDLER
  const handleEmployeeSubmit = async (formData) => {
    // console.log({ formData });
    // return;
    setLoading(true)
    setLoadingForm(true)
    try {
      const userToken = localStorage.getItem("user")
      const decodedData = jwtDecode(userToken)
      // Map the form data to match your backend DTO
      const employeeData = {
        // Integer Parsing
        branch_id: Number.parseInt(formData.branch_id),
        company_id: Number.parseInt(formData.company_id),

        // String Fields
        full_name_english: formData.full_name_english,
        nationality: formData.nationality,
        identity_card_no: formData.identity_card_no,
        identity_issued_date: format(formData.identity_issued_date, "yyyy-MM-dd"),
        identity_expiry_date: format(formData.identity_expiry_date, "yyyy-MM-dd"),

        gender: formData.Gender, // Fixed typo to match schema
        date_of_birth: format(formData.date_of_birth, "yyyy-MM-dd"),
        place_of_birth: formData.place_of_birth,
        mobile: formData.mobile,
        work_phone: formData.work_phone,
        home_phone: formData.home_phone,
        home_address: formData.home_address,
        work_address: formData.work_address,
        mother_name: formData.mother_name,
        profession: formData.Profession || formData.profession,
        email_address: formData.email_address,

        // Additional Fields
        profile_type: formData.profile_type,
        category: formData.category,
        monthly_salary: formData.monthly_salary || "",
      }

      let result
      if (updateId) {
        result = await updateEmployees(updateId, employeeData)
      } else {
        result = await saveEmployee(employeeData, decodedData?.sub)
      }

      if (result) {
        setShowAlert("success")
        reset()
        setUserForm(false)
        setUpdateId(null)
        handleReload() // Refresh the list
      }
    } catch (error) {
      console.error("Save/Update customer error:", error)
      setShowAlert("error")
    } finally {
      setLoading(false)
      setLoadingForm(false)
    }
  }

  // 3. DELETE HANDLER
  const handleDelete = async (userId) => {
    try {
      const response = await deleteEmployee(userId)
      if (response) {
        handleReload() // Wait for reload to complete
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting user:", error)
      return false
    }
  }

  // ======================= G: UTILITIES AND MISC =========================

  // 1. RELOAD GRID DATA
  const handleReload = () => {
    setReload(!reloadRecord)
  }

  // 2. Move dataMap inside useMemo
  const dataMap = useMemo(
    () => ({
      branch_id: branches?.map((brh) => ({ id: brh.id, name: brh.name })) || [],
      company_id:
        companies?.map((comp) => ({
          id: comp.id,
          name: comp.company_name,
        })) || [],
    }),
    [branches, companies],
  )

  // 3. Use dataMap in sortedData
  const sortedData = useMemo(() => {
    return sortData(employees, sortStatus, dataMap)
  }, [employees, sortStatus, dataMap]) // Note: changed dependencies

  const categories = [
    "Manager",
    "Representative",
    "Engineer",
    "Worker",
    "Employee",
    "Data Entry",
    "Accountant",
    "Driver",
  ]

  // ======================= H: FORM CONFIGURATION =========================

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) })
  useEffect(() => {
    console.log(errors)
  }, [errors])

  const handleUpdateFormOpen = (id: number) => {
    setIsEditMode(true)
    const employeeData = employees.find((employee) => employee.id === id)
    if (!employeeData) return

    setValue("branch_id", employeeData.branch_id)
    setValue("company_id", employeeData.company_id)
    setValue("full_name_english", employeeData.full_name_english)
    setValue("nationality", employeeData.nationality)
    setValue("identity_card_no", employeeData.identity_card_no)
    setValue("identity_issued_date", format(employeeData.identity_issued_date, "yyyy-MM-dd"))
    setValue("identity_expiry_date", format(employeeData.identity_expiry_date, "yyyy-MM-dd"))
    setValue("status", employeeData.status)
    setValue("monthly_salary", employeeData.monthly_salary)
    setValue("gender", employeeData.gender)
    setValue("date_of_birth", format(employeeData.date_of_birth, "yyyy-MM-dd"))
    setValue("place_of_birth", employeeData.place_of_birth)
    setValue("mobile", employeeData.mobile)
    setValue("work_phone", employeeData.work_phone)
    setValue("mother_name", employeeData.mother_name)
    setValue("profession", employeeData.profession)
    setValue("email_address", employeeData.email_address)
    setValue("home_phone", employeeData.home_phone)
    setValue("home_address", employeeData.home_address)
    setValue("work_address", employeeData.work_address)
    setValue("p_o_box", employeeData.p_o_box)
    setValue("profile_type", employeeData.profile_type)
    setValue(
      "category",
      Array.isArray(employeeData.category)
        ? employeeData.category
        : typeof employeeData.category === "string"
          ? employeeData.category.split(",")
          : [],
    )

    setUserForm(true)
    setUpdateId(id)
  }
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
              })
            } else {
              Swal.fire({
                title: "Error",
                text: "Something went wrong. Try later",
                icon: "error",
                customClass: {
                  popup: "sweet-alerts",
                },
              })
            }
          })
        }
      })
    }
  }

  return (
    <div className="pt-5">
      {/* ============================================================== ALERTS ============================================================== */}
      {!showUserForm ? (
        <>
          <div>
            <div className="mb-6 flex flex-wrap items-center justify-center gap-2 sm:gap-4 lg:justify-end">
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

              <Link href="#" onClick={onCLickAdd} className="btn btn-primary gap-2 text-sm md:text-base">
                <IconPlus className="w-4 h-4 md:w-5 md:h-5" />
                Create
              </Link>

              {/* <Link href="/apps/invoice/edit" className="btn btn-warning gap-2">
                <IconEdit />
                Edit
              </Link> */}
            </div>
            <div className="panel overflow-hidden">
              <div className="overflow-x-auto">
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
                            <FaEdit className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              e.stopPropagation()
                              showAlertSwal(10, id)
                            }}
                            className="p-1 text-red-600 hover:bg-red-100 rounded-full"
                          >
                            <FaTrash className="w-4 h-4 md:w-5 md:h-5" />
                          </button>
                        </div>
                      ),
                    },
                    {
                      accessor: "id",
                      title: "Employees ID",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Employees ID..."
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
                          onChange={(e) => handleFilterChange("id", e.currentTarget.value)}
                        />
                      ),

                      render: ({ id }) => (
                        <strong className="flex justify-center  text-info pointer-cursor">{id}</strong>
                      ),
                    },
                    {
                      accessor: "branch_id",
                      title: "Branch Name",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Branch Name..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("branch_id", "")}
                            ></ActionIcon>
                          }
                          value={filters?.branch_id || ""}
                          onChange={(e) => handleFilterChange("branch_id", e.currentTarget.value)}
                        />
                      ),

                      render: (row) => {
                        // Find the branch name from branches array
                        const branch = branches.find((b) => b.id === row.branch_id)
                        return branch?.name || "N/A"
                      },
                    },
                    {
                      accessor: "company_id",
                      title: "Company Name",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Company Name..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("company_id", "")}
                            ></ActionIcon>
                          }
                          value={filters?.company_id || ""}
                          onChange={(e) => handleFilterChange("company_id", e.currentTarget.value)}
                        />
                      ),

                      render: (row) => {
                        const company = companies.find((c) => c.id === row.company_id)
                        return company?.company_name || "N/A" // Note: using company_name instead of name
                      },
                    },
                    {
                      accessor: "full_name_english",
                      title: "English Name",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search English Name..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("full_name_english", "")}
                            ></ActionIcon>
                          }
                          value={filters?.full_name_english || ""}
                          onChange={(e) => handleFilterChange("full_name_english", e.currentTarget.value)}
                        />
                      ),

                      // render: ({ name_english }) => <span>{name_english}</span>,
                    },
                    {
                      accessor: "email_address",
                      title: "Email Address",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Email Address..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("email_address", "")}
                            ></ActionIcon>
                          }
                          value={filters?.email_address || ""}
                          onChange={(e) => handleFilterChange("email_address", e.currentTarget.value)}
                        />
                      ),

                      render: ({ email_address }) => (
                        <a href={`mailto:${email_address}`} className="text-primary hover:underline">
                          {email_address}
                        </a>
                      ),
                    },
                    {
                      accessor: "status",
                      title: "Status",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Status..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("status", "")}
                            ></ActionIcon>
                          }
                          value={filters?.status || ""}
                          onChange={(e) => handleFilterChange("status", e.currentTarget.value)}
                        />
                      ),

                      render: ({ status }) => (
                        <span className={`badge bg-${!status ? "success" : "danger"} rounded-full`}>
                          {status ? "In active" : "Active"}
                        </span>
                      ),
                    },
                    {
                      accessor: "nationality",
                      title: "Nationality",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Nationality..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("nationality", "")}
                            ></ActionIcon>
                          }
                          value={filters?.nationality || ""}
                          onChange={(e) => handleFilterChange("nationality", e.currentTarget.value)}
                        />
                      ),

                      // render: ({ nationality }) => <span>{nationality}</span>,
                    },
                    {
                      accessor: "identity_card_no",
                      title: "Identity Card No",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Identity Card No..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("identity_card_no", "")}
                            ></ActionIcon>
                          }
                          value={filters?.identity_card_no || ""}
                          onChange={(e) => handleFilterChange("identity_card_no", e.currentTarget.value)}
                        />
                      ),

                      render: ({ identity_card_no }) => <span>{identity_card_no}</span>,
                    },

                    {
                      accessor: "monthly_salary",
                      title: "Monthly Salary",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Monthly Salary..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("monthly_salary", "")}
                            ></ActionIcon>
                          }
                          value={filters?.monthly_salary || ""}
                          onChange={(e) => handleFilterChange("monthly_salary", e.currentTarget.value)}
                        />
                      ),

                      render: ({ monthly_salary }) => <span>{monthly_salary}</span>,
                    },
                    {
                      accessor: "gender",
                      title: "Gender",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Gender..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("gender", "")}
                            ></ActionIcon>
                          }
                          value={filters?.gender || ""}
                          onChange={(e) => handleFilterChange("gender", e.currentTarget.value)}
                        />
                      ),

                      render: ({ gender }) => <span>{gender}</span>,
                    },
                    {
                      accessor: "date_of_birth",
                      title: "Date of Birth",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Date of Birth..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("date_of_birth", "")}
                            ></ActionIcon>
                          }
                          value={filters?.date_of_birth || ""}
                          onChange={(e) => handleFilterChange("date_of_birth", e.currentTarget.value)}
                        />
                      ),

                      render: ({ date_of_birth }) => <span>{date_of_birth}</span>,
                    },
                    {
                      accessor: "mobile",
                      title: "Mobile",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Mobile..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("mobile", "")}
                            ></ActionIcon>
                          }
                          value={filters?.mobile || ""}
                          onChange={(e) => handleFilterChange("mobile", e.currentTarget.value)}
                        />
                      ),

                      render: ({ mobile }) => <span>{mobile}</span>,
                    },
                    // del

                    {
                      accessor: "profession",
                      title: "Profession",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Profession..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("profession", "")}
                            ></ActionIcon>
                          }
                          value={filters?.profession || ""}
                          onChange={(e) => handleFilterChange("profession", e.currentTarget.value)}
                        />
                      ),

                      render: ({ profession }) => <span>{profession}</span>,
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
                  paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
                />
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
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
                <strong className="ltr:mr-1 rtl:ml-1">{showAlert.charAt(0).toUpperCase() + showAlert.slice(1)}!</strong>
                {showAlert === "success" && "EMPLOYEE registered successfully."}
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
                <h6 className="mb-5 text-lg font-bold">{isEditMode ? "UPDATE EMPLOYEE" : "ADD NEW EMPLOYEE"}</h6>
                {/* =================================== PERSONAL INFORMATION =================================== */}

                <div className="flex flex-col sm:flex-row">
                  <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4 flex justify-center">
                    <img
                      src="/assets//images/profile-34.jpeg"
                      alt="img"
                      className="h-20 w-20 rounded-full object-cover md:h-32 md:w-32"
                    />
                  </div>

                  <div className="grid flex-1 grid-cols-1 gap-5 sm:grid-cols-2 p-4 bg-yellow-50 dark:border-[#191e3a] dark:bg-black">
                    {/* EMPLOYEE NAME IN ENGLISH */}
                    <div>
                      <label htmlFor="name">Name (English)</label>
                      <div className="relative">
                        <input
                          id="full_name_english"
                          type="text"
                          className={`form-input pr-7 ${errors.full_name_english ? "border-red-500" : ""}`}
                          placeholder="Name"
                          {...register("full_name_english")}
                        />
                        {errors.full_name_english && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.full_name_english && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.full_name_english.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PROFILE TYPE */}

                    <div>
                      <label htmlFor="profile_type">Profile Type</label>
                      <div className="relative">
                        <select
                          id="profile_type"
                          className={`form-select ${errors.profile_type ? "border-red-500" : ""}`}
                          {...register("profile_type")}
                        >
                          <option value="">Select Profile Type</option>
                          <option value="Full-Time">Full-Time</option>
                          <option value="Part-Time">Part-Time</option>
                          <option value="Contractor">Contract</option>
                        </select>
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

                    {/* COMPANY NAME */}

                    <div className="form-group">
                      <label htmlFor="iban-code" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                        Company
                      </label>
                      <div className="relative">
                        <select
                          id="company_id"
                          name="company_id"
                          {...register("company_id")}
                          className={`form-input flex-1 ${errors.company_id ? "border-red-500" : ""}`}
                        >
                          <option value="">Choose Company</option>
                          {Array.isArray(companies) &&
                            companies.map((company) => (
                              <option key={company.id} value={company.id}>
                                {company.company_name || "Unnamed Company"}
                              </option>
                            ))}
                        </select>
                        {errors.company_id && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.company_id && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {String(errors.company_id.message)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* BRANCH NAME */}

                    <div className="form-group">
                      <label htmlFor="iban-code" className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2">
                        Current Branch
                      </label>
                      <div className="relative">
                        <select
                          id="branch_id"
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

                    {/* PREFERRED LANGUAGE */}

                    <div>
                      <label htmlFor="preferred_language">Preferred Language</label>
                      <div className="relative">
                        <select
                          id="preferred_language"
                          className={`form-select ${errors.preferred_language ? "border-red-500" : ""}`}
                          {...register("preferred_language")}
                        >
                          <option value="">Select Language</option>
                          <option value="Individual">English</option>
                          <option value="Business">Hindi</option>
                          <option value="Professional">Urdu</option>
                          <option value="Enterprise">Arabic</option>
                        </select>
                        {errors.preferred_language && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.preferred_language && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.preferred_language.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* NATIONALITY */}
                    <div>
                      <label htmlFor="nationality">Nationality</label>
                      <div className="relative">
                        <select
                          id="nationality"
                          className={`form-select ${errors.nationality ? "border-red-500" : ""}`}
                          {...register("nationality")}
                        >
                          <option value="">Select Nationality</option>
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

                    {/* GENDER */}
                    <div>
                      <label htmlFor="gender">Gender</label>
                      <div className="relative">
                        <select
                          id="gender"
                          className={`form-select ${errors.gender ? "border-red-500" : ""}`}
                          {...register("gender")}
                        >
                          <option value="">Select Gender</option>
                          <option>Male</option>
                          <option>Female</option>
                          <option>Other</option>
                        </select>
                        {errors.gender && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.gender && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.gender.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* HOME PHONE */}

                    <div>
                      <label htmlFor="home_phone">Home Phone</label>
                      <div className="relative">
                        <input
                          id="home_phone"
                          type="text"
                          className={`form-input pr-7 ${errors.home_phone ? "border-red-500" : ""}`}
                          placeholder="Enter your home phone"
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
                      <label htmlFor="identity_card_no">Identity Card Number</label>
                      <div className="relative">
                        <input
                          id="identity_card_no"
                          type="text"
                          placeholder="Identity Card Number"
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
                      <label htmlFor="identity_issued_date">Identity Issued Date</label>
                      <div className="relative">
                        <input
                          id="identity_issued_date"
                          type="date"
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
                      <label htmlFor="identity_expiry_date">Identity Expiry Date</label>
                      <div className="relative">
                        <input
                          id="identity_issued_date"
                          type="date"
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
                      <label htmlFor="mobile">Mobile Number</label>
                      <div className="relative">
                        <input
                          id="mobile"
                          type="tel"
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

                    {/* =================================== DOCUMENT INFORMATION  =================================== */}

                    {/* STATUS */}
                    <div>
                      <label htmlFor="status">Status</label>
                      <div className="relative">
                        <select
                          id="status"
                          className={`form-select ${errors.status ? "border-red-500" : ""}`}
                          {...register("status")}
                        >
                          <option value="">Select Status</option>
                          <option value="Active">Active</option>
                          <option value="In active">In-Active</option>
                        </select>
                        {errors.status && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.status && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.status.message}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* =================================== CONTACT INFORMATION  =================================== */}

                    {/* MOTHER NAME */}

                    <div>
                      <label htmlFor="mother_name">Mother Name</label>
                      <div className="relative">
                        <input
                          id="mother_name"
                          type="tel"
                          placeholder="+1 (530) 555-1212"
                          className={`form-input pr-7 ${errors.mother_name ? "border-red-500" : ""}`}
                          {...register("mother_name")}
                        />
                        {errors.mother_name && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.mother_name && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.mother_name.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PROFESSION TITLE*/}
                    <div>
                      <label htmlFor="profession">Profession</label>
                      <div className="relative">
                        <input
                          id="profession"
                          type="text"
                          className={`form-input pr-7 ${errors.email_address ? "border-red-500" : ""}`}
                          placeholder="Enter your profession name"
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

                    {/* DATE OF BIRTH */}

                    <div>
                      <label htmlFor="date_of_birth">Date of Birth</label>
                      <div className="relative">
                        <input
                          id="date_of_birth"
                          type="date"
                          placeholder="DOB"
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
                      <label htmlFor="place_of_birth">Place of Birth</label>
                      <div className="relative">
                        <input
                          id="place_of_birth"
                          type="text"
                          placeholder="Place of birth"
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

                    {/* MONTHLY SALARY */}
                    <div>
                      <label htmlFor="monthly_salary">Monthly Salary</label>
                      <div className="relative">
                        <input
                          id="monthly_salary"
                          type="text"
                          className={`form-input pr-7 ${errors.email_address ? "border-red-500" : ""}`}
                          placeholder="Enter your monthly salary"
                          {...register("monthly_salary")}
                        />
                        {errors.email_address && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.monthly_salary && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.monthly_salary.message}
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

                    {/* WORK PHONE */}

                    <div>
                      <label htmlFor="work_phone">Work Phone</label>
                      <div className="relative">
                        <input
                          id="work_phone"
                          type="text"
                          className={`form-input pr-7 ${errors.work_phone ? "border-red-500" : ""}`}
                          placeholder="Enter your work phone"
                          {...register("work_phone")}
                        />
                        {errors.work_phone && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.work_phone && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.work_phone.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* HOME ADDRESS */}

                    <div>
                      <label htmlFor="home_address">Home Address</label>
                      <div className="relative">
                        <input
                          id="home_address"
                          type="text"
                          className={`form-input pr-7 ${errors.work_address ? "border-red-500" : ""}`}
                          placeholder="Enter your home address"
                          {...register("home_address")}
                        />
                        {errors.home_address && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.home_address && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.home_address.message}
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

                    {/* CATEGORY */}

                    <div className="">
                      <label htmlFor="category" className="block font-bold text-gray-700">
                        Category
                      </label>
                      <div
                        className={`relative w-full grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-x-2 gap-y-3 px-3 py-4 min-h-[200px] border rounded-lg bg-white shadow-sm ${
                          errors.category ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        {categories.map((label, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <input
                              id={`category-${index}`}
                              type="checkbox"
                              value={label}
                              {...register("category")}
                              className="form-checkbox h-4 w-4 md:h-5 md:w-5 text-blue-600"
                            />
                            <label
                              htmlFor={`category-${index}`}
                              className="text-gray-700 text-xs md:text-sm truncate cursor-pointer"
                            >
                              {label}
                            </label>
                          </div>
                        ))}
                        {errors.category && (
                          <div className="absolute top-3 right-3">
                            <FaExclamationCircle className="text-red-500" style={{ fontSize: "calc(1em + 5px)" }} />
                          </div>
                        )}
                      </div>
                      {errors.category && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.category.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* P.O. BOX */}

                    <div>
                      <label htmlFor="p_o_box">P.O. Box</label>
                      <div className="relative">
                        <input
                          id="p_o_box"
                          type="text"
                          className={`form-input pr-7 ${errors.p_o_box ? "border-red-500" : ""}`}
                          placeholder="Enter P.O. Box number"
                          {...register("p_o_box")}
                        />
                        {errors.p_o_box && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.p_o_box && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.p_o_box.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* =================================== PREFERENCES AND SETTINGS  =================================== */}

                    {/* SAVE BUTTON */}
                    <div className="mt-3 mb-3 flex justify-end sm:col-span-2 gap-2">
                      <button
                        type="button"
                        onClick={onCLickAdd}
                        className="btn btn-danger rounded-full text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
                      >
                        <IconXCircle className="shrink-0 w-4 h-4 md:w-5 md:h-5 ltr:mr-1 rtl:ml-1 md:ltr:mr-2 md:rtl:ml-2" />
                        Close
                      </button>

                      <button
                        type="button"
                        className="btn btn-success rounded-full text-sm md:text-base px-3 py-2 md:px-4 md:py-2"
                        onClick={handleSubmit(handleEmployeeSubmit)}
                      >
                        {loadingForm ? (
                          <ButtonLoader />
                        ) : (
                          <>
                            <IconSave className="shrink-0 w-4 h-4 md:w-5 md:h-5 ltr:mr-1 rtl:ml-1 md:ltr:mr-2 md:rtl:ml-2" />
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
  )
}

export default ComponentsUsersAccountSettingsTabs
