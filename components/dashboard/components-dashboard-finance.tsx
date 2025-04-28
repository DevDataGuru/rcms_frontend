"use client";
import { IRootState } from "@/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import ComponentsDragndropGrid from "../dragndrop/components-dragndrop-grid";

const ComponentsDashboardFinance = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === "rtl";

  return (
    <div>
      <div className="pt-5 ">
        <ComponentsDragndropGrid />
      </div>
    </div>
  );
};

export default ComponentsDashboardFinance;
