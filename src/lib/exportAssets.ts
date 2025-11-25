import { Asset } from "@/types";
import { toast } from "react-hot-toast";

const exportAssets = async (filteredAssets: Asset[]) => {
  try {
    // Dynamically import SheetJS
    const XLSX = await import("xlsx");

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // ==================== MAIN ASSETS SHEET ====================
    const mainData = filteredAssets.map((asset, index) => ({
      "No.": index + 1,
      "Asset Code": asset.code,
      "Asset Name": asset.name,
      Category: asset.category,
      Status: asset.status.charAt(0).toUpperCase() + asset.status.slice(1),
      Condition:
        asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1),
      Location: asset.location,
      "Purchase Date": asset.purchaseDate
        ? formatDate(asset.purchaseDate)
        : "N/A",
      "Purchase Price": `ETB ${asset.purchasePrice.toLocaleString()}`,
      Supplier: asset.supplier,
      "Serial Number": asset.serialNumber || "N/A",
      "Warranty Expiry": asset.warrantyExpiry
        ? formatDate(asset.warrantyExpiry)
        : "N/A",
      Tags: asset.tags.join(", ") || "None",
      "Last Maintenance": asset.lastMaintenanceDate
        ? formatDate(asset.lastMaintenanceDate)
        : "Never",
      "Next Maintenance": asset.nextMaintenanceDate
        ? formatDate(asset.nextMaintenanceDate)
        : "Not Scheduled",
      "Days Since Maintenance": asset.lastMaintenanceDate
        ? calculateDaysSince(asset.lastMaintenanceDate)
        : "N/A",
      "Asset Age": calculateAssetAge(asset.purchaseDate),
    }));

    const mainWorksheet = XLSX.utils.json_to_sheet(mainData);

    // Premium styling for main sheet - Blue header
    enhanceWorksheetStyle(XLSX, mainWorksheet, mainData.length, false, {
      headerBg: "FF2C5FAA", // Premium Blue
      headerText: "FFFFFFFF",
      alternateRow1: "FFE3F2FD", // Light Blue
      alternateRow2: "FFF3F8FF", // Very Light Blue
    });

    // Add main sheet to workbook
    XLSX.utils.book_append_sheet(workbook, mainWorksheet, "Assets Overview");

    // ==================== DETAILED SHEET ====================
    const detailedData = filteredAssets.map((asset, index) => ({
      "No.": index + 1,
      "Asset Code": asset.code,
      "Asset Name": asset.name,
      Description: asset.description || "No description",
      Category: asset.category,
      Status: asset.status.charAt(0).toUpperCase() + asset.status.slice(1),
      Condition:
        asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1),
      Location: asset.location,
      "Purchase Date": asset.purchaseDate
        ? formatDate(asset.purchaseDate)
        : "N/A",
      "Purchase Price (ETB)": asset.purchasePrice,
      Supplier: asset.supplier,
      "Serial Number": asset.serialNumber || "Not Provided",
      "Warranty Expiry": asset.warrantyExpiry
        ? formatDate(asset.warrantyExpiry)
        : "No Warranty",
      "Warranty Status": getWarrantyStatus(asset.warrantyExpiry),
      "Last Maintenance Date": asset.lastMaintenanceDate
        ? formatDate(asset.lastMaintenanceDate)
        : "Never",
      "Next Maintenance Date": asset.nextMaintenanceDate
        ? formatDate(asset.nextMaintenanceDate)
        : "Not Scheduled",
      "Maintenance Due": getMaintenanceStatus(asset.nextMaintenanceDate),
      Tags: asset.tags.join(", ") || "None",
      "Number of Images": asset.images.length,
      "Asset Age (Years)": calculateAssetAgeInYears(asset.purchaseDate),
      "Depreciation Value": calculateDepreciation(
        asset.purchaseDate,
        asset.purchasePrice
      ),
      "Created Date": formatDate(asset.createdAt),
      "Last Updated": formatDate(asset.updatedAt),
    }));

    const detailedWorksheet = XLSX.utils.json_to_sheet(detailedData);

    // Premium styling for detailed sheet - Green header
    enhanceWorksheetStyle(XLSX, detailedWorksheet, detailedData.length, true, {
      headerBg: "FF27AE60", // Premium Green
      headerText: "FFFFFFFF",
      alternateRow1: "FFE8F5E8", // Light Green
      alternateRow2: "FFF1F8E9", // Very Light Green
    });

    XLSX.utils.book_append_sheet(workbook, detailedWorksheet, "Asset Details");

    // ==================== MAINTENANCE SCHEDULE SHEET ====================
    const maintenanceData = filteredAssets
      .filter((asset) => asset.nextMaintenanceDate)
      .map((asset, index) => ({
        "No.": index + 1,
        "Asset Code": asset.code,
        "Asset Name": asset.name,
        Category: asset.category,
        Condition:
          asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1),
        "Last Maintenance": asset.lastMaintenanceDate
          ? formatDate(asset.lastMaintenanceDate)
          : "Never",
        "Next Maintenance": asset.nextMaintenanceDate
          ? formatDate(asset.nextMaintenanceDate)
          : "Not Scheduled",
        "Days Until Maintenance": asset.nextMaintenanceDate
          ? calculateDaysUntil(asset.nextMaintenanceDate)
          : "N/A",
        "Maintenance Priority": getMaintenancePriority(
          asset.condition,
          asset.nextMaintenanceDate
        ),
        Location: asset.location,
        "Assigned To": asset.assignedTo ? "Assigned" : "Unassigned",
      }));

    const maintenanceWorksheet = XLSX.utils.json_to_sheet(maintenanceData);

    // Premium styling for maintenance sheet - Orange header
    enhanceWorksheetStyle(
      XLSX,
      maintenanceWorksheet,
      maintenanceData.length,
      false,
      {
        headerBg: "FFE67E22", // Premium Orange
        headerText: "FFFFFFFF",
        alternateRow1: "FFFCEBCD", // Light Orange
        alternateRow2: "FFFEF5E7", // Very Light Orange
      }
    );

    XLSX.utils.book_append_sheet(
      workbook,
      maintenanceWorksheet,
      "Maintenance Schedule"
    );

    // ==================== STATISTICS SHEET ====================
    const stats = calculateAssetStatistics(filteredAssets);
    const statsData = [
      ["ASSET MANAGEMENT REPORT", ""],
      ["Generated On", new Date().toLocaleString()],
      ["Total Assets", stats.totalAssets],
      ["Available Assets", stats.availableAssets],
      ["Assigned Assets", stats.assignedAssets],
      ["Under Maintenance", stats.maintenanceAssets],
      ["Retired Assets", stats.retiredAssets],
      ["Total Asset Value", `ETB ${stats.totalValue.toLocaleString()}`],
      ["Average Asset Value", `ETB ${stats.averageValue.toLocaleString()}`],
      ["", ""],
      ["CONDITION BREAKDOWN", ""],
      ["Excellent Condition", stats.conditionStats.excellent],
      ["Good Condition", stats.conditionStats.good],
      ["Fair Condition", stats.conditionStats.fair],
      ["Poor Condition", stats.conditionStats.poor],
      ["", ""],
      ["CATEGORY DISTRIBUTION", ""],
      ...Object.entries(stats.categoryDistribution).map(([category, count]) => [
        category,
        count,
      ]),
      ["", ""],
      ["MAINTENANCE OVERVIEW", ""],
      ["Assets Due for Maintenance", stats.maintenanceDue],
      ["Assets with Warranty", stats.assetsWithWarranty],
      ["Warranty Expired", stats.warrantyExpired],
      ["Average Asset Age", `${stats.averageAge} years`],
    ];

    const statsWorksheet = XLSX.utils.aoa_to_sheet(statsData);

    // Premium styling for statistics sheet - Purple header
    enhanceStatsWorksheetStyle(XLSX, statsWorksheet, statsData.length, {
      headerBg: "FF8E44AD", // Premium Purple
      headerText: "FFFFFFFF",
      accent1: "FFF3E5F5", // Light Purple
      accent2: "FFE1D5F5", // Very Light Purple
    });

    XLSX.utils.book_append_sheet(workbook, statsWorksheet, "Statistics");

    // ==================== ASSIGNMENT OVERVIEW SHEET ====================
    const assignmentData = filteredAssets.map((asset, index) => ({
      "No.": index + 1,
      "Asset Code": asset.code,
      "Asset Name": asset.name,
      Category: asset.category,
      Status: asset.status.charAt(0).toUpperCase() + asset.status.slice(1),
      "Assigned To": asset.assignedTo || "Unassigned",
      Location: asset.location,
      Condition:
        asset.condition.charAt(0).toUpperCase() + asset.condition.slice(1),
      "Last Maintenance": asset.lastMaintenanceDate
        ? formatDate(asset.lastMaintenanceDate)
        : "Never",
      "Asset Value": `ETB ${asset.purchasePrice.toLocaleString()}`,
    }));

    const assignmentWorksheet = XLSX.utils.json_to_sheet(assignmentData);

    // Premium styling for assignment sheet - Teal header
    enhanceWorksheetStyle(
      XLSX,
      assignmentWorksheet,
      assignmentData.length,
      false,
      {
        headerBg: "FF16A085", // Premium Teal
        headerText: "FFFFFFFF",
        alternateRow1: "FFE0F2F1", // Light Teal
        alternateRow2: "FFF0FDFA", // Very Light Teal
      }
    );

    XLSX.utils.book_append_sheet(
      workbook,
      assignmentWorksheet,
      "Assignment Overview"
    );

    // ==================== EXPORT FILE ====================
    const date = new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toISOString().slice(11, 19).replace(/:/g, "-");
    XLSX.writeFile(
      workbook,
      `Sunday_School_Assets_Report_${date}_${timestamp}.xlsx`
    );

    toast.success(
      `📊 Exported ${filteredAssets.length} assets with premium colored report`
    );
  } catch (error) {
    console.error("Export error:", error);
    toast.error("❌ Failed to generate asset export report");
  }
};

