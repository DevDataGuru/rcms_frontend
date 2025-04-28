export const getSidebarItemClasses = (sidebarTextVisible: boolean, isActive = false) => {
    const baseClasses = `group -mx-[22px] mb-1 flex items-center px-5 py-3 font-extrabold uppercase cursor-pointer 
    transition-all duration-300 ease-in-out 
    bg-gradient-to-r from-gray-100 via-gray-200 to-gray-300 
    dark:bg-gradient-to-r dark:from-gray-800 dark:via-gray-700 dark:to-gray-600`;

    const activeClasses = isActive 
        ? 'bg-primary/10 text-primary' 
        : 'hover:bg-gradient-to-r hover:from-gray-300 hover:via-gray-400 hover:to-gray-500 dark:hover:from-gray-600 dark:hover:via-gray-500 dark:hover:to-gray-400';

    return `${baseClasses} ${activeClasses} ${!sidebarTextVisible ? 'justify-center' : ''}`;
};

export const getIconClasses = (sidebarTextVisible: boolean) => {
    return `h-7 w-7 flex-none mr-0 text-gray-800 dark:text-gray-400 
    ${!sidebarTextVisible ? 'mx-auto' : ''} 
    transition-transform duration-300 ease-in-out 
    group-hover:text-gray-950 dark:group-hover:text-black group-hover:scale-110`;
};

export const getTextClasses = (sidebarTextVisible: boolean) => {
    return `text-sm font-extrabold mt-1 text-gray-950 
    ${!sidebarTextVisible ? 'hidden' : 'block'} 
    ltr:pl-5 rtl:pr-5 dark:text-gray-400 
    dark:group-hover:text-white 
    transition-colors duration-300 ease-in-out group-hover:text-gray-900`;
};