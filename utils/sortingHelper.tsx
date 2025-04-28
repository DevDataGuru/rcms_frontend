import _ from "lodash";

// Improved type definitions
type DataItem = {
  id: string | number;
  name: string;
  [key: string]: any;
};

type DataMap = {
  [key: string]: DataItem[];
};

type SortStatus = {
  columnAccessor: string;
  direction: "asc" | "desc";
};

// Safely create data map entries
export const createDataMapEntry = (
  data: any[] | null | undefined,
  idKey: string = "id",
  nameKey: string = "name"
): DataItem[] => {
  if (!Array.isArray(data)) return [];
  
  return data
    .filter(item => item && (item[idKey] != null) && (item[nameKey] != null))
    .map(item => ({
      id: item[idKey],
      name: item[nameKey],
    }));
};

// Enhanced nested value getter
export const getNestedValue = (
  obj: any,
  accessor: string,
  dataMap: DataMap
): string | number | Date => {
  // Safety check for null/undefined object
  if (!obj) return "";

  // Handle mapped values (like foreign keys)
  if (dataMap && accessor in dataMap) {
    const data = dataMap[accessor] || [];
    const matchedItem = data.find(item => item.id === obj[accessor]);
    return matchedItem?.name || "";
  }

  // Handle nested paths safely
  const value = _.get(obj, accessor, "");
  return value ?? "";
};

// Improved sort function
export const sortData = (
  data: any[],
  sortStatus: SortStatus,
  dataMap: DataMap
): any[] => {
  // Safety checks
  if (!Array.isArray(data)) return [];
  if (!sortStatus?.columnAccessor) return data;

  const { columnAccessor, direction } = sortStatus;

  return _.orderBy(
    data,
    [(item) => {
      const value = getNestedValue(item, columnAccessor, dataMap);

      // Handle different value types
      if (value === null || value === undefined) return "";
      
      // Handle numeric values
      if (!isNaN(Number(value)) && value !== "") {
        return Number(value);
      }

      // Handle dates
      if (columnAccessor.toLowerCase().includes("date") && value) {
        const date = new Date(value);
        return isNaN(date.getTime()) ? value : date;
      }

      // Handle strings (case-insensitive)
      return String(value).toLowerCase();
    }],
    [direction]
  );
};

// Safe date formatter
export const toISO = (date: string | Date | null | undefined): string | null => {
  if (!date) return null;
  
  const parsed = new Date(date);
  return isNaN(parsed.getTime()) ? null : parsed.toISOString();
};

// Helper to create the complete dataMap
export const createDataMap = (
  mappings: { [key: string]: { data: any[]; idKey?: string; nameKey?: string } }
): DataMap => {
  const dataMap: DataMap = {};
  
  Object.entries(mappings).forEach(([key, config]) => {
    dataMap[key] = createDataMapEntry(
      config.data,
      config.idKey || "id",
      config.nameKey || "name"
    );
  });
  
  return dataMap;
};