// ==================== PREMIUM STYLING FUNCTIONS ====================
interface ColorScheme {
  headerBg: string;
  headerText: string;
  alternateRow1?: string;
  alternateRow2?: string;
  accent1?: string;
  accent2?: string;
}

const enhanceWorksheetStyle = (
  XLSX: any,
  worksheet: any,
  dataLength: number,
  isDetailed: boolean = false,
  colors: ColorScheme
) => {
  // Get range
  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  // Style headers
  for (let C = range.s.c; C <= range.e.c; C++) {
    const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c: C });
    if (!worksheet[cellAddress]) continue;

    // Header styling
    if (range.s.r === 0) {
      worksheet[cellAddress].s = {
        fill: { fgColor: { rgb: colors.headerBg } },
        font: {
          name: "Arial",
          sz: 12,
          bold: true,
          color: { rgb: colors.headerText },
        },
        alignment: {
          horizontal: "center",
          vertical: "center",
          wrapText: true,
        },
        border: {
          top: {
            style: "thin",
            color: { rgb: darkenColor(colors.headerBg, 30) },
          },
          left: {
            style: "thin",
            color: { rgb: darkenColor(colors.headerBg, 30) },
          },
          bottom: {
            style: "thin",
            color: { rgb: darkenColor(colors.headerBg, 30) },
          },
          right: {
            style: "thin",
            color: { rgb: darkenColor(colors.headerBg, 30) },
          },
        },
      };
    }

    // Data rows styling with enhanced colors
    for (let R = range.s.r + 1; R <= range.e.r; R++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;

      const isEvenRow = (R - range.s.r) % 2 === 0;

      worksheet[cellAddress].s = {
        fill: {
          fgColor: {
            rgb: isEvenRow ? colors.alternateRow1! : colors.alternateRow2!,
          },
        },
        font: {
          name: "Calibri",
          sz: 11,
          color: { rgb: "FF2C3E50" }, // Darker text for better contrast
        },
        alignment: {
          vertical: "center",
          wrapText: true,
        },
        border: {
          top: { style: "thin", color: { rgb: "FFD0D0D0" } },
          left: { style: "thin", color: { rgb: "FFD0D0D0" } },
          bottom: { style: "thin", color: { rgb: "FFD0D0D0" } },
          right: { style: "thin", color: { rgb: "FFD0D0D0" } },
        },
      };

      // Enhanced special styling for specific columns with better colors
      const headerValue = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })]?.v;

      if (headerValue === "Status") {
        const cellValue = worksheet[cellAddress].v;
        if (cellValue === "Available") {
          worksheet[cellAddress].s.font.color = { rgb: "FF27AE60" }; // Green
          worksheet[cellAddress].s.font.bold = true;
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFE8F5E8"; // Light green background
        } else if (cellValue === "Maintenance") {
          worksheet[cellAddress].s.font.color = { rgb: "FFE67E22" }; // Orange
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFFCEBCD"; // Light orange background
        } else if (cellValue === "Assigned") {
          worksheet[cellAddress].s.font.color = { rgb: "FF3498DB" }; // Blue
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFEBF5FB"; // Light blue background
        } else if (cellValue === "Retired") {
          worksheet[cellAddress].s.font.color = { rgb: "FFE74C3C" }; // Red
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFFDEDEC"; // Light red background
        }
      }

      if (headerValue === "Condition") {
        const cellValue = worksheet[cellAddress].v;
        if (cellValue === "Excellent") {
          worksheet[cellAddress].s.font.color = { rgb: "FF27AE60" }; // Green
          worksheet[cellAddress].s.font.bold = true;
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFE8F5E8"; // Light green
        } else if (cellValue === "Good") {
          worksheet[cellAddress].s.font.color = { rgb: "FF2ECC71" }; // Bright Green
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFEAFBF1"; // Very light green
        } else if (cellValue === "Fair") {
          worksheet[cellAddress].s.font.color = { rgb: "FFF39C12" }; // Yellow-Orange
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFFEF5E7"; // Light yellow
        } else if (cellValue === "Poor") {
          worksheet[cellAddress].s.font.color = { rgb: "FFE74C3C" }; // Red
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFFDEDEC"; // Light red
        }
      }

      if (headerValue === "Maintenance Priority") {
        const cellValue = worksheet[cellAddress].v;
        if (cellValue === "High") {
          worksheet[cellAddress].s.font.color = { rgb: "FFE74C3C" }; // Red
          worksheet[cellAddress].s.font.bold = true;
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFFDEDEC"; // Light red
        } else if (cellValue === "Medium") {
          worksheet[cellAddress].s.font.color = { rgb: "FFF39C12" }; // Orange
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFFEF5E7"; // Light orange
        } else if (cellValue === "Low") {
          worksheet[cellAddress].s.font.color = { rgb: "FF27AE60" }; // Green
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFE8F5E8"; // Light green
        }
      }

      if (headerValue === "Warranty Status") {
        const cellValue = worksheet[cellAddress].v;
        if (cellValue === "Active") {
          worksheet[cellAddress].s.font.color = { rgb: "FF27AE60" }; // Green
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFE8F5E8"; // Light green
        } else if (cellValue === "Expiring Soon") {
          worksheet[cellAddress].s.font.color = { rgb: "FFF39C12" }; // Orange
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFFEF5E7"; // Light orange
        } else if (cellValue === "Expired") {
          worksheet[cellAddress].s.font.color = { rgb: "FFE74C3C" }; // Red
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFFDEDEC"; // Light red
        } else if (cellValue === "No Warranty") {
          worksheet[cellAddress].s.font.color = { rgb: "FF95A5A6" }; // Gray
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFECF0F1"; // Light gray
        }
      }

      if (headerValue === "Maintenance Due") {
        const cellValue = worksheet[cellAddress].v;
        if (cellValue === "Overdue") {
          worksheet[cellAddress].s.font.color = { rgb: "FFE74C3C" }; // Red
          worksheet[cellAddress].s.font.bold = true;
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFFDEDEC"; // Light red
        } else if (cellValue === "Due Soon") {
          worksheet[cellAddress].s.font.color = { rgb: "FFF39C12" }; // Orange
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFFEF5E7"; // Light orange
        } else if (cellValue === "Scheduled") {
          worksheet[cellAddress].s.font.color = { rgb: "FF27AE60" }; // Green
          worksheet[cellAddress].s.fill.fgColor.rgb = "FFE8F5E8"; // Light green
        }
      }
    }
  }

  // Set column widths based on content
  const colWidths = isDetailed
    ? // Detailed sheet widths
      [
        { wch: 6 }, // No.
        { wch: 12 }, // Asset Code
        { wch: 25 }, // Asset Name
        { wch: 30 }, // Description
        { wch: 15 }, // Category
        { wch: 12 }, // Status
        { wch: 12 }, // Condition
        { wch: 20 }, // Location
        { wch: 12 }, // Purchase Date
        { wch: 15 }, // Purchase Price (ETB)
        { wch: 20 }, // Supplier
        { wch: 15 }, // Serial Number
        { wch: 12 }, // Warranty Expiry
        { wch: 15 }, // Warranty Status
        { wch: 15 }, // Last Maintenance Date
        { wch: 15 }, // Next Maintenance Date
        { wch: 15 }, // Maintenance Due
        { wch: 20 }, // Tags
        { wch: 15 }, // Number of Images
        { wch: 15 }, // Asset Age (Years)
        { wch: 15 }, // Depreciation Value
        { wch: 12 }, // Created Date
        { wch: 12 }, // Last Updated
      ]
    : // Main sheet widths
      [
        { wch: 6 }, // No.
        { wch: 12 }, // Asset Code
        { wch: 25 }, // Asset Name
        { wch: 15 }, // Category
        { wch: 12 }, // Status
        { wch: 12 }, // Condition
        { wch: 20 }, // Location
        { wch: 12 }, // Purchase Date
        { wch: 15 }, // Purchase Price
        { wch: 20 }, // Supplier
        { wch: 15 }, // Serial Number
        { wch: 12 }, // Warranty Expiry
        { wch: 20 }, // Tags
        { wch: 15 }, // Last Maintenance
        { wch: 15 }, // Next Maintenance
        { wch: 18 }, // Days Since Maintenance
        { wch: 12 }, // Asset Age
      ];

  worksheet["!cols"] = colWidths;

  // Freeze header row
  worksheet["!freeze"] = { x: 0, y: 1 };
};

