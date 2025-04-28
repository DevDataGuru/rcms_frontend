"use client";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { ReactSortable } from "react-sortablejs";
import { IRootState } from "@/store";
import {
  FaBalanceScale,
  FaCalendarAlt,
  FaCalendarCheck,
  FaCarAlt,
  FaCashRegister,
  FaClipboardList,
  FaExchangeAlt,
  FaFileInvoiceDollar,
  FaLock,
  FaShoppingCart,
  FaSync,
  FaTools,
  FaUniversity,
  FaWallet,
} from "react-icons/fa";
import { FcAdvance } from "react-icons/fc";
import {
  MdOutlineAccountBalanceWallet,
  MdOutlinePayment,
  MdOutlinePower,
  MdPendingActions,
  MdRefresh,
  MdToll,
} from "react-icons/md";
import { BsChatSquareQuoteFill, BsPersonLinesFill } from "react-icons/bs";
import Link from "next/link";

const ComponentsDragndropGrid = () => {
  const [gridDrag, setGridDrag] = useState<{ id: number; name: string }[]>([
    { id: 1, name: "Item 1" },
    { id: 2, name: "Item 2" },
    { id: 3, name: "Item 3" },
    { id: 4, name: "Item 4" },
    { id: 5, name: "Item 5" },
    { id: 6, name: "Item 6" },
    { id: 7, name: "Item 7" },
    { id: 8, name: "Item 8" },
    { id: 9, name: "Item 9" },
    { id: 10, name: "Item 10" },
    { id: 11, name: "Item 11" },
    { id: 12, name: "Item 12" },
    { id: 13, name: "Item 13" },
    { id: 14, name: "Item 14" },
    { id: 15, name: "Item 15" },
    { id: 16, name: "Item 16" },
    { id: 17, name: "Item 17" },
    { id: 18, name: "Item 18" },
    { id: 19, name: "Item 19" },
    { id: 20, name: "Item 20" },
    { id: 21, name: "Item 21" },
    { id: 22, name: "Item 22" },
    { id: 23, name: "Item 23" },
  ]);
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === "rtl";
  const flatGridDrag = gridDrag.flat(); // This will flatten the array

  return (
    <div className="dragndrop space-y-8">
      <div id="example11">
        <ReactSortable
          list={gridDrag}
          setList={setGridDrag}
          animation={200}
          className="mb-6 grid grid-cols-1 gap-6 text-white sm:grid-cols-2 xl:grid-cols-4"
        >
          {/* {gridDrag.map((item) => (
            <div
              key={item.id}
              className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-blue-500 to-blue-300 p-6 text-white"
            >
              {item.name}
            </div>
          ))} */}

          {/* ================================================================================================================ */}

          {/* 1- CASHBOX */}
          <div
            key={1}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-blue-500 to-blue-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaCashRegister size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">Cashbox</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>

          {/* ================================================================================================================ */}

          {/* 2- VAT BALANCE */}
          <div
            key={2}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-teal-600 to-teal-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaBalanceScale size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">VAT Balance</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 3-LATE ORDERS */}
          <div
            key={3}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-green-600 to-green-400 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute inset-0 flex items-center justify-start opacity-15 pl-4">
              <MdPendingActions size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">33 Late Orders</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 4-BANK ACCOUNTS*/}
          <div
            key={4}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-yellow-500 to-yellow-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaUniversity size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">Bank Accounts</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 5-ABU DHABI TOLL */}
          <div
            key={5}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-orange-500 to-orange-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <MdToll size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">Abu Dhabi Toll</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 6-TRAFFIC FINES SYNC */}
          <div
            key={6}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-red-500 to-red-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaSync size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">
                  195 Traffic Files Sync
                </div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 7-UNPAID INVOICES */}
          <div
            key={7}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-pink-500 to-pink-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaFileInvoiceDollar size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">
                  75 Unpaid Invoices (Traffic Fines)
                </div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 8-SALIK BALANCE */}
          <div
            key={8}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-purple-500 to-purple-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <MdOutlineAccountBalanceWallet size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">Salik Balance</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 9-ACTIVE ORDERS */}
          <div
            key={9}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-indigo-500 to-indigo-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaClipboardList size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">39 Active Orders</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 10-Security Deposits Invoices */}
          <div
            key={10}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-cyan-500 to-cyan-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaLock size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">
                  0 Security Deposit Invoices
                </div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 11- UNPAID INVOICES */}
          <div
            key={11}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-lime-500 to-lime-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaFileInvoiceDollar size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">127 Unpaid Invoices</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 12- VEHICLE MAINTENANCE */}
          <div
            key={12}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-rose-500 to-rose-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaTools size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">Vehicles Maintenance</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 13-ACTIVE QUOTES */}
          <div
            key={13}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r  from-gray-700 to-gray-500 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <BsChatSquareQuoteFill size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">0 Active Quotes</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 14-PENDING RESERVATIONS */}
          <div
            key={14}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-sky-500 to-sky-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaCalendarAlt size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">Pending Reservations</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 15-TODAY RESERVATIONS (CONFIRMED)*/}
          <div
            key={15}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-amber-500 to-amber-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaCalendarCheck size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">
                  Today Reservations (Confirmed
                </div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 16-UNPAID BILLS */}
          <div
            key={16}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-fuchsia-500 to-fuchsia-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <MdOutlinePayment size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">Unpaid Bills</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 17- AVAILABLE VEHICLES */}
          <div
            key={17}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-stone-500 to-stone-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaCarAlt size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">Available Vehicles</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 18- RECHARGE */}
          <div
            key={18}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <MdOutlinePower size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">Recharge</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 19- ACTIVE LEADS */}
          <div
            key={19}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-slate-600 to-slate-400 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <BsPersonLinesFill size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">Active Leads</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 20- Transactions */}
          <div
            key={20}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-violet-500 to-violet-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaExchangeAlt size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">Today Transactions</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 21- PETTY CASH & EXPENSES */}
          <div
            key={21}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-zinc-500 to-zinc-300 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaWallet size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">Petty Cash & Expense</div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 22- ACTIVE PURCHASE ORDERS */}
          <div
            key={22}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-yellow-600 to-orange-400 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <FaShoppingCart size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">
                  0 Active Purchase Orders
                </div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>
          {/* ================================================================================================================ */}

          {/* 23- LATEST DASHBOARD REFRESH */}
          <div
            key={23}
            className="cursor-pointer panel h-[95px] w-auto transition ease-in-out delay-150 shadow-lg shadow-blue-500/50 hover:-translate-y-1 hover:scale-110 hover:bg-indigo-500 duration-300 rounded-lg bg-gradient-to-r from-blue-600 to-purple-400 p-6 text-white"
          >
            {/* Background Watermark Icon */}
            <div className="ml-8 mb-8 absolute  inset-0 flex items-center justify-start opacity-15 pl-4">
              <MdRefresh size={40} />
            </div>

            {/* Content */}
            <div className="z-10 flex flex-col justify-between w-full">
              {/* Top Section */}
              <div className=" flex flex-col justify-between items-end flex-grow translate-y-[-20px]">
                <div className="text-xl font-bold">
                  915.27 <span className="text-lg">AED</span>
                </div>
                <div className="text-sm font-medium">
                  Latest Dashboard Refresh
                </div>
              </div>

              {/* View More Section at the bottom */}
              <div className="absolute bottom-0 rounded-lg left-0 w-full flex items-center justify-between text-sm font-semibold bg-white/30 px-4 py-2 cursor-pointer">
                {/* Use Link component to navigate when clicked */}
                <Link href="/new-page" passHref>
                  <span>VIEW MORE</span>
                </Link>
                <FcAdvance className="text-lg" />
              </div>
            </div>
          </div>

          {/* ================================================================================================================ */}
        </ReactSortable>
      </div>
    </div>
  );
};

export default ComponentsDragndropGrid;
