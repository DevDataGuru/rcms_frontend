'use client';
import IconMenu from '@/components/icon/icon-menu';
import { IRootState } from '@/store';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import PerfectScrollbar from 'react-perfect-scrollbar';
import 'tippy.js/dist/tippy.css';
import 'react-quill/dist/quill.snow.css';
import IconSave from '@/components/icon/icon-save';
import IconXCircle from '@/components/icon/icon-x-circle';
import { fetchingTabsForRole, fetchingPermissionsByTabs } from '@/services/commonService';
import { DynamicIconLoader } from '@/utils/DynamicIconLoader';
import { SaveRoleNames } from '@/services/userRolesService';
import ButtonLoader from '@/components/button-loader';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { FaExclamationCircle } from 'react-icons/fa';
import { FaChevronDown, FaChevronRight } from 'react-icons/fa';

const ComponentUserRolePage = ({ setUserRole }) => {
    const [isShowMailMenu, setIsShowMailMenu] = useState(false);
    const [loading, setLoading] = useState(false);
    const [menus, setMenus] = useState([]);
    const [expandedMenus, setExpandedMenus] = useState({});
    const [selectedMenus, setSelectedMenus] = useState([]);
    const [selectedTabs, setSelectedTabs] = useState([]);
    const [permissions, setPermissions] = useState([]);
    const [permissionsArray, setPermissionsArray] = useState([]);
    const [showAlert, setShowAlert] = useState("");
    const [currentTabId, setCurrentTabId] = useState(null);

    const isRtl = useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

    const schema = yup.object({
        role_name: yup.string().required("Role name is required"),
    });

    const {
        register,
        reset,
        handleSubmit,
        formState: { errors },
    } = useForm({ resolver: yupResolver(schema) });

    // Toggle menu expansion
    const toggleMenuExpansion = (menuId, event) => {
        event.stopPropagation(); // Prevent triggering menu selection
        setExpandedMenus(prev => ({
            ...prev,
            [menuId]: !prev[menuId]
        }));
    };

    // Handle menu selection
    const handleMenuClick = (menuId) => {
        setSelectedMenus(prev => {
            if (prev.includes(menuId)) {
                return prev.filter(id => id !== menuId);
            } else {
                return [...prev, menuId];
            }
        });

        // If it's Dashboard or a menu with no tabs, fetch permissions directly
        const menu = menus.find(m => m.id === menuId);
        if (menu && (!menu.tabs || menu.tabs.length === 0)) {
            fetchPermissionsById(menuId, true);
            setCurrentTabId(menuId);
        }
    };

    // Handle tab selection
    const handleTabClick = (tabId, menuId, event) => {
        event.stopPropagation(); // Prevent the menu click event from firing
        
        setSelectedTabs(prev => {
            if (prev.includes(tabId)) {
                return prev.filter(id => id !== tabId);
            } else {
                return [...prev, tabId];
            }
        });
        
        fetchPermissionsById(tabId);
        setCurrentTabId(tabId);
    };

    const handleOnCheckPermission = (permission) => {
        setPermissionsArray(prev => {
            // Check if this permission is already in the array
            const existingIndex = prev.findIndex(
                p => p.menu_id === permission.menu_id && 
                     p.tab_id === permission.tab_id && 
                     p.btn_id === permission.id
            );
            
            if (existingIndex !== -1) {
                // If it exists, remove it (unchecking)
                return prev.filter((_, index) => index !== existingIndex);
            } else {
                // If it doesn't exist, add it (checking)
                return [...prev, {
                    menu_id: permission.menu_id,
                    tab_id: permission.tab_id || null,
                    btn_id: permission.id
                }];
            }
        });
    };

    const isPermissionSelected = (permission) => {
        return permissionsArray.some(
            p => p.menu_id === permission.menu_id && 
                 p.tab_id === permission.tab_id && 
                 p.btn_id === permission.id
        );
    };

    const handleSaveRole = async (data) => {
        try {
            setLoading(true);
            
            // Prepare data for saving
            const formData = { 
                roleData: data.role_name,
                accessData: [
                    // Add selected menus
                    ...selectedMenus.map(menuId => ({
                        menu_id: menuId,
                        tab_id: null
                    })),
                    // Add selected tabs
                    ...selectedTabs.map(tabId => {
                        const tab = menus.flatMap(m => m.tabs || []).find(t => t.id === tabId);
                        return {
                            menu_id: tab?.menu_id,
                            tab_id: tabId
                        };
                    }),
                    // Add permissions
                    ...permissionsArray
                ]
            };
            
            const result = await SaveRoleNames(formData);
            if (result) {
                setShowAlert("success");
                setTimeout(() => setShowAlert(null), 3000);
                reset();
                setSelectedMenus([]);
                setSelectedTabs([]);
                setPermissionsArray([]);
            } else {
                setShowAlert("error");
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

    const fetchPermissionsById = (id, isMenu = false) => {
        const endpoint = isMenu ? `menuId=${id}` : `tabId=${id}`;
        fetchingPermissionsByTabs(endpoint)
            .then(res => {
                if (res?.data) {
                    setPermissions(res.data);
                } else {
                    setPermissions([]);
                }
            })
            .catch(error => {
                console.log(error);
                setPermissions([]);
            });
    };

    // Helper function to determine menu name from a set of tabs
    const determineMenuName = (menuId, tabs) => {
        // For known common menus, provide names
        if (menuId === 1) return { name: "Dashboard", icon: "MdDashboard" };
        if (menuId === 2) return { name: "Business", icon: "FaBuilding" };
        if (menuId === 3) return { name: "Settings", icon: "FaCog" };
        if (menuId === 4) return { name: "Tools", icon: "FaTools" };
        
        // For unknown menus, try to derive name from tabs
        if (tabs && tabs.length > 0) {
            // Try to find common prefix or term in tab names
            // For simplicity, just use the first tab's name
            return { name: `${tabs[0].name} Section`, icon: tabs[0].icons || "FaFolder" };
        }
        
        return { name: `Menu ${menuId}`, icon: "FaFolder" };
    };

    useEffect(() => {
        fetchingTabsForRole()
            .then(res => {
                if (res?.data) {
                    // First, create a map to organize tabs by menu ID
                    const menuTabsMap = {};
                    
                    // Process all items in the response
                    res.data.forEach(item => {
                        // Handle standalone menu items (no menu_id)
                        if (!item.menu_id) {
                            menuTabsMap[item.id] = menuTabsMap[item.id] || {
                                id: item.id,
                                name: item.name,
                                icons: item.icons,
                                tabs: []
                            };
                        } 
                        // Handle tabs (with menu_id)
                        else {
                            menuTabsMap[item.menu_id] = menuTabsMap[item.menu_id] || {
                                id: item.menu_id,
                                name: null, // We'll set this later
                                icons: null, // We'll set this later
                                tabs: []
                            };
                            menuTabsMap[item.menu_id].tabs.push(item);
                        }
                    });
                    
                    // Now determine names for menus that don't have them already
                    Object.keys(menuTabsMap).forEach(menuId => {
                        if (!menuTabsMap[menuId].name) {
                            const { name, icon } = determineMenuName(
                                parseInt(menuId), 
                                menuTabsMap[menuId].tabs
                            );
                            menuTabsMap[menuId].name = name;
                            menuTabsMap[menuId].icons = icon;
                        }
                    });
                    
                    // Convert to array and sort by ID
                    const processedMenus = Object.values(menuTabsMap).sort((a, b) => a.id - b.id);
                    
                    // Handle duplicate tabs (like those for menu_id 2)
                    processedMenus.forEach(menu => {
                        // Remove duplicates based on tab ID
                        const uniqueTabs = [];
                        const tabIds = new Set();
                        menu.tabs.forEach(tab => {
                            if (!tabIds.has(tab.id)) {
                                tabIds.add(tab.id);
                                uniqueTabs.push(tab);
                            }
                        });
                        menu.tabs = uniqueTabs;
                    });
                    
                    setMenus(processedMenus);
                    
                    // Expand Dashboard by default
                    const dashboardMenu = processedMenus.find(menu => menu.name === "Dashboard");
                    if (dashboardMenu) {
                        setExpandedMenus(prev => ({ ...prev, [dashboardMenu.id]: true }));
                    }
                }
            })
            .catch(error => {
                console.log(error);
            });
    }, []);

    return (
        <div>
            <div className="relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)]">
                {showAlert && (
                    <div className={`fixed top-4 right-4 z-50 flex items-center p-3.5 rounded text-white ${
                        showAlert === "success" ? "bg-green-500" : 
                        showAlert === "error" ? "bg-red-500" : 
                        showAlert === "info" ? "bg-blue-500" : "bg-yellow-500"
                    }`}>
                        <span className="text-white w-6 h-6 ltr:mr-4 rtl:ml-4">
                            {showAlert === "success" ? "✓" : "!"}
                        </span>
                        <span>
                            <strong className="ltr:mr-1 rtl:ml-1">
                                {showAlert.charAt(0).toUpperCase() + showAlert.slice(1)}!
                            </strong>
                            {showAlert === "success" && "Role created successfully."}
                            {showAlert === "error" && "An error occurred. Please try again."}
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
                
                <div className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${
                    isShowMailMenu ? '!block xl:!hidden' : ''
                }`} onClick={() => setIsShowMailMenu(!isShowMailMenu)}></div>

                <div className={`panel dark:gray-50 absolute z-10 hidden h-full w-[250px] max-w-full flex-none space-y-3 overflow-hidden p-4 ltr:rounded-r-none rtl:rounded-l-none xl:relative xl:block xl:h-auto ltr:xl:rounded-r-md rtl:xl:rounded-l-md ${
                    isShowMailMenu ? '!block' : ''
                }`}>
                    <div className="flex h-full flex-col pb-16">
                        <PerfectScrollbar className="relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5">
                            {menus.map((menu) => (
                                <div key={menu.id} className="space-y-1 mb-2">
                                    <div className="flex flex-col">
                                        <div 
                                            className={`flex h-10 w-full items-center justify-between rounded-md p-2 font-medium hover:bg-white-dark/10 
                                            ${selectedMenus.includes(menu.id) ? 'bg-indigo-100 text-primary dark:bg-[#181F32] dark:text-primary' : ''}
                                            hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary`}
                                        >
                                            <div className="flex items-center cursor-pointer" onClick={() => handleMenuClick(menu.id)}>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedMenus.includes(menu.id)}
                                                    onChange={() => {}}
                                                    className="mr-2"
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMenuClick(menu.id);
                                                    }}
                                                />
                                                {DynamicIconLoader(
                                                    menu?.icons?.replace(/"/g, ""),
                                                    "h-5 w-5 shrink-0"
                                                )}
                                                <div className="ltr:ml-3 rtl:mr-3">{menu?.name}</div>
                                            </div>
                                            {menu.tabs && menu.tabs.length > 0 && (
                                                <button 
                                                    className="focus:outline-none"
                                                    onClick={(e) => toggleMenuExpansion(menu.id, e)}
                                                >
                                                    {expandedMenus[menu.id] ? <FaChevronDown /> : <FaChevronRight />}
                                                </button>
                                            )}
                                        </div>
                                        
                                        {/* Tabs dropdown */}
                                        {expandedMenus[menu.id] && menu.tabs && menu.tabs.length > 0 && (
                                            <div className="pl-10 space-y-1 mt-1">
                                                {menu.tabs.map((tab) => (
                                                    <div
                                                        key={tab.id}
                                                        className={`flex h-8 w-full items-center rounded-md p-2 text-sm hover:bg-white-dark/10 cursor-pointer
                                                        ${selectedTabs.includes(tab.id) ? 'bg-indigo-50 text-primary dark:bg-[#181F32] dark:text-primary' : ''}
                                                        hover:text-primary dark:hover:bg-[#181F32] dark:hover:text-primary`}
                                                        onClick={(e) => handleTabClick(tab.id, menu.id, e)}
                                                    >
                                                        <input
                                                            type="checkbox"
                                                            checked={selectedTabs.includes(tab.id)}
                                                            onChange={() => {}}
                                                            className="mr-2"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                handleTabClick(tab.id, menu.id, e);
                                                            }}
                                                        />
                                                        <div>{tab?.name}</div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </PerfectScrollbar>
                    </div>
                </div>

                <div className="panel h-full flex-1 overflow-x-hidden p-0">
                    <div className="relative">
                        <div className="flex items-center px-6 py-4">
                            <button
                                type="button"
                                className="block hover:text-primary ltr:mr-3 rtl:ml-3 xl:hidden"
                                onClick={() => setIsShowMailMenu(!isShowMailMenu)}
                            >
                                <IconMenu />
                            </button>
                            <div>
                                <div className='relative'>
                                    <input
                                        className={`form-input text-lg font-medium text-gray-600 dark:text-gray-400 ${errors.role_name ? "border-red-500" : ""}`}
                                        {...register("role_name")}
                                        placeholder="Enter Role Name"
                                    />
                                    {errors.role_name && (
                                        <FaExclamationCircle
                                            className="absolute top-1/2 right-2 transform -translate-y-1/2 text-red-500"
                                            style={{ fontSize: "calc(1em + 5px)" }}
                                        />
                                    )}
                                </div>
                                {errors.role_name && (
                                    <div className="mt-2">
                                        <span className="mt-1 z-10 inline-block pl-2 pr-3 text-sm font-medium text-white transition-opacity duration-300 bg-red-500 rounded-lg shadow-sm dark:bg-red-500">
                                            {String(errors.role_name.message)}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white"></div>
                        <div className="p-4">
                            {currentTabId && permissions.length > 0 ? (
                                <table className="table-auto w-full border-collapse border border-gray-300 text-left">
                                    <thead>
                                        <tr>
                                            <th className="border border-gray-300 px-4 py-2">Permissions</th>
                                            <th className="border border-gray-300 px-4 py-2 text-center">Grant</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {permissions.map((permission, index) => (
                                            <tr key={index} className="hover:bg-gray-100">
                                                <td className="border border-gray-300 px-4 py-2">{permission.name}</td>
                                                <td className="border border-gray-300 px-4 py-2 text-center">
                                                    <input
                                                        type="checkbox"
                                                        checked={isPermissionSelected(permission)}
                                                        onChange={() => handleOnCheckPermission(permission)}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    Select a menu or tab to view available permissions
                                </div>
                            )}
                        </div>

                        <div className="sticky bottom-0 bg-white dark:bg-[#181F32] border-t p-4 flex justify-end space-x-3">
                            <div className="flex justify-end items-center">
                                <button
                                    type="button"
                                    onClick={() => { setUserRole(false) }}
                                    className="btn btn-danger ltr:mr-3 rtl:ml-3 w-full rounded-full"
                                >
                                    <IconXCircle className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-success rounded-full ltr:mr-3 rtl:ml-3"
                                    onClick={handleSubmit(handleSaveRole)}
                                >
                                    {loading ? <ButtonLoader /> : (
                                        <>
                                            <IconSave className="shrink-0 ltr:mr-2 rtl:ml-2" />
                                            Save
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ComponentUserRolePage;