const enhanceStatsWorksheetStyle = (
  XLSX: any,
  worksheet: any,
  dataLength: number,
  colors: ColorScheme
) => {
  const range = XLSX.utils.decode_range(worksheet["!ref"]);

  for (let R = range.s.r; R <= range.e.r; R++) {
    for (let C = range.s.c; C <= range.e.c; C++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;

      const cellValue = worksheet[cellAddress].v;

      // Section headers with gradient-like effect
      if (
        typeof cellValue === "string" &&
        (cellValue.includes("REPORT") ||
          cellValue.includes("BREAKDOWN") ||
          cellValue.includes("DISTRIBUTION") ||
          cellValue.includes("OVERVIEW"))
      ) {
        worksheet[cellAddress].s = {
          fill: { fgColor: { rgb: colors.headerBg } },
          font: {
            name: "Arial",
            sz: 14,
            bold: true,
            color: { rgb: colors.headerText },
          },
          alignment: { horizontal: "left" },
          border: {
            bottom: {
              style: "medium",
              color: { rgb: darkenColor(colors.headerBg, 20) },
            },
          },
        };
      }
      // Metric labels with accent colors
      else if (
        C === 0 &&
        R > 0 &&
        worksheet[XLSX.utils.encode_cell({ r: R, c: 1 })]?.v
      ) {
        worksheet[cellAddress].s = {
          font: {
            name: "Calibri",
            sz: 11,
            bold: true,
            color: { rgb: "FF2C3E50" },
          },
          fill: { fgColor: { rgb: colors.accent1 || "FFF0F4FF" } },
          border: {
            right: { style: "thin", color: { rgb: "FFD0D0D0" } },
          },
        };
      }
      // Metric values with different accent
      else if (C === 1 && R > 0) {
        worksheet[cellAddress].s = {
          font: {
            name: "Calibri",
            sz: 11,
            color: { rgb: colors.headerBg },
            bold: true,
          },
          alignment: { horizontal: "right" },
          fill: { fgColor: { rgb: colors.accent2 || "FFF8F9FF" } },
        };
      }
    }
  }

  worksheet["!cols"] = [{ wch: 30 }, { wch: 20 }];
};

