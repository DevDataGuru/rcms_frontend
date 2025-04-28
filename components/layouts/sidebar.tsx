"use client"
import PerfectScrollbar from "react-perfect-scrollbar"
import { useDispatch, useSelector } from "react-redux"
import Link from "next/link"
import { toggleSidebar } from "@/store/themeConfigSlice"
import AnimateHeight from "react-animate-height"
import type { IRootState } from "@/store"
import { useState, useEffect } from "react"
import IconCaretsDown from "@/components/icon/icon-carets-down"
import { usePathname } from "next/navigation"
import { getTranslation } from "@/i18n"
import { useRouter } from "next/navigation"
import { getRoleWisePermissions } from "@/services/commonService"
import { setRolePermissions } from "@/store/slices/permissionsSlice"
import { jwtDecode } from "jwt-decode"
import { DynamicIconLoader } from "@/utils/DynamicIconLoader"
import { useToken } from "@/hooks/useToken"

const Sidebar = () => {
  useToken() // Add this at the top of your component
  const router = useRouter()
  const { t } = getTranslation()
  const pathname = usePathname()
  const [currentMenu, setCurrentMenu] = useState<number | null>(1)
  const [currentSubMenu, setCurrentSubMenu] = useState<number | null>(null) // For submenus
  const [isLoading, setIsLoading] = useState(true)
  const dispatch = useDispatch()
  const themeConfig = useSelector((state: IRootState) => state.themeConfig)
  const sidebarExpanded = useSelector((state: IRootState) => state.themeConfig.sidebar)
  const toggleMenu = (menuId: number) => {
    setCurrentMenu((prevMenu) => (prevMenu === menuId ? null : menuId))
  }
  const toggleSubMenu = (subMenuId: number) => {
    setCurrentSubMenu((prevSubMenu) => (prevSubMenu === subMenuId ? null : subMenuId))
  }
  const setActiveRoute = () => {
    const allLinks = document.querySelectorAll(".sidebar ul a.active")
    for (let i = 0; i < allLinks.length; i++) {
      const element = allLinks[i]
      element?.classList.remove("active")
    }
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]')
    selector?.classList.add("active")
  }
  useEffect(() => {
    const selector = document.querySelector('.sidebar ul a[href="' + window.location.pathname + '"]')
    if (selector) {
      selector.classList.add("active")
      const ul: any = selector.closest("ul.sub-menu")
      if (ul) {
        let ele: any = ul.closest("li.menu").querySelectorAll(".nav-link") || []
        if (ele.length) {
          ele = ele[0]
          setTimeout(() => {
            ele.click()
          })
        }
      }
    }
  }, [])
  useEffect(() => {
    setActiveRoute()
    if (window.innerWidth < 1024 && themeConfig.sidebar) {
      dispatch(toggleSidebar())
    }
  }, [pathname])
  const semidark = useSelector((state: IRootState) => state.themeConfig.semidark)
  const accessToken = useSelector((state: IRootState) => state?.user?.userData?.accessToken)
  const permissions = useSelector((state: IRootState) => state.permissions.permissions)
  // Function to fetch permissions
  const fetchPermissions = async (roleId: string) => {
    try {
      setIsLoading(true)
      const result = await getRoleWisePermissions(roleId)
      if (result?.data) {
        const fetchedPermissions = result.data[0]?.role_permissions || []
        dispatch(setRolePermissions(fetchedPermissions))
      }
    } catch (error) {
      console.error("Error fetching permissions:", error)
    } finally {
      setIsLoading(false)
    }
  }
  // Effect to handle token decoding and permissions fetching
  useEffect(() => {
    const initializePermissions = async () => {
      if (accessToken) {
        try {
          const decodedToken: any = jwtDecode(accessToken)
          const tokenRoleId = decodedToken?.roleId
          if (tokenRoleId && (!permissions || permissions.length === 0)) {
            await fetchPermissions(tokenRoleId)
          }
        } catch (error) {
          console.error("Error decoding token:", error)
        } finally {
          // Ensure loading state is turned off even if there was an error
          setIsLoading(false)
        }
      } else {
        setIsLoading(false)
      }
    }
    initializePermissions()
  }, [accessToken]) // Only depend on accessToken

  return (
    <div className={semidark ? "dark" : ""}>
      <nav
        className={`sidebar fixed bottom-0 top-0 z-50 h-full w-[260px] shadow-[5px_0_25px_0_rgba(94,92,154,0.1)] transition-all duration-300 ${semidark ? "text-white" : ""}`}
      >
        <div className="bg-white dark:bg-black h-full flex flex-col overflow-hidden">
          {/* LOGO */}
          <div className="logo-container z-10 h-[55px] flex items-center justify-between px-2 py-1">
            <Link href="/" className="main-logo flex items-center">
              <img className="ml-[5px] w-8 flex-none" src="/assets/images/logo.svg" alt="logo" />
              <span className="align-middle text-2xl font-extrabold ltr:ml-1.5 rtl:mr-1.5 text-black lg:inline">
                VRISTO
              </span>
            </Link>

            <button
              type="button"
              className="collapse-icon flex h-10 w-10 items-center rounded-full transition duration-300 hover:bg-gray-500 rtl:rotate-180 dark:text-white-light dark:hover:bg-dark-light/10"
              onClick={() => dispatch(toggleSidebar())}
            >
              <IconCaretsDown className="m-auto rotate-90 text-black size-8" />
            </button>
          </div>

          {/* DASHBOARD */}
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <div className="animate-spin h-8 w-8 border-4 border-gray-300 rounded-full border-t-gray-600"></div>
              </div>
            ) : (
              <div className="h-full w-full overflow-x-hidden flex items-center">
                <PerfectScrollbar options={{ suppressScrollX: true }} className="h-full w-full">
                  <div className="flex items-center justify-center min-h-full">
                    <ul className="relative space-y-0.5 p-6 pr-2 font-extrabold w-full">
                      {Array.isArray(permissions) && permissions.length > 0 ? (
                        [...permissions]
                          .sort((a, b) => a.menu_id - b.menu_id)
                          .map((menu) => {
                            // Skip rendering if menu is invalid or doesn't have required properties
                            if (!menu || !menu.menu_id || !menu.menu_name) return null;
                            
                            return (
                              <div key={menu.menu_id}>
                                {/* A- Dashboard Menu */}
                                {menu?.menu_id === 1 ? (
                                  <h2
                                    onClick={() => router.push("/dashboard")}
                                    className="group -mx-[23px] mb-1 flex items-center px-6 py-3 font-extrabold uppercase cursor-pointer
                       bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300
                       dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-600
                       transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-gray-300 hover:via-gray-400 hover:to-gray-500 dark:hover:from-gray-600 dark:hover:via-gray-500 dark:hover:to-gray-400 hover:shadow-xl"
                                  >
                                    {menu.menu_icon && DynamicIconLoader(
                                      menu.menu_icon.replace(/"/g, ""),
                                      "h-7 w-7 -mx-1 flex-none mr-0 text-gray-800 dark:text-gray-400 transition-transform duration-300 ease-in-out group-hover:text-gray-950  dark:group-hover:text-black group-hover:scale-110",
                                    )}
                                    <span
                                      className="text-sm font-extrabold mt-1 text-gray-950 ltr:pl-5 rtl:pr-5 dark:text-gray-400
                         dark:group-hover:text-white
                         transition-colors duration-300 ease-in-out group-hover:text-gray-900 truncate"
                                    >
                                      {menu.menu_name}
                                    </span>
                                  </h2>
                                ) : (
                                  <>
                                    {/* B- Working Area */}
                                    <h2
                                      onClick={() => toggleMenu(menu.menu_id)}
                                      className="group -mx-[23px] mb-1 flex items-center px-6 py-3 font-extrabold uppercase cursor-pointer
                                bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300
                                dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-600
                                transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-gray-300 hover:via-gray-400 hover:to-gray-500 dark:hover:from-gray-600 dark:hover:via-gray-500 dark:hover:to-gray-400 hover:shadow-xl"
                                    >
                                      {menu.menu_icon && DynamicIconLoader(
                                        menu.menu_icon.replace(/"/g, ""),
                                        "h-7 w-7 -mx-1 flex-none mr-0 text-gray-800 dark:text-gray-400 transition-transform duration-300 ease-in-out group-hover:text-gray-950 dark:group-hover:text-black group-hover:scale-110",
                                      )}
                                      <span
                                        className="text-sm font-extrabold mt-1 text-gray-950 ltr:pl-5 rtl:pr-5 dark:text-gray-400
                         dark:group-hover:text-white
                         transition-colors duration-300 ease-in-out group-hover:text-gray-900 truncate"
                                      >
                                        {menu.menu_name}
                                      </span>
                                    </h2>

                                    {/* Tabs */}
                                    <AnimateHeight duration={300} height={currentMenu === menu.menu_id ? "auto" : 0}>
                                      <div className="max-w-full">
                                        {Array.isArray(menu.tabs) && menu.tabs.length > 0 ? (
                                          [...menu.tabs]
                                            .sort((a, b) => a.tab_id - b.tab_id)
                                            .map((tab) => {
                                              // Skip rendering if tab is invalid
                                              if (!tab || !tab.tab_id || !tab.tab_name) return null;
                                              
                                              return (
                                                <li key={tab.tab_id} className="menu nav-item">
                                                  <button
                                                    type="button"
                                                    className={`
                                               nav-link group w-full px-5 py-3 flex items-center justify-between`}
                                                    onClick={() => {
                                                      router.push(tab.routes ? tab.routes.replace(/^"|"$/g, "") : "#")
                                                    }}
                                                  >
                                                    <div className="flex items-center max-w-full overflow-hidden">
                                                      {tab.tab_icon && DynamicIconLoader(
                                                        tab.tab_icon.replace(/"/g, ""),
                                                        "shrink-0 group-hover:!text-primary icon mr-2",
                                                      )}
                                                      <span className="text-[#2f6280] ltr:pl-3 rtl:pr-3 dark:text-[#506690] group-hover:icon truncate">
                                                        {tab.tab_name}
                                                      </span>
                                                    </div>
                                                  </button>
                                                </li>
                                              );
                                            })
                                        ) : null}
                                      </div>
                                    </AnimateHeight>
                                  </>
                                )}
                              </div>
                            );
                          })
                      ) : (
                        <li className="p-4 text-center text-gray-500">No menu items available</li>
                      )}
                    </ul>
                  </div>
                </PerfectScrollbar>
              </div>
            )}
          </div>
        </div>
      </nav>
    </div>
  )
}

export default Sidebar