"use client";
import IconPlus from "@/components/icon/icon-plus";
import Link from "next/link";
import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import IconXCircle from "@/components/icon/icon-x-circle";
import IconSave from "@/components/icon/icon-save";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { DataTable, DataTableSortStatus } from 'mantine-datatable';
import Select from 'react-select';
import sortBy from 'lodash/sortBy';
import ComponentUserRolePage from "@/components/users/user-role/component-user-role";
import { deleteUsers, getUsers, updateUsers } from "@/services/usersService";
import { registerUser } from "@/services/authService";
import { getBranches } from "@/services/branchService";
import { getRoleNames } from "@/services/userRolesService";
import { FaEdit, FaExclamationCircle, FaTrash } from "react-icons/fa";
import Swal from 'sweetalert2';
import ButtonLoader from "@/components/button-loader";


const Orders = () => {
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
    const [updateId, setUpdateId] = useState(null)
    const [selectedOptions, setSelectedOptions] = useState([]);

    const showUserRolePage = () => {
        setUserForm(false)
        setUserRole(!showUserRole);
    }
    const onCLickAdd = () => {
        setUpdateId(null);
        setUserRole(false)
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
                const result = await getUsers(`page=${page}&limit=${pageSize}`);
                if (result && result.data) {
                    setUsers(result.data);
                }
                return true;
            } else {
                return false
            }
        } catch (error) {

            console.error("Error deleting user:", error);
            return false
        }

    };
    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const result = await getUsers(`page=${page}&limit=${pageSize}`);
                if (result && result.data) {
                    setUsers(result.data);
                } else {
                    throw new Error("Invalid response structure");
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch users");
            }
        };
        fetchUsers();
    }, []);
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
                        usersRolesArray.push({ value: val?.id, label: val?.role },
                        );
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
                if (result && result.data) {
                    setBranches(result.data);
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
        setLoadingForm(true)
        try {
            let response
            if (updateId !== null) {
                response = await updateUsers(updateId, formData)
            }
            else {
                response = await registerUser(formData);
            }
            if (response) {
                response.data;
                setShowAlert("success");
                setTimeout(() => setShowAlert(null), 3000);
                reset();
                setUpdateId(null)
            } else {
                setShowAlert("error");
            }
        } catch (error) {
            console.error("Error registering user:", error);
            setShowAlert("error");
        }
        finally {
            setLoadingForm(false)
        }
    };
    const [schema, setSchema] = useState(null);
    // const schema = yup.object({
    //   first_name: yup.string().required("First name is Required"),
    //   last_name: yup.string().required("Last name is Required"),
    //   email: yup
    //     .string()
    //     .email("Email is not valid")
    //     .required("Email is Required"),
    //   username: yup.string().required("Username is Required"),
    //   prefered_language: yup.string().required("Language is Required"),
    //   phone_no: yup.string().required("Phone number is Required"),
    //   branch_id: yup.number().required("Current branch is Required"),
    //   role_id: yup.number().required("User role is Required"),
    //   password: yup
    //     .string()
    //     .required("Password is Required")
    //     .min(6, "Password must be at least 6 characters")
    //     .max(32, "Password must be at most 32 characters"),
    // });
    // }
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

            setSchema(schema1)
        }
        else {
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
    }, [updateId])
    const {
        register,
        reset,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    const rowData = [
        {
            id: 1,
            firstName: 'Caroline',
            lastName: 'Jensen',
            email: 'carolinejensen@zidant.com',
            dob: '2004-05-28',
            address: {
                street: '529 Scholes Street',
                city: 'Temperanceville',
                zipcode: 5235,
                geo: {
                    lat: 23.806115,
                    lng: 164.677197,
                },
            },
            phone: '+1 (821) 447-3782',
            isActive: true,
            age: 39,
            company: 'POLARAX',
        },
        {
            id: 2,
            firstName: 'Celeste',
            lastName: 'Grant',
            email: 'celestegrant@polarax.com',
            dob: '1989-11-19',
            address: {
                street: '639 Kimball Street',
                city: 'Bascom',
                zipcode: 8907,
                geo: {
                    lat: 65.954483,
                    lng: 98.906478,
                },
            },
            phone: '+1 (838) 515-3408',
            isActive: false,
            age: 32,
            company: 'MANGLO',
        },
        {
            id: 3,
            firstName: 'Tillman',
            lastName: 'Forbes',
            email: 'tillmanforbes@manglo.com',
            dob: '2016-09-05',
            address: {
                street: '240 Vandalia Avenue',
                city: 'Thynedale',
                zipcode: 8994,
                geo: {
                    lat: -34.949388,
                    lng: -82.958111,
                },
            },
            phone: '+1 (969) 496-2892',
            isActive: false,
            age: 26,
            company: 'APPLIDECK',
        },
        {
            id: 4,
            firstName: 'Daisy',
            lastName: 'Whitley',
            email: 'daisywhitley@applideck.com',
            dob: '1987-03-23',
            address: {
                street: '350 Pleasant Place',
                city: 'Idledale',
                zipcode: 9369,
                geo: {
                    lat: -54.458809,
                    lng: -127.476556,
                },
            },
            phone: '+1 (861) 564-2877',
            isActive: true,
            age: 21,
            company: 'VOLAX',
        },
        {
            id: 5,
            firstName: 'Weber',
            lastName: 'Bowman',
            email: 'weberbowman@volax.com',
            dob: '1983-02-24',
            address: {
                street: '154 Conway Street',
                city: 'Broadlands',
                zipcode: 8131,
                geo: {
                    lat: 54.501351,
                    lng: -167.47138,
                },
            },
            phone: '+1 (962) 466-3483',
            isActive: false,
            age: 26,
            company: 'ORBAXTER',
        },
        {
            id: 6,
            firstName: 'Buckley',
            lastName: 'Townsend',
            email: 'buckleytownsend@orbaxter.com',
            dob: '2011-05-29',
            address: {
                street: '131 Guernsey Street',
                city: 'Vallonia',
                zipcode: 6779,
                geo: {
                    lat: -2.681655,
                    lng: 3.528942,
                },
            },
            phone: '+1 (884) 595-2643',
            isActive: true,
            age: 40,
            company: 'OPPORTECH',
        },
        {
            id: 7,
            firstName: 'Latoya',
            lastName: 'Bradshaw',
            email: 'latoyabradshaw@opportech.com',
            dob: '2010-11-23',
            address: {
                street: '668 Lenox Road',
                city: 'Lowgap',
                zipcode: 992,
                geo: {
                    lat: 36.026423,
                    lng: 130.412198,
                },
            },
            phone: '+1 (906) 474-3155',
            isActive: true,
            age: 24,
            company: 'GORGANIC',
        },
        {
            id: 8,
            firstName: 'Kate',
            lastName: 'Lindsay',
            email: 'katelindsay@gorganic.com',
            dob: '1987-07-02',
            address: {
                street: '773 Harrison Avenue',
                city: 'Carlton',
                zipcode: 5909,
                geo: {
                    lat: 42.464724,
                    lng: -12.948403,
                },
            },
            phone: '+1 (930) 546-2952',
            isActive: true,
            age: 24,
            company: 'AVIT',
        },
        {
            id: 9,
            firstName: 'Marva',
            lastName: 'Sandoval',
            email: 'marvasandoval@avit.com',
            dob: '2010-11-02',
            address: {
                street: '200 Malta Street',
                city: 'Tuskahoma',
                zipcode: 1292,
                geo: {
                    lat: -52.206169,
                    lng: 74.19452,
                },
            },
            phone: '+1 (927) 566-3600',
            isActive: false,
            age: 28,
            company: 'QUILCH',
        },
        {
            id: 10,
            firstName: 'Decker',
            lastName: 'Russell',
            email: 'deckerrussell@quilch.com',
            dob: '1994-04-21',
            address: {
                street: '708 Bath Avenue',
                city: 'Coultervillle',
                zipcode: 1268,
                geo: {
                    lat: -41.550295,
                    lng: -146.598075,
                },
            },
            phone: '+1 (846) 535-3283',
            isActive: false,
            age: 27,
            company: 'MEMORA',
        },
        {
            id: 11,
            firstName: 'Odom',
            lastName: 'Mills',
            email: 'odommills@memora.com',
            dob: '2010-01-24',
            address: {
                street: '907 Blake Avenue',
                city: 'Churchill',
                zipcode: 4400,
                geo: {
                    lat: -56.061694,
                    lng: -130.238523,
                },
            },
            phone: '+1 (995) 525-3402',
            isActive: true,
            age: 34,
            company: 'ZORROMOP',
        },
        {
            id: 12,
            firstName: 'Sellers',
            lastName: 'Walters',
            email: 'sellerswalters@zorromop.com',
            dob: '1975-11-12',
            address: {
                street: '978 Oakland Place',
                city: 'Gloucester',
                zipcode: 3802,
                geo: {
                    lat: 11.732587,
                    lng: 96.118099,
                },
            },
            phone: '+1 (830) 430-3157',
            isActive: true,
            age: 28,
            company: 'ORBOID',
        },
        {
            id: 13,
            firstName: 'Wendi',
            lastName: 'Powers',
            email: 'wendipowers@orboid.com',
            dob: '1979-06-02',
            address: {
                street: '376 Greenpoint Avenue',
                city: 'Elliott',
                zipcode: 9149,
                geo: {
                    lat: -78.159578,
                    lng: -9.835103,
                },
            },
            phone: '+1 (863) 457-2088',
            isActive: true,
            age: 31,
            company: 'SNORUS',
        },
        {
            id: 14,
            firstName: 'Sophie',
            lastName: 'Horn',
            email: 'sophiehorn@snorus.com',
            dob: '2018-09-20',
            address: {
                street: '343 Doughty Street',
                city: 'Homestead',
                zipcode: 330,
                geo: {
                    lat: 65.484087,
                    lng: 137.413998,
                },
            },
            phone: '+1 (885) 418-3948',
            isActive: true,
            age: 22,
            company: 'XTH',
        },
        {
            id: 15,
            firstName: 'Levine',
            lastName: 'Rodriquez',
            email: 'levinerodriquez@xth.com',
            dob: '1973-02-08',
            address: {
                street: '643 Allen Avenue',
                city: 'Weedville',
                zipcode: 8931,
                geo: {
                    lat: -63.185586,
                    lng: 117.327808,
                },
            },
            phone: '+1 (999) 565-3239',
            isActive: true,
            age: 27,
            company: 'COMTRACT',
        },
        {
            id: 16,
            firstName: 'Little',
            lastName: 'Hatfield',
            email: 'littlehatfield@comtract.com',
            dob: '2012-01-03',
            address: {
                street: '194 Anthony Street',
                city: 'Williston',
                zipcode: 7456,
                geo: {
                    lat: 47.480837,
                    lng: 6.085909,
                },
            },
            phone: '+1 (812) 488-3011',
            isActive: false,
            age: 33,
            company: 'ZIDANT',
        },
        {
            id: 17,
            firstName: 'Larson',
            lastName: 'Kelly',
            email: 'larsonkelly@zidant.com',
            dob: '2010-06-14',
            address: {
                street: '978 Indiana Place',
                city: 'Innsbrook',
                zipcode: 639,
                geo: {
                    lat: -71.766732,
                    lng: 150.854345,
                },
            },
            phone: '+1 (892) 484-2162',
            isActive: true,
            age: 20,
            company: 'SUREPLEX',
        },
        {
            id: 18,
            firstName: 'Kendra',
            lastName: 'Molina',
            email: 'kendramolina@sureplex.com',
            dob: '2002-07-19',
            address: {
                street: '567 Charles Place',
                city: 'Kimmell',
                zipcode: 1966,
                geo: {
                    lat: 50.765816,
                    lng: -117.106499,
                },
            },
            phone: '+1 (920) 528-3330',
            isActive: false,
            age: 31,
            company: 'DANJA',
        },
        {
            id: 19,
            firstName: 'Ebony',
            lastName: 'Livingston',
            email: 'ebonylivingston@danja.com',
            dob: '1994-10-18',
            address: {
                street: '284 Cass Place',
                city: 'Navarre',
                zipcode: 948,
                geo: {
                    lat: 65.271256,
                    lng: -83.064729,
                },
            },
            phone: '+1 (970) 591-3039',
            isActive: false,
            age: 33,
            company: 'EURON',
        },
        {
            id: 20,
            firstName: 'Kaufman',
            lastName: 'Rush',
            email: 'kaufmanrush@euron.com',
            dob: '2011-07-10',
            address: {
                street: '408 Kingsland Avenue',
                city: 'Beaulieu',
                zipcode: 7911,
                geo: {
                    lat: 41.513153,
                    lng: 54.821641,
                },
            },
            phone: '+1 (924) 463-2934',
            isActive: false,
            age: 39,
            company: 'ILLUMITY',
        },
        {
            id: 21,
            firstName: 'Frank',
            lastName: 'Hays',
            email: 'frankhays@illumity.com',
            dob: '2005-06-15',
            address: {
                street: '973 Caton Place',
                city: 'Dargan',
                zipcode: 4104,
                geo: {
                    lat: 63.314988,
                    lng: -138.771323,
                },
            },
            phone: '+1 (930) 577-2670',
            isActive: false,
            age: 31,
            company: 'SYBIXTEX',
        },
        {
            id: 22,
            firstName: 'Carmella',
            lastName: 'Mccarty',
            email: 'carmellamccarty@sybixtex.com',
            dob: '1980-03-06',
            address: {
                street: '919 Judge Street',
                city: 'Canby',
                zipcode: 8283,
                geo: {
                    lat: 9.198597,
                    lng: -138.809971,
                },
            },
            phone: '+1 (876) 456-3218',
            isActive: true,
            age: 21,
            company: 'ZEDALIS',
        },
        {
            id: 23,
            firstName: 'Massey',
            lastName: 'Owen',
            email: 'masseyowen@zedalis.com',
            dob: '2012-03-01',
            address: {
                street: '108 Seaview Avenue',
                city: 'Slovan',
                zipcode: 3599,
                geo: {
                    lat: -74.648318,
                    lng: 99.620699,
                },
            },
            phone: '+1 (917) 567-3786',
            isActive: false,
            age: 40,
            company: 'DYNO',
        },
        {
            id: 24,
            firstName: 'Lottie',
            lastName: 'Lowery',
            email: 'lottielowery@dyno.com',
            dob: '1982-10-10',
            address: {
                street: '557 Meserole Avenue',
                city: 'Fowlerville',
                zipcode: 4991,
                geo: {
                    lat: 54.811546,
                    lng: -20.996515,
                },
            },
            phone: '+1 (912) 539-3498',
            isActive: true,
            age: 36,
            company: 'MULTIFLEX',
        },
        {
            id: 25,
            firstName: 'Addie',
            lastName: 'Luna',
            email: 'addieluna@multiflex.com',
            dob: '1988-05-01',
            address: {
                street: '688 Bulwer Place',
                city: 'Harmon',
                zipcode: 7664,
                geo: {
                    lat: -12.762766,
                    lng: -39.924497,
                },
            },
            phone: '+1 (962) 537-2981',
            isActive: true,
            age: 32,
            company: 'PHARMACON',
        },
    ];

    const countryList = [
        { code: 'AE', name: 'United Arab Emirates' },
        { code: 'AR', name: 'Argentina' },
        { code: 'AT', name: 'Austria' },
        { code: 'AU', name: 'Australia' },
        { code: 'BE', name: 'Belgium' },
        { code: 'BG', name: 'Bulgaria' },
        { code: 'BN', name: 'Brunei' },
        { code: 'BR', name: 'Brazil' },
        { code: 'BY', name: 'Belarus' },
        { code: 'CA', name: 'Canada' },
        { code: 'CH', name: 'Switzerland' },
        { code: 'CL', name: 'Chile' },
        { code: 'CN', name: 'China' },
        { code: 'CO', name: 'Colombia' },
        { code: 'CZ', name: 'Czech Republic' },
        { code: 'DE', name: 'Germany' },
        { code: 'DK', name: 'Denmark' },
        { code: 'DZ', name: 'Algeria' },
        { code: 'EC', name: 'Ecuador' },
        { code: 'EG', name: 'Egypt' },
        { code: 'ES', name: 'Spain' },
        { code: 'FI', name: 'Finland' },
        { code: 'FR', name: 'France' },
        { code: 'GB', name: 'United Kingdom' },
        { code: 'GR', name: 'Greece' },
        { code: 'HK', name: 'Hong Kong' },
        { code: 'HR', name: 'Croatia' },
        { code: 'HU', name: 'Hungary' },
        { code: 'ID', name: 'Indonesia' },
        { code: 'IE', name: 'Ireland' },
        { code: 'IL', name: 'Israel' },
        { code: 'IN', name: 'India' },
        { code: 'IT', name: 'Italy' },
        { code: 'JO', name: 'Jordan' },
        { code: 'JP', name: 'Japan' },
        { code: 'KE', name: 'Kenya' },
        { code: 'KH', name: 'Cambodia' },
        { code: 'KR', name: 'South Korea' },
        { code: 'KZ', name: 'Kazakhstan' },
        { code: 'LA', name: 'Laos' },
        { code: 'LK', name: 'Sri Lanka' },
        { code: 'MA', name: 'Morocco' },
        { code: 'MM', name: 'Myanmar' },
        { code: 'MO', name: 'Macau' },
        { code: 'MX', name: 'Mexico' },
        { code: 'MY', name: 'Malaysia' },
        { code: 'NG', name: 'Nigeria' },
        { code: 'NL', name: 'Netherlands' },
        { code: 'NO', name: 'Norway' },
        { code: 'NZ', name: 'New Zealand' },
        { code: 'PE', name: 'Peru' },
        { code: 'PH', name: 'Philippines' },
        { code: 'PK', name: 'Pakistan' },
        { code: 'PL', name: 'Poland' },
        { code: 'PT', name: 'Portugal' },
        { code: 'QA', name: 'Qatar' },
        { code: 'RO', name: 'Romania' },
        { code: 'RS', name: 'Serbia' },
        { code: 'RU', name: 'Russia' },
        { code: 'SA', name: 'Saudi Arabia' },
        { code: 'SE', name: 'Sweden' },
        { code: 'SG', name: 'Singapore' },
        { code: 'SK', name: 'Slovakia' },
        { code: 'TH', name: 'Thailand' },
        { code: 'TN', name: 'Tunisia' },
        { code: 'TR', name: 'Turkey' },
        { code: 'TW', name: 'Taiwan' },
        { code: 'UK', name: 'Ukraine' },
        { code: 'UG', name: 'Uganda' },
        { code: 'US', name: 'United States' },
        { code: 'VN', name: 'Vietnam' },
        { code: 'ZA', name: 'South Africa' },
        { code: 'BA', name: 'Bosnia and Herzegovina' },
        { code: 'BD', name: 'Bangladesh' },
        { code: 'EE', name: 'Estonia' },
        { code: 'IQ', name: 'Iraq' },
        { code: 'LU', name: 'Luxembourg' },
        { code: 'LV', name: 'Latvia' },
        { code: 'MK', name: 'North Macedonia' },
        { code: 'SI', name: 'Slovenia' },
        { code: 'PA', name: 'Panama' },
    ];


    const [page, setPage] = useState(1);
    const PAGE_SIZES = [10, 20, 30, 50, 100];
    const [pageSize, setPageSize] = useState(PAGE_SIZES[0]);
    const [initialRecords, setInitialRecords] = useState(sortBy(rowData, 'id'));
    const [recordsData, setRecordsData] = useState(initialRecords);

    const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
        columnAccessor: 'id',
        direction: 'asc',
    });

    const [isMounted, setIsMounted] = useState(false);
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
        setInitialRecords(sortStatus.direction === 'desc' ? data.reverse() : data);
        setPage(1);
    }, [sortStatus]);

    const randomColor = () => {
        const color = ['#4361ee', '#805dca', '#00ab55', '#e7515a', '#e2a03f', '#2196f3'];
        const random = Math.floor(Math.random() * color.length);
        return color[random];
    };
    const handleUpdateFormOpen = (id: number) => {
        const gridData = users.find((staff) => staff.id === id);
        const roleData = roleNames.filter((role) => gridData.role_id.includes(role.value));
        console.log(roleData)
        setValue("first_name", gridData.first_name);
        setValue("last_name", gridData.last_name);
        setValue("email", gridData.email);
        setValue("username", gridData.username);
        setValue("prefered_language", gridData.prefered_language);
        setValue("phone_no", gridData.phone_no);
        setValue("branch_id", gridData.branch_id);
        setValue("role_id", gridData.role_id);
        setSelectedOptions(roleData)
        setUserForm(true);
        setUpdateId(id)
    };

    const chart_options = () => {
        let option = {
            chart: { sparkline: { enabled: true } },
            stroke: { curve: 'smooth', width: 2 },
            markers: { size: [4, 7], strokeWidth: 0 },
            colors: [randomColor()],
            grid: { padding: { top: 5, bottom: 5 } },
            tooltip: {
                x: { show: false },
                y: {
                    title: {
                        formatter: () => {
                            return '';
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
                icon: 'warning',
                title: 'Are you sure?',
                text: "You won't be able to revert this!",
                showCancelButton: true,
                confirmButtonText: 'Delete',
                padding: '2em',
                customClass: {
                    popup: 'sweet-alerts', // Assigning the correct class to the `popup` property
                },
            }).then((result) => {
                if (result.isConfirmed) { // Use `isConfirmed` for newer versions of SweetAlert2
                    handleDelete(id).then((res) => {
                        if (res !== false) {
                            Swal.fire({
                                title: 'Deleted!',
                                text: 'Your file has been deleted.',
                                icon: 'success',
                                customClass: {
                                    popup: 'sweet-alerts',
                                },
                            });
                        } else {
                            Swal.fire({
                                title: 'Error',
                                text: 'Something went wrong. Try later',
                                icon: 'error',
                                customClass: {
                                    popup: 'sweet-alerts',
                                },
                            });
                        }
                    });
                }
            });
        }
    }


    const handleChange = (selected) => {
        setSelectedOptions(selected); // Update state with selected options
        const idArray = []
        selected.map(val => {
            idArray.push(val.value)
        })
        setValue("role_id", idArray)
    };


    // Use the table hooks

    return (
        <>
            {!showUserRole && (

                <div className="panel border-white-light px-0 dark:border-[#1b2e4b] overflow-hidden	">
                    <div className="mb-2.5 relative pt-2 pb-4  top-[-20px] flex flex-col justify-between  rounded-t-md	 px-5 md:flex-row md:items-center bg-[linear-gradient(225deg,rgba(239,18,98,0.6)_0%,rgba(67,97,238,0.6)_100%)] text-white">
                        <h2 style={{ margin: 0 }} className="font-bold text-2xl">
                            {!showUserForm ? "Payment received" : "Add new order"}
                        </h2>

                        {/* <div className="flex items-center gap-2">
                            {(!showUserForm && !showUserRole) && (
                                <Link
                                    href="#"
                                    onClick={onCLickAdd}
                                    className="btn btn-primary gap-2"
                                >
                                    <IconPlus />
                                    Add order
                                </Link>
                            )}
                        </div> */}
                    </div>

                    <div className="invoice-table">
                        <div className="">
                            <div style={{ padding: "20px" }}>
                                {(!showUserForm && !showUserRole) && (
                                    <>
                                        {/* Table */}
                                        <DataTable<any>
                                            noRecordsText="No results match your search query"
                                            highlightOnHover
                                            className="table-hover whitespace-nowrap"
                                            records={users}
                                            columns={[
                                                {
                                                    accessor: 'id',
                                                    title: 'ID',
                                                    sortable: true,
                                                    render: ({ id }) => <strong className="text-info pointer-cursor" >#{id}</strong>,
                                                },
                                                {
                                                    accessor: 'first_name',
                                                    title: 'Customer',
                                                    sortable: true,
                                                    render: ({ first_name }) => (
                                                        <div className="flex items-center gap-2">
                                                            <div className="font-semibold">{first_name}</div>
                                                        </div>
                                                    ),
                                                },

                                                {
                                                    accessor: 'email',
                                                    title: 'Email',
                                                    sortable: true,
                                                    render: ({ email }) => (
                                                        <a href={`mailto:${email}`} className="text-primary hover:underline">
                                                            {email}
                                                        </a>
                                                    ),
                                                },
                                                {
                                                    accessor: 'branch',
                                                    sortable: true,
                                                    title: 'Amount',
                                                    render: ({ branch }) => (
                                                        <div className="flex items-center gap-2">
                                                            <span>{branch?.name}</span>

                                                        </div>
                                                    )
                                                },
                                                {
                                                    accessor: 'inactivity_status',
                                                    title: 'Payment Method',
                                                    sortable: true,
                                                    render: ({ inactivity_status }) => <span className={`badge bg-${!inactivity_status ? "success" : "danger"} rounded-full`}>{inactivity_status ? "In active" : "Active"}</span>,
                                                },
                                                {
                                                    accessor: 'branch',
                                                    sortable: true,
                                                    title: 'Reference',
                                                    render: ({ branch }) => (
                                                        <div className="flex items-center gap-2">
                                                            <span>{branch?.name}</span>

                                                        </div>
                                                    )
                                                },
                                                {
                                                    accessor: 'branch',
                                                    sortable: true,
                                                    title: 'Payment date',
                                                    render: ({ branch }) => (
                                                        <div className="flex items-center gap-2">
                                                            <span>{branch?.name}</span>

                                                        </div>
                                                    )
                                                },
                                                {
                                                    accessor: 'branch',
                                                    sortable: true,
                                                    title: 'Date added',
                                                    render: ({ branch }) => (
                                                        <div className="flex items-center gap-2">
                                                            <span>{branch?.name}</span>

                                                        </div>
                                                    )
                                                },
                                                {
                                                    accessor: 'branch',
                                                    sortable: true,
                                                    title: 'Author',
                                                    render: ({ branch }) => (
                                                        <div className="flex items-center gap-2">
                                                            <span>{branch?.name}</span>

                                                        </div>
                                                    )
                                                },
                                                {
                                                    accessor: 'id',
                                                    title: 'Action',
                                                    render: ({ id }) => (<div className="flex justify-center gp-x-2">
                                                        <Link href={"#"} onClick={() => { handleUpdateFormOpen(id) }}>
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


                                                    </div>),
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
                                            paginationText={({ from, to, totalRecords }) => `Showing  ${from} to ${to} of ${totalRecords} entries`}
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
                                )}              </div>
                            <div className="h-full flex-1 overflow-x-hidden p-0">
                                <div className="relative">

                                    <form className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                                        <div className="form-group">
                                            <label
                                                htmlFor="reciever-email"
                                                className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Customer
                                            </label>
                                            <div className="relative">
                                                <Select placeholder="Select an option"
                                                    options={roleNames}
                                                    isSearchable={false}
                                                    className={` w-full rounded p-2 ${errors.customer ? "border-red-500" : "border-gray-300"}`}
                                                    onChange={handleChange} // Handle value changes

                                                />

                                                {errors.customer && (
                                                    <FaExclamationCircle
                                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                        style={{ fontSize: "calc(1em + 5px)" }}
                                                    />
                                                )}

                                            </div>
                                            {errors.customer && (
                                                <div className="mt-2">
                                                    <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                        {String(errors.customer.message)}
                                                    </span>
                                                </div>
                                            )}

                                        </div>

                                        <div className="form-group">
                                            <label
                                                htmlFor="Last Name"
                                                className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Custom Opening Date
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="LastName"
                                                    type="date"
                                                    name="last_name"
                                                    className={`form-input flex-1 ${errors.last_name ? "border-red-500" : ""}`}
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
                                                htmlFor="Last Name"
                                                className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Custom Closing Date
                                            </label>
                                            <div className="relative">
                                                <input
                                                    id="LastName"
                                                    type="text"
                                                    name="last_name"
                                                    className={`form-input flex-1 ${errors.last_name ? "border-red-500" : ""}`}
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
                                                htmlFor="iban-code"
                                                className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Selected Vehicle
                                            </label>
                                            <div className="relative">

                                                <select
                                                    id="country"
                                                    name="country"
                                                    {...register("branch_id")}

                                                    className={`form-input flex-1 ${errors.branch_id ? "border-red-500" : ""}`}
                                                >
                                                    <option value="">Choose Selected Vehicle</option>
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
                                                htmlFor="iban-code"
                                                className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Order type
                                            </label>
                                            <div className="relative">

                                                <select
                                                    id="country"
                                                    name="country"
                                                    {...register("branch_id")}

                                                    className={`form-input flex-1 ${errors.branch_id ? "border-red-500" : ""}`}
                                                >
                                                    <option value="">Choose Order type</option>
                                                    <option >Daily</option>
                                                    <option >weekly</option>
                                                    <option >Monthly</option>
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
                                                htmlFor="reciever-number"
                                                className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Rate *
                                            </label>
                                            <div className="relative">

                                                <input
                                                    id="reciever-number"
                                                    type="text"
                                                    name="reciever-number"
                                                    className={`form-input flex-1 ${errors.phone_no ? "border-red-500" : ""}`}
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
                                                htmlFor="swift-code"
                                                className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Period
                                            </label>

                                            <div className="relative">

                                                <input
                                                    type="text"
                                                    name="swift-code"

                                                    className={`form-input flex-1 ${errors.Period ? "border-red-500" : ""}`}
                                                    {...register("Period")}

                                                />
                                                {errors.Period && (
                                                    <FaExclamationCircle
                                                        className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                                        style={{ fontSize: "calc(1em + 5px)" }}
                                                    />
                                                )}

                                            </div>
                                            {errors.Period && (
                                                <div className="mt-2">
                                                    <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                                        {String(errors.Period.message)}
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                        <div className="form-group">
                                            <label
                                                htmlFor="bank-name"
                                                className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Retrun Date
                                            </label>

                                            <div className="relative">

                                                <input
                                                    id="bank-name"
                                                    type="date"
                                                    name="bank-name"

                                                    className={`form-input flex-1 ${errors.username ? "border-red-500" : ""}`}
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
                                        <div className="form-group">
                                            <label
                                                htmlFor="reciever-email"
                                                className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Return location
                                            </label>
                                            <div className="relative">

                                                <input
                                                    id="email"
                                                    type="text"
                                                    name="email"
                                                    className={`form-input flex-1 ${errors.email ? "border-red-500" : ""}`}
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
                                                htmlFor="reciever-email"
                                                className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Daily KM Limit
                                            </label>
                                            <div className="relative">

                                                <input
                                                    type="text"
                                                    className={`form-input flex-1 ${errors.email ? "border-red-500" : ""}`}
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
                                                htmlFor="iban-code"
                                                className="mb-0 w-1/3 ltr:mr-2 rtl:ml-2"
                                            >
                                                Salesman
                                            </label>
                                            <div className="relative">

                                                <select
                                                    id="country"
                                                    name="country"
                                                    {...register("branch_id")}

                                                    className={`form-input flex-1 ${errors.branch_id ? "border-red-500" : ""}`}
                                                >
                                                    <option value="">Choose Salesman</option>
                                                    <option> </option>
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
                                                #[nRef]
                                            </label>
                                            <div className="flex flex-col">
                                                <div className="flex items-center">
                                                    <div className="relative w-full">
                                                        <input
                                                            id="bank-name"
                                                            type="text"
                                                            name="bank-name"

                                                            className={`form-input flex-1 ${errors.username ? "border-red-500" : ""}`}
                                                            {...register("username")}

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
                                                {loadingForm ? <ButtonLoader /> : (<><IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />{"Save"}</>)}

                                            </button>

                                        </div>

                                    </div>
                                </div>

                            </div>
                        </>

                    )}
                    { }
                </div >
            )}

            {showUserRole && (
                <>
                    <ComponentUserRolePage setUserRole={setUserRole} />
                </>
            )}

        </>
    );
};


export default Orders;