// Enhanced color darkening function
const darkenColor = (color: string, amount: number = 20): string => {
  const hex = color.replace("FF", "");
  const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - amount)
    .toString(16)
    .padStart(2, "0");
  const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - amount)
    .toString(16)
    .padStart(2, "0");
  const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - amount)
    .toString(16)
    .padStart(2, "0");
  return `FF${r}${g}${b}`;
};

// ==================== UTILITY FUNCTIONS ====================
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const calculateDaysSince = (dateString: string): number => {
  const today = new Date();
  const lastDate = new Date(dateString);
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateDaysUntil = (dateString: string): number => {
  const today = new Date();
  const futureDate = new Date(dateString);
  const diffTime = futureDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateAssetAge = (purchaseDateString: string): string => {
  const today = new Date();
  const purchase = new Date(purchaseDateString);
  const months =
    (today.getFullYear() - purchase.getFullYear()) * 12 +
    today.getMonth() -
    purchase.getMonth();

  if (months < 12) {
    return `${months} month${months !== 1 ? "s" : ""}`;
  } else {
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;
    return `${years} year${years !== 1 ? "s" : ""}${
      remainingMonths > 0
        ? `, ${remainingMonths} month${remainingMonths !== 1 ? "s" : ""}`
        : ""
    }`;
  }
};

const calculateAssetAgeInYears = (purchaseDateString: string): number => {
  const today = new Date();
  const purchase = new Date(purchaseDateString);
  return Math.floor(
    (today.getTime() - purchase.getTime()) / (1000 * 60 * 60 * 24 * 365.25)
  );
};

const calculateDepreciation = (
  purchaseDateString: string,
  purchasePrice: number
): string => {
  const ageInYears = calculateAssetAgeInYears(purchaseDateString);
  // Simple straight-line depreciation over 10 years
  const annualDepreciation = purchasePrice / 10;
  const depreciatedValue = Math.max(
    0,
    purchasePrice - annualDepreciation * ageInYears
  );
  return `ETB ${Math.round(depreciatedValue).toLocaleString()}`;
};

const getWarrantyStatus = (warrantyExpiry?: string): string => {
  if (!warrantyExpiry) return "No Warranty";

  const today = new Date();
  const expiry = new Date(warrantyExpiry);

  if (expiry < today) return "Expired";

  const daysUntilExpiry = calculateDaysUntil(warrantyExpiry);
  if (daysUntilExpiry <= 30) return "Expiring Soon";
  return "Active";
};

const getMaintenanceStatus = (nextMaintenanceDate?: string): string => {
  if (!nextMaintenanceDate) return "Not Scheduled";

  const daysUntil = calculateDaysUntil(nextMaintenanceDate);
  if (daysUntil <= 0) return "Overdue";
  if (daysUntil <= 7) return "Due Soon";
  return "Scheduled";
};

const getMaintenancePriority = (
  condition: string,
  nextMaintenanceDate?: string
): string => {
  if (condition === "poor") return "High";
  if (condition === "fair") return "Medium";

  if (nextMaintenanceDate) {
    const daysUntil = calculateDaysUntil(nextMaintenanceDate);
    if (daysUntil <= 0) return "High";
    if (daysUntil <= 7) return "Medium";
  }

  return "Low";
};

const calculateAssetStatistics = (assets: Asset[]) => {
  const stats = {
    totalAssets: assets.length,
    availableAssets: assets.filter((a) => a.status === "available").length,
    assignedAssets: assets.filter((a) => a.status === "assigned").length,
    maintenanceAssets: assets.filter((a) => a.status === "maintenance").length,
    retiredAssets: assets.filter((a) => a.status === "retired").length,
    totalValue: assets.reduce((sum, asset) => sum + asset.purchasePrice, 0),
    averageValue: 0,
    conditionStats: {
      excellent: assets.filter((a) => a.condition === "excellent").length,
      good: assets.filter((a) => a.condition === "good").length,
      fair: assets.filter((a) => a.condition === "fair").length,
      poor: assets.filter((a) => a.condition === "poor").length,
    },
    categoryDistribution: {} as { [key: string]: number },
    maintenanceDue: assets.filter((a) => {
      if (!a.nextMaintenanceDate) return false;
      return calculateDaysUntil(a.nextMaintenanceDate) <= 0;
    }).length,
    assetsWithWarranty: assets.filter((a) => a.warrantyExpiry).length,
    warrantyExpired: assets.filter((a) => {
      if (!a.warrantyExpiry) return false;
      return new Date(a.warrantyExpiry) < new Date();
    }).length,
    averageAge: 0,
  };

  // Calculate average value
  stats.averageValue =
    stats.totalAssets > 0
      ? Math.round(stats.totalValue / stats.totalAssets)
      : 0;

  // Calculate average age
  const ages = assets.map((asset) =>
    calculateAssetAgeInYears(asset.purchaseDate)
  );
  stats.averageAge =
    ages.length > 0
      ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length)
      : 0;

  // Calculate category distribution
  assets.forEach((asset) => {
    stats.categoryDistribution[asset.category] =
      (stats.categoryDistribution[asset.category] || 0) + 1;
  });

  return stats;
};

export default exportAssets;
