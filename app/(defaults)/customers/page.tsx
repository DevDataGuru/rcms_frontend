"use client"
import IconSave from "@/components/icon/icon-save"
import { yupResolver } from "@hookform/resolvers/yup"
import { useState, useCallback, useEffect, useMemo } from "react"
import { useDropzone } from "react-dropzone"
import { useForm } from "react-hook-form"
import { FaEdit, FaExclamationCircle, FaTrash } from "react-icons/fa"
import { DataTable, type DataTableSortStatus } from "mantine-datatable"
import * as yup from "yup"
import IconXCircle from "@/components/icon/icon-x-circle"
import Link from "next/link"
import IconPlus from "@/components/icon/icon-plus"
import { deleteCustomer, getCustomers, saveCustomers, updateCustomers } from "@/services/customers"
import ButtonLoader from "@/components/button-loader"
import { getBranches } from "@/services/branchService"
import { getFolder } from "@/services/folders"
import { jwtDecode } from "jwt-decode"
import Swal from "sweetalert2"
import { sortData, toISO } from "@/utils/sortingHelper"
import { format } from "date-fns"
import { ActionIcon, TextInput } from "@mantine/core"

const ComponentsUsersAccountSettingsTabs = () => {
  // ======================= A: STATE MANAGEMENT =========================

  // 1. REACT HOOKS FOR GLOBAL AND LOCAL STATE
  const [customers, setCustomers] = useState([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [reloadRecord, setReload] = useState(false)
  const [loading, setLoading] = useState(false)
  const [alert, setAlert] = useState(null)
  const [showUserForm, setUserForm] = useState(false)
  const [page, setPage] = useState(1)
  const [updateId, setUpdateId] = useState(null)
  const [error, setError] = useState(null)
  const [loadingForm, setLoadingForm] = useState(false)
  const [branches, setBranches] = useState([])
  const [companies, setCompanies] = useState([])
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
    full_name: "",
    full_name_local: "",
    branch_id: "",
    company_id: "",
    email_address: "",
    mobile: "",
    profile_category: "",
    profile_type: "",
    vip: "",
    nationality: "",
    inactivity_status: "",
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
    profile_category: yup.string().required("Profile category is required"),
    full_name: yup.string().required("English name is required"),
    full_name_local: yup.string().required("Arabic name is required"),
    prefered_language: yup.string().optional(),
    unified_number: yup.string().optional(),
    identity_card_no: yup.string().optional(),
    Genger: yup.string().required("Gender is required"),
    id_issue_date: yup.string().optional(),
    nationality: yup.string().required("Nationality is required"),
    id_expiry_date: yup.string().optional(),
    date_of_birth: yup.string().required("Date of birth is required"),
    visit_visa_no: yup.string().optional(),
    place_of_birth: yup.string().optional(),
    phone: yup.string().optional(),
    driving_license_number: yup.string().required("Driving license number is required"),
    driving_license_issued_by: yup.string().required("Driving license issued by is required"),
    driving_license_issued_date: yup.string().required("Driving license issued date is required"),
    driving_license_expiry: yup.string().required("License expiry date is required"),
    home_address: yup.string().required("Home address is required"),
    home_phone: yup.string().optional(),
    po_box_no: yup.string().optional(),
    work_address: yup.string().optional(),
    Profession: yup.string().optional(),
    work_phone: yup.string().optional(),
    mobile_no: yup.string().required("Mobile number is required"),
    email_address: yup.string().optional(),
    passport_no: yup.string().optional(),
    passport_issue_date: yup.string().optional(),
    passport_expiry_date: yup.string().optional(),
    mother_name: yup.string().optional(),
    vip: yup.boolean().optional(),
    marketing_preferences: yup.array().of(yup.string()).default([]),
    tax_treatment: yup.string().optional(),
    source_of_supply: yup.string().required("Source of supply is required"),
    exclude_from_bulk_sms: yup.string().optional(),
    exclude_from_automated_sms: yup.string().optional(),
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

  // 3. FETCH CUSTOMERS
  useEffect(() => {
    const fetchCustomers = async () => {
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

        const result = await getCustomers(queryParams)

        if (result && result.data && result.data.records) {
          setCustomers(result.data.records)
          setTotalRecords(result.data.totalCount)
        } else {
          setCustomers([])
          setTotalRecords(0)
        }
      } catch (err) {
        console.error("Error:", err)
        setError("Failed to fetch customers")
        setCustomers([])
        setTotalRecords(0)
      } finally {
        setLoading(false)
      }
    }

    fetchCustomers()
  }, [page, pageSize, reloadRecord, sortStatus, filters])

  // ======================= F: EVENT HANDLERS =========================

  // 1. TOGGLE USER FORM VISIBILITY
  const onCLickAdd = () => {
    setIsEditMode(false) // Reset edit mode
    setAlert(null)
    setUserForm(!showUserForm)
    setUpdateId(null)
    setIsEditMode(false)
    reset()
  }

  // 2. FORM SUBMISSION HANDLER
  const handleSubmitData = async (formData) => {
    // console.log("Fom", { formData });
    // return;
    setIsEditMode(false) // Reset edit mode
    setLoading(true)
    setLoadingForm(true)
    // reset();
    try {
      const userToken = localStorage.getItem("user")
      const decodedData = jwtDecode(userToken)
      // Map the form data to match your backend DTO
      const customerData = {
        // userId: decodedData?.sub,
        branch_id: Number.parseInt(formData.branch_id),
        company_id: Number.parseInt(formData.company_id),
        // profile_image: formData.profile_image,
        profile_type: formData.profile_type,
        profile_category: formData.profile_category,
        full_name: formData.full_name,
        full_name_local: formData.full_name_local,
        prefered_language: formData.prefered_language,
        unified_number: formData.unified_number,
        identity_card_no: formData.identity_card_no.toString(),
        Genger: formData.Genger,
        id_issue_date: toISO(formData.id_issue_date),
        nationality: formData.nationality,
        id_expiry_date: toISO(formData.id_expiry_date),
        date_of_birth: toISO(formData.date_of_birth),
        visit_visa_no: formData.visit_visa_no,
        place_of_birth: formData.place_of_birth,
        phone: formData.phone,
        driving_license_number: formData.driving_license_number,
        driving_license_issued_by: formData.driving_license_issued_by,
        driving_license_issued_date: toISO(formData.driving_license_issued_date),
        driving_license_expiry: toISO(formData.driving_license_expiry),
        home_address: formData.home_address,
        home_phone: formData.home_phone,
        po_box_no: formData.po_box_no,
        work_address: formData.work_address,
        Profession: formData.Profession,
        work_phone: formData.work_phone,
        mobile_no: formData.mobile_no,
        email_address: formData.email_address,
        passport_no: formData.passport_no,
        passport_issue_date: toISO(formData.passport_issue_date),
        passport_expiry_date: toISO(formData.passport_expiry_date),
        mother_name: formData.mother_name,
        vip: formData.vip,
        marketing_preferences: formData.marketing_preferences || [],
        tax_treatment: formData.tax_treatment,
        source_of_supply: formData.source_of_supply,
      }

      let result
      if (updateId) {
        result = await updateCustomers(updateId, customerData)
        setAlert({
          type: "success",
          message: "Customer updated successfully.",
        })
      } else {
        result = await saveCustomers(customerData, decodedData?.sub)
        setAlert({
          type: "success",
          message: "Customer registered successfully.",
        })
      }

      if (result) {
        // setAlert("success");
        reset()
        setUserForm(false)
        setUpdateId(null)
        setIsEditMode(false) // Reset edit mode
        handleReload() // Refresh the list
      }
    } catch (error) {
      console.error("Save/Update customer error:", error)
      // setAlert("error");
    } finally {
      setLoading(false)
      setLoadingForm(false)
    }
  }

  // 3. DELETE HANDLER
  const handleDelete = async (userId) => {
    try {
      const response = await deleteCustomer(userId)
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

  // 2. SORT DATA
  const dataMap = {
    branch_id: branches.map((brh) => ({ id: brh.id, name: brh.name })),
    company_id: companies.map((comp) => ({
      id: comp.id,
      name: comp.company_name,
    })),
  }

  // Custom hook or useMemo for sorted data
  const sortedData = useMemo(() => {
    return sortData(customers, sortStatus, dataMap)
  }, [customers, sortStatus, branches, companies])

  // Auto-dismiss logic
  useEffect(() => {
    if (alert) {
      const timer = setTimeout(() => {
        setAlert(null) // Dismiss the alert after 3 seconds
      }, 3000)

      // Cleanup the timeout if the component unmounts or showAlert changes
      return () => clearTimeout(timer)
    }
  }, [alert])
  // ======================= H: FORM CONFIGURATION =========================

  const {
    register,
    reset,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      marketing_preferences: [], // Initialize as empty array
    },
  })

  const handleUpdateFormOpen = (id: number) => {
    // console.log()
    setIsEditMode(true)
    const customerData = customers.find((customer) => customer.id === id)
    if (!customerData) {
      setAlert({
        type: "error",
        message: "Data not found.",
      })
      return
    }
    setIsEditMode(true)
    reset()

    console.log(customerData.id_issue_date)
    setValue("full_name", customerData.full_name)
    setValue("full_name_local", customerData.full_name_local)
    setValue("branch_id", customerData.branch_id)
    setValue("company_id", customerData.company_id)
    // setValue("profile_image", customerData.profile_image);
    setValue("profile_type", customerData.profile_type)
    setValue("profile_category", customerData.profile_category)
    setValue("full_name", customerData.full_name)
    setValue("full_name_local", customerData.full_name_local)
    setValue("prefered_language", customerData.prefered_language || "") // Default to empty string
    setValue("unified_number", customerData.unified_number || "")
    setValue("identity_card_no", customerData.identity_card_no.toString())
    setValue("Genger", customerData.Genger)
    setValue("id_issue_date", format(customerData.id_issue_date, "yyyy-MM-dd"))
    setValue("nationality", customerData.nationality)
    setValue("identity_card_no", customerData.identity_card_no)
    setValue("passport_no", customerData.passport_no)
    setValue("passport_expiry_date", format(customerData.passport_expiry_date, "yyyy-MM-dd"))
    setValue("driving_license_number", customerData.driving_license_number)
    setValue("Genger", customerData.Genger)
    setValue("date_of_birth", format(customerData.date_of_birth, "yyyy-MM-dd"))
    setValue("place_of_birth", customerData.place_of_birth)
    setValue("unified_number", customerData.unified_number)
    setValue("mobile_no", customerData.mobile_no)
    setValue("phone", customerData.phone)
    setValue("visit_visa_no", customerData.visit_visa_no)
    setValue("work_phone", customerData.work_phone)
    setValue("mother_name", customerData.mother_name)
    setValue("Profession", customerData.Profession)
    setValue("email_address", customerData.email_address)
    setValue("driving_license_issued_by", customerData.driving_license_issued_by)
    setValue("driving_license_expiry", format(customerData.driving_license_expiry, "yyyy-MM-dd"))
    setValue("home_address", customerData.home_address)
    setValue("home_phone", customerData.home_phone)
    setValue("po_box_no", customerData.po_box_no)
    setValue("work_address", customerData.work_address)
    setValue("Profession", customerData.Profession)
    setValue("work_phone", customerData.work_phone)
    setValue("mobile_no", customerData.mobile_no)
    setValue("email_address", customerData.email_address)
    setValue("passport_no", customerData.passport_no)
    setValue("passport_issue_date", format(customerData.passport_issue_date, "yyyy-MM-dd"))
    setValue("passport_expiry_date", format(customerData.passport_expiry_date, "yyyy-MM-dd"))
    setValue("mother_name", customerData.mother_name)
    setValue("vip", Boolean(customerData.vip)) // Convert to boolean
    setValue(
      "marketing_preferences",
      Array.isArray(customerData.marketing_preferences)
        ? customerData.marketing_preferences
        : customerData.marketing_preferences
          ? [customerData.marketing_preferences]
          : [],
    )
    setValue("tax_treatment", customerData.tax_treatment || "")
    setValue("source_of_supply", customerData.source_of_supply || "")
    setUserForm(true)
    setUpdateId(id)
  }

  const alertSwal = async (type: number, id: number) => {
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

  useEffect(() => {
    console.log(errors)
  }, [errors])

  return (
    <div className="pt-5">
      {/* ============================================================== ALERTS ============================================================== */}
      {!showUserForm ? (
        <>
          {alert?.type && (
            <div
              className={`flex items-center mx-4 sm:mx-8 md:mx-16 lg:mx-[500px] mb-4 p-3.5 rounded text-white ${
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

              <Link href="#" onClick={onCLickAdd} className="btn btn-primary gap-2 w-full sm:w-auto">
                <IconPlus />
                Create
              </Link>

              {/* <Link href="/apps/invoice/edit" className="btn btn-warning gap-2">
                <IconEdit />
                Edit
              </Link> */}
            </div>
            <div className="panel">
              <div className="overflow-x-auto mt-6">
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
                              e.preventDefault()
                              e.stopPropagation()
                              alertSwal(10, id)
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
                      title: "Customer ID",
                      sortable: true,
                      render: ({ id }) => (
                        <strong className="flex justify-center  text-info pointer-cursor">{id}</strong>
                      ),
                    },
                    {
                      accessor: "full_name",
                      title: "English Name",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search full name..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("full_name", "")}
                            ></ActionIcon>
                          }
                          value={filters?.full_name || ""}
                          onChange={(e) => handleFilterChange("id", Number(e.currentTarget.value))}
                          className="w-full"
                        />
                      ),
                    },
                    {
                      accessor: "full_name_local",
                      title: "Arabic Name",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search full  name local..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("full_name_local", "")}
                            ></ActionIcon>
                          }
                          value={filters?.full_name_local || ""}
                          onChange={(e) => handleFilterChange("full_name_local", e.currentTarget.value)}
                        />
                      ),
                    },
                    {
                      accessor: "branch_id",
                      title: "Branch Name",
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
                          onChange={(e) => handleFilterChange("id", e.currentTarget.value)}
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
                      accessor: "email_address",
                      title: "Email",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search Email..."
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
                    },
                    {
                      accessor: "mobile",
                      title: "Mobile",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search mobile..."
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
                    },

                    {
                      accessor: "profile_category",
                      title: "Profile Category",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search profile_category..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("profile_category", "")}
                            ></ActionIcon>
                          }
                          value={filters?.profile_category || ""}
                          onChange={(e) => handleFilterChange("profile_category", e.currentTarget.value)}
                        />
                      ),
                    },
                    {
                      accessor: "profile_type",
                      title: "Profile Type",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search profile_type..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("profile_type", "")}
                            ></ActionIcon>
                          }
                          value={filters?.profile_type || ""}
                          onChange={(e) => handleFilterChange("profile_type", e.currentTarget.value)}
                        />
                      ),
                    },
                    {
                      accessor: "vip",
                      title: "VIP Status",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search vip..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("vip", "")}
                            ></ActionIcon>
                          }
                          value={filters?.vip || ""}
                          onChange={(e) => handleFilterChange("id", e.currentTarget.value)}
                        />
                      ),

                      render: ({ vip }) => (
                        <span className={`badge ${vip ? "bg-success" : "bg-secondary"} rounded-full`}>
                          {vip ? "VIP" : "Regular"}
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
                          placeholder="Search nationality..."
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
                    },
                    {
                      accessor: "inactivity_status",
                      title: "Status",
                      sortable: true,
                      filter: (
                        <TextInput
                          // label="Id"
                          placeholder="Search inactivity_status..."
                          rightSection={
                            <ActionIcon
                              className="text-[#0a0a0a]"
                              size="sm"
                              variant="transparent"
                              c="dimmed"
                              onClick={() => handleFilterChange("inactivity_status", "")}
                            ></ActionIcon>
                          }
                          value={filters?.inactivity_status || ""}
                          onChange={(e) => handleFilterChange("inactivity_status", e.currentTarget.value)}
                        />
                      ),

                      render: ({ inactivity_status }) => (
                        <span className={`badge bg-${!inactivity_status ? "success" : "danger"} rounded-full`}>
                          {inactivity_status ? "Inactive" : "Active"}
                        </span>
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
                  // loading={loading} // Add loading state
                  paginationText={({ from, to, totalRecords }) => `Showing ${from} to ${to} of ${totalRecords} entries`}
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
                <h6 className="mb-5 text-lg font-bold">{isEditMode ? "UPDATE CUSTOMER" : "ADD NEW CUSTOMER"}</h6>
                {/* =================================== PERSONAL INFORMATION =================================== */}

                <div className="flex flex-col sm:flex-row">
                  <div className="mb-5 w-full sm:w-2/12 ltr:sm:mr-4 rtl:sm:ml-4 flex justify-center sm:block">
                    <img
                      src="/assets//images/profile-34.jpeg"
                      alt="img"
                      className="h-20 w-20 rounded-full object-cover md:h-32 md:w-32"
                    />
                  </div>
                  <div className="grid flex-1 grid-cols-1 sm:grid-cols-2 gap-5 p-4 bg-yellow-50 dark:border-[#191e3a] dark:bg-black">
                    {/* EMPLOYEE NAME IN ENGLISH */}
                    <div>
                      <label htmlFor="name">Name (English)</label>
                      <div className="relative">
                        <input
                          id="full_name"
                          type="text"
                          className={`form-input pr-7 ${errors.full_name ? "border-red-500" : ""}`}
                          placeholder="Name"
                          {...register("full_name")}
                        />
                        {errors.full_name && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.full_name && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.full_name.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* EMPLOYEE NAME IN ARABIC */}
                    <div>
                      <label htmlFor="full_name_local">Name (Arabic)</label>
                      <div className="relative">
                        <input
                          id="name"
                          type="text"
                          placeholder="Full Name"
                          className={`form-input pr-7 ${errors.full_name_local ? "border-red-500" : ""}`}
                          {...register("full_name_local")}
                        />
                        {errors.full_name_local && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.full_name_local && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.full_name_local.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PROFILE TYPE */}

                    <div>
                      <label htmlFor="profile_category">Profile Type</label>
                      <div className="relative">
                        <select
                          id="profile_category"
                          className={`form-select ${errors.profile_type ? "border-red-500" : ""}`}
                          {...register("profile_type")}
                        >
                          <option value="">Select Profile Type</option>
                          <option value="Individual">Customer</option>
                          <option value="Business">Customer2</option>
                          <option value="Professional">Customer2</option>
                          <option value="Enterprise">Customer2</option>
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

                    {/* PROFILE CATEGORY */}

                    <div>
                      <label htmlFor="profile_category">Profile Category</label>
                      <div className="relative">
                        <select
                          id="profile_category"
                          className={`form-select ${errors.profile_category ? "border-red-500" : ""}`}
                          {...register("profile_category")}
                        >
                          <option value="">Select Profile Category</option>
                          <option value="Individual">Individual</option>
                          <option value="Business">Business</option>
                          <option value="Professional">Professional</option>
                          <option value="Enterprise">Enterprise</option>
                        </select>
                        {errors.profile_category && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.profile_category && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.profile_category.message}
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

                    {/* PREFERRED LANGUAGE */}

                    <div>
                      <label htmlFor="prefered_language">Preferred Language</label>
                      <div className="relative">
                        <select
                          id="prefered_language"
                          className={`form-select ${errors.prefered_language ? "border-red-500" : ""}`}
                          {...register("prefered_language")}
                        >
                          <option value="">Select Language</option>
                          <option value="Individual">English</option>
                          <option value="Business">Hindi</option>
                          <option value="Professional">Urdu</option>
                          <option value="Enterprise">Arabic</option>
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
                            {errors.prefered_language.message}
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
                      <label htmlFor="genger">Gender</label>
                      <div className="relative">
                        <select
                          id="Genger"
                          className={`form-select ${errors.Genger ? "border-red-500" : ""}`}
                          {...register("Genger")}
                        >
                          <option value="">Select Gender</option>
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                        {errors.Genger && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.Genger && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.Genger.message}
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
                      <label htmlFor="id_issue_date">Identity Issued Date</label>
                      <div className="relative">
                        <input
                          id="id_issue_date"
                          type="date"
                          className={`form-input pr-7 ${errors.id_issue_date ? "border-red-500" : ""}`}
                          {...register("id_issue_date")}
                        />
                        {errors.id_issue_date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.id_issue_date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.id_issue_date.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* IDENTITY CARD EXPIRY DATE */}

                    <div>
                      <label htmlFor="id_expiry_date">Identity Expiry Date</label>
                      <div className="relative">
                        <input
                          id="id_expiry_date"
                          type="date"
                          className={`form-input pr-7 ${errors.id_expiry_date ? "border-red-500" : ""}`}
                          {...register("id_expiry_date")}
                        />
                        {errors.id_expiry_date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.id_expiry_date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.id_expiry_date.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* MOBILE NUMBER */}

                    <div>
                      <label htmlFor="mobile_no">Mobile Number</label>
                      <div className="relative">
                        <input
                          id="mobile_no"
                          type="tel"
                          placeholder="+1 (530) 555-1212"
                          className={`form-input pr-7 ${errors.mobile_no ? "border-red-500" : ""}`}
                          {...register("mobile_no")}
                        />
                        {errors.mobile_no && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.mobile_no && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.mobile_no.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PHONE NUMBER */}

                    <div>
                      <label htmlFor="phone">Phone Number</label>
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
                      <label htmlFor="unified_number">Unified Number</label>
                      <div className="relative">
                        <input
                          id="unified_number"
                          type="tel"
                          placeholder="+1 (530) 555-1212"
                          className={`form-input pr-7 ${errors.unified_number ? "border-red-500" : ""}`}
                          {...register("unified_number")}
                        />
                        {errors.unified_number && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.unified_number && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.unified_number.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* VISIT VISA NUMBER */}

                    <div>
                      <label htmlFor="visit_visa_no">Visit Visa Number</label>
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
                      <label htmlFor="date_of_birth">Date of Birth</label>
                      <div className="relative">
                        <input
                          id="date_of_birth"
                          type="date"
                          placeholder="Date of birth"
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
                      <label htmlFor="passport_no">Passport Number</label>
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
                      <label htmlFor="passport_issue_date">Passport Issued Date</label>
                      <div className="relative">
                        <input
                          id="passport_issue_date"
                          type="date"
                          className={`form-input pr-7 ${errors.passport_issue_date ? "border-red-500" : ""}`}
                          {...register("passport_issue_date")}
                        />
                        {errors.passport_issue_date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.passport_issue_date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.passport_issue_date.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* PASSPORT EXPIRY DATE */}

                    <div>
                      <label htmlFor="passport_expiry_date">Passport Expiry Date</label>
                      <div className="relative">
                        <input
                          id="passport_expiry_date"
                          type="date"
                          className={`form-input pr-7 ${errors.passport_expiry_date ? "border-red-500" : ""}`}
                          {...register("passport_expiry_date")}
                        />
                        {errors.passport_expiry_date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.passport_expiry_date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.passport_expiry_date.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DRIVING LICENSE NUMBER ISSUED BY */}

                    <div>
                      <label htmlFor="driving_license_issued_by">Driving License Issued By</label>
                      <div className="relative">
                        <input
                          id="driving_license_issued_by"
                          type="text"
                          placeholder="Driving driving_license_issued_by Number"
                          className={`form-input pr-7 ${errors.driving_license_number ? "border-red-500" : ""}`}
                          {...register("driving_license_issued_by")}
                        />
                        {errors.driving_license_issued_by && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.driving_license_issued_by && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.driving_license_issued_by.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DRIVING LICENSE NUMBER */}

                    <div>
                      <label htmlFor="driving_license_number">Driving License Number</label>
                      <div className="relative">
                        <input
                          id="driving_license_number"
                          type="text"
                          placeholder="Driving License Number"
                          className={`form-input pr-7 ${errors.driving_license_number ? "border-red-500" : ""}`}
                          {...register("driving_license_number")}
                        />
                        {errors.driving_license_number && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.driving_license_number && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.driving_license_number.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DRIVING LICENSE ISSUED DATE */}

                    <div>
                      <label htmlFor="driving_license_issued_date">Driving License Issued Date</label>
                      <div className="relative">
                        <input
                          id="driving_license_issued_date"
                          type="date"
                          className={`form-input pr-7 ${errors.driving_license_issued_date ? "border-red-500" : ""}`}
                          {...register("driving_license_issued_date")}
                        />
                        {errors.driving_license_issued_date && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.driving_license_issued_date && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.driving_license_issued_date.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* DRIVING LICENSE EXPIRY DATE */}

                    <div>
                      <label htmlFor="driving_license_expiry">Driving License Expiry Date</label>
                      <div className="relative">
                        <input
                          id="driving_license_expiry"
                          type="date"
                          className={`form-input pr-7 ${errors.driving_license_expiry ? "border-red-500" : ""}`}
                          {...register("driving_license_expiry")}
                        />
                        {errors.driving_license_expiry && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.driving_license_expiry && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.driving_license_expiry.message}
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
                      <label htmlFor="Profession">Profession</label>
                      <div className="relative">
                        <input
                          id="Profession"
                          type="text"
                          className={`form-input pr-7 ${errors.email_address ? "border-red-500" : ""}`}
                          placeholder="Enter your profession name"
                          {...register("Profession")}
                        />
                        {errors.Profession && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.Profession && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.Profession.message}
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

                    {/* =================================== ADDRESS INFORMATION  =================================== */}

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

                    {/* WORK ADDRESS */}

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

                    {/* P.O. BOX */}

                    <div>
                      <label htmlFor="po_box_no">P.O. Box</label>
                      <div className="relative">
                        <input
                          id="po_box_no"
                          type="text"
                          className={`form-input pr-7 ${errors.po_box_no ? "border-red-500" : ""}`}
                          placeholder="Enter P.O. Box number"
                          {...register("po_box_no")}
                        />
                        {errors.po_box_no && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.po_box_no && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.po_box_no.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* =================================== PREFERENCES AND SETTINGS  =================================== */}

                    {/* CATEGORY */}

                    <div>
                      <label htmlFor="vip">Category</label>
                      <div
                        className={`relative flex items-center space-x-2 px-3 py-2 border rounded-lg bg-white shadow-sm ${
                          errors.vip ? "border-red-500" : "border-gray-300"
                        }`}
                      >
                        <input
                          id="vip"
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600"
                          {...register("vip")}
                        />
                        <span className="text-gray-700">VIP</span> {/* Label inside the border */}
                        {errors.vip && (
                          <FaExclamationCircle
                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                            style={{ fontSize: "calc(1em + 5px)" }}
                          />
                        )}
                      </div>
                      {errors.vip && (
                        <div className="mt-2">
                          <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                            {errors.vip.message}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* MARKETING PREFERENCES */}

                    <div className="mt-2 space-y-2 border p-3 rounded-lg bg-white shadow-sm">
                      <div className="flex items-center space-x-3">
                        <input
                          id="exclude_bulk_sms"
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600"
                          {...register("marketing_preferences", {
                            setValueAs: (value) => {
                              const currentValue = getValues("marketing_preferences") || []
                              return value
                                ? [...currentValue, "exclude_bulk_sms"]
                                : currentValue.filter((v) => v !== "exclude_bulk_sms")
                            },
                          })}
                        />
                        <label htmlFor="exclude_bulk_sms" className="text-gray-700">
                          Exclude from Bulk SMS
                        </label>
                      </div>
                      <div className="flex items-center space-x-3">
                        <input
                          id="exclude_automated_sms"
                          type="checkbox"
                          className="form-checkbox h-5 w-5 text-blue-600"
                          {...register("marketing_preferences", {
                            setValueAs: (value) => {
                              const currentValue = getValues("marketing_preferences") || []
                              return value
                                ? [...currentValue, "exclude_automated_sms"]
                                : currentValue.filter((v) => v !== "exclude_automated_sms")
                            },
                          })}
                        />
                        <label htmlFor="exclude_automated_sms" className="text-gray-700">
                          Exclude from Automated SMS
                        </label>
                      </div>
                    </div>

                    {/* TAX SETTINGS */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700">TAX SETTINGS</label>
                      <div className="mt-2 flex flex-col sm:flex-row border rounded-lg bg-white p-4">
                        {/* TAX TREATMENT */}
                        <div className="w-full sm:w-[250px] mb-4 sm:mb-0 sm:mr-4">
                          <select
                            id="tax_treatment"
                            className={`form-select w-full mt-1 ${errors.tax_treatment ? "border-red-500" : ""}`}
                            {...register("tax_treatment")}
                          >
                            <option value="">Select Tax Treatment</option>
                            <option value="non_vat">Non VAT Registered</option>
                            <option value="vat_registered">VAT Registered</option>
                          </select>
                          <input
                            id="exclude_bulk_sms"
                            type="text"
                            className="form text-blue-600"
                            {...register("marketing_preferences")}
                          />
                        </div>

                        {/* SOURCE OF SUPPLY */}
                        <div className="w-full sm:w-[250px]">
                          <select
                            id="source_of_supply"
                            className={`form-select w-full mt-1 ${errors.source_of_supply ? "border-red-500" : ""}`}
                            {...register("source_of_supply")}
                          >
                            <option value="">Select Source of Supply</option>
                            <option value="ajman">Ajman</option>
                            <option value="hono_lulu">Hono Lulu</option>
                          </select>
                          <input
                            id="exclude_automated_sms"
                            type="text"
                            className="form text-blue-600"
                            {...register("marketing_preferences")}
                          />
                        </div>
                      </div>
                    </div>

                    {/* SAVE BUTTON */}
                    <div className="flex flex-col sm:flex-row justify-end items-center gap-y-2 sm:gap-x-2">
                      <button
                        type="button"
                        onClick={onCLickAdd}
                        className="btn btn-danger w-full sm:w-auto ltr:mr-3 rtl:ml-3 rounded-full mb-2 sm:mb-0"
                      >
                        <IconXCircle className="shrink-0 ltr:mr-2 rtl:ml-2" />
                        Close
                      </button>

                      <button
                        type="button"
                        className="btn btn-success w-full sm:w-auto ltr:mr-3 rtl:ml-3 rounded-full"
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
  )
}

export default ComponentsUsersAccountSettingsTabs
