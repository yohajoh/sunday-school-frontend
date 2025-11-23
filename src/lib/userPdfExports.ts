import { User } from "@/types";
import { toast } from "react-hot-toast";

const exportUsers = async (filteredUsers: User[]) => {
  try {
    // Dynamically import SheetJS
    const XLSX = await import("xlsx");

    // Create workbook
    const workbook = XLSX.utils.book_new();

    // ==================== MAIN USERS SHEET ====================
    const mainData = filteredUsers.map((user, index) => ({
      "No.": index + 1,
      "Student ID": user.studentId,
      "Full Name": `${user.firstName} ${
        user.middleName ? user.middleName + " " : ""
      }${user.lastName}`,
      Email: user.email,
      Phone: user.phoneNumber,
      Role: user.role.toUpperCase(),
      Status: user.status.charAt(0).toUpperCase() + user.status.slice(1),
      Sex: user.sex?.charAt(0).toUpperCase() + user.sex?.slice(1) || "",
      "Date of Birth": user.dateOfBirth ? formatDate(user.dateOfBirth) : "N/A",
      "National ID": user.nationalId,
      Occupation: user.occupation || "Not Specified",
      "Marriage Status": formatMarriageStatus(user.marriageStatus),
      Disability: user.disability ? "Yes" : "No",
      "Disability Type": user.disabilityType || "None",
      Location: `${user.region}${user.zone ? `, ${user.zone}` : ""}${
        user.woreda ? `, ${user.woreda}` : ""
      }`,
      Church: user.church,
      "Parent/Guardian": user.parentFullName,
      "Parent Phone": user.parentPhoneNumber,
      "Join Date": user.joinDate ? formatDate(user.joinDate) : "N/A",
      "Last Login": user.lastLogin ? formatDate(user.lastLogin) : "Never",
    }));

    const mainWorksheet = XLSX.utils.json_to_sheet(mainData);

    // Premium styling for main sheet - Blue header
    enhanceWorksheetStyle(XLSX, mainWorksheet, mainData.length, false, {
      headerBg: "FF2C5FAA", // Premium Blue
      headerText: "FFFFFFFF",
      alternateRow1: "FFF8F9FA",
      alternateRow2: "FFFFFFFF",
    });

    // Add main sheet to workbook
    XLSX.utils.book_append_sheet(workbook, mainWorksheet, "Users Overview");

    // ==================== DETAILED SHEET ====================
    const detailedData = filteredUsers.map((user, index) => ({
      "No.": index + 1,
      "Student ID": user.studentId,
      "First Name": user.firstName,
      "Middle Name": user.middleName || "",
      "Last Name": user.lastName,
      Email: user.email,
      "Phone Number": formatPhoneNumber(user.phoneNumber),
      "Account Role": user.role.toUpperCase(),
      "Account Status":
        user.status.charAt(0).toUpperCase() + user.status.slice(1),
      Gender: user.sex?.charAt(0).toUpperCase() + user.sex?.slice(1) || "",
      "Date of Birth": user.dateOfBirth ? formatDate(user.dateOfBirth) : "N/A",
      Age: user.dateOfBirth ? calculateAge(user.dateOfBirth) : "N/A",
      "National ID": user.nationalId,
      Occupation: user.occupation || "Not Specified",
      "Marriage Status": formatMarriageStatus(user.marriageStatus),
      "Has Disability": user.disability ? "Yes" : "No",
      "Disability Type": user.disabilityType || "None",
      Country: user.country || "Ethiopia",
      Region: user.region,
      Zone: user.zone || "Not Specified",
      Woreda: user.woreda || "Not Specified",
      Church: user.church,
      "Parent Status": formatParentStatus(user.parentStatus),
      "Parent Full Name": user.parentFullName,
      "Parent Email": user.parentEmail || "Not Provided",
      "Parent Phone": formatPhoneNumber(user.parentPhoneNumber),
      "Join Date": user.joinDate ? formatDate(user.joinDate) : "N/A",
      "Membership Duration": user.joinDate
        ? calculateMembershipDuration(user.joinDate)
        : "N/A",
      "Last Login": user.lastLogin ? formatDate(user.lastLogin) : "Never",
      "Days Since Last Login": user.lastLogin
        ? calculateDaysSince(user.lastLogin)
        : "N/A",
    }));

    const detailedWorksheet = XLSX.utils.json_to_sheet(detailedData);

    // Premium styling for detailed sheet - Green header
    enhanceWorksheetStyle(XLSX, detailedWorksheet, detailedData.length, true, {
      headerBg: "FF27AE60", // Premium Green
      headerText: "FFFFFFFF",
      alternateRow1: "FFF0F9F0",
      alternateRow2: "FFFFFFFF",
    });

    XLSX.utils.book_append_sheet(workbook, detailedWorksheet, "User Details");

    // ==================== STATISTICS SHEET ====================
    const stats = calculateStatistics(filteredUsers);
    const statsData = [
      ["REPORT STATISTICS", ""],
      ["Generated On", new Date().toLocaleString()],
      ["Total Users", stats.totalUsers],
      ["Active Users", stats.activeUsers],
      ["Inactive Users", stats.inactiveUsers],
      ["Admins", stats.admins],
      ["Regular Users", stats.regularUsers],
      ["Male Users", stats.maleUsers],
      ["Female Users", stats.femaleUsers],
      ["Users with Disability", stats.disabledUsers],
      ["Average Age", stats.averageAge],
      ["", ""],
      ["MARRIAGE STATUS BREAKDOWN", ""],
      ["Single", stats.marriageStats.single],
      ["Married", stats.marriageStats.married],
      ["Divorced", stats.marriageStats.divorced],
      ["Widowed", stats.marriageStats.widowed],
      ["", ""],
      ["REGIONAL DISTRIBUTION", ""],
      ...Object.entries(stats.regionalDistribution).map(([region, count]) => [
        region,
        count,
      ]),
    ];

    const statsWorksheet = XLSX.utils.aoa_to_sheet(statsData);

    // Premium styling for statistics sheet - Purple header
    enhanceStatsWorksheetStyle(XLSX, statsWorksheet, statsData.length, {
      headerBg: "FF8E44AD", // Premium Purple
      headerText: "FFFFFFFF",
      accent1: "FFF3E5F5",
    });

    XLSX.utils.book_append_sheet(workbook, statsWorksheet, "Statistics");

    // ==================== EXPORT FILE ====================
    const date = new Date().toISOString().slice(0, 10);
    const timestamp = new Date().toISOString().slice(11, 19).replace(/:/g, "-");
    XLSX.writeFile(
      workbook,
      `Sunday_School_Users_Report_${date}_${timestamp}.xlsx`
    );

    toast.success(
      `📊 Exported ${filteredUsers.length} users with premium report`
    );
  } catch (error) {
    console.error("Export error:", error);
    toast.error("❌ Failed to generate export report");
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
          top: { style: "thin", color: { rgb: darkenColor(colors.headerBg) } },
          left: { style: "thin", color: { rgb: darkenColor(colors.headerBg) } },
          bottom: {
            style: "thin",
            color: { rgb: darkenColor(colors.headerBg) },
          },
          right: {
            style: "thin",
            color: { rgb: darkenColor(colors.headerBg) },
          },
        },
      };
    }

    // Data rows styling
    for (let R = range.s.r + 1; R <= range.e.r; R++) {
      const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
      if (!worksheet[cellAddress]) continue;

      const isEvenRow = (R - range.s.r) % 2 === 0;

      worksheet[cellAddress].s = {
        fill: {
          fgColor: {
            rgb: isEvenRow ? colors.alternateRow1 : colors.alternateRow2,
          },
        },
        font: {
          name: "Calibri",
          sz: 11,
          color: { rgb: "FF333333" },
        },
        alignment: {
          vertical: "center",
          wrapText: true,
        },
        border: {
          top: { style: "thin", color: { rgb: "FFE0E0E0" } },
          left: { style: "thin", color: { rgb: "FFE0E0E0" } },
          bottom: { style: "thin", color: { rgb: "FFE0E0E0" } },
          right: { style: "thin", color: { rgb: "FFE0E0E0" } },
        },
      };

      // Special styling for specific columns
      const headerValue = worksheet[XLSX.utils.encode_cell({ r: 0, c: C })]?.v;
      if (headerValue === "Status") {
        const cellValue = worksheet[cellAddress].v;
        if (cellValue === "Active") {
          worksheet[cellAddress].s.font.color = { rgb: "FF00A000" };
          worksheet[cellAddress].s.font.bold = true;
        } else if (cellValue === "Inactive") {
          worksheet[cellAddress].s.font.color = { rgb: "FFFF0000" };
        }
      }

      if (headerValue === "Role" && worksheet[cellAddress].v === "ADMIN") {
        worksheet[cellAddress].s.font.color = { rgb: colors.headerBg };
        worksheet[cellAddress].s.font.bold = true;
      }
    }
  }

  // Set column widths based on content
  const colWidths = isDetailed
    ? // Detailed sheet widths
      [
        { wch: 6 }, // No.
        { wch: 12 }, // Student ID
        { wch: 15 }, // First Name
        { wch: 15 }, // Middle Name
        { wch: 15 }, // Last Name
        { wch: 25 }, // Email
        { wch: 15 }, // Phone Number
        { wch: 12 }, // Account Role
        { wch: 12 }, // Account Status
        { wch: 10 }, // Gender
        { wch: 12 }, // Date of Birth
        { wch: 8 }, // Age
        { wch: 15 }, // National ID
        { wch: 20 }, // Occupation
        { wch: 12 }, // Marriage Status
        { wch: 12 }, // Has Disability
        { wch: 15 }, // Disability Type
        { wch: 12 }, // Country
        { wch: 15 }, // Region
        { wch: 15 }, // Zone
        { wch: 15 }, // Woreda
        { wch: 20 }, // Church
        { wch: 15 }, // Parent Status
        { wch: 20 }, // Parent Full Name
        { wch: 20 }, // Parent Email
        { wch: 15 }, // Parent Phone
        { wch: 12 }, // Join Date
        { wch: 18 }, // Membership Duration
        { wch: 12 }, // Last Login
        { wch: 18 }, // Days Since Last Login
      ]
    : // Main sheet widths
      [
        { wch: 6 }, // No.
        { wch: 12 }, // Student ID
        { wch: 25 }, // Full Name
        { wch: 25 }, // Email
        { wch: 15 }, // Phone
        { wch: 10 }, // Role
        { wch: 10 }, // Status
        { wch: 8 }, // Sex
        { wch: 12 }, // Date of Birth
        { wch: 15 }, // National ID
        { wch: 20 }, // Occupation
        { wch: 12 }, // Marriage Status
        { wch: 10 }, // Disability
        { wch: 15 }, // Disability Type
        { wch: 25 }, // Location
        { wch: 20 }, // Church
        { wch: 20 }, // Parent/Guardian
        { wch: 15 }, // Parent Phone
        { wch: 12 }, // Join Date
        { wch: 12 }, // Last Login
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

      // Section headers
      if (
        typeof cellValue === "string" &&
        (cellValue.includes("STATISTICS") ||
          cellValue.includes("BREAKDOWN") ||
          cellValue.includes("DISTRIBUTION"))
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
        };
      }
      // Metric labels
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
            color: { rgb: "FF333333" },
          },
          fill: { fgColor: { rgb: colors.accent1 || "FFF0F4FF" } },
        };
      }
      // Metric values
      else if (C === 1 && R > 0) {
        worksheet[cellAddress].s = {
          font: { name: "Calibri", sz: 11, color: { rgb: colors.headerBg } },
          alignment: { horizontal: "right" },
        };
      }
    }
  }

  worksheet["!cols"] = [{ wch: 30 }, { wch: 15 }];
};

// Helper function to darken colors for borders
const darkenColor = (color: string): string => {
  // Simple color darkening by reducing hex values
  const hex = color.replace("FF", "");
  const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - 20)
    .toString(16)
    .padStart(2, "0");
  const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - 20)
    .toString(16)
    .padStart(2, "0");
  const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - 20)
    .toString(16)
    .padStart(2, "0");
  return `FF${r}${g}${b}`;
};

// ==================== UTILITY FUNCTIONS ====================
const formatDate = (date: string | Date): string => {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatPhoneNumber = (phone: string): string => {
  // Basic phone formatting
  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  }
  return phone;
};

const formatMarriageStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    single: "Single",
    married: "Married",
    divorced: "Divorced",
    widowed: "Widowed",
  };
  return statusMap[status] || status;
};

const formatParentStatus = (status: string): string => {
  const statusMap: { [key: string]: string } = {
    both: "Both Parents",
    mother: "Mother Only",
    father: "Father Only",
    guardian: "Guardian",
  };
  return statusMap[status] || status;
};

const calculateAge = (birthDate: string | Date): number => {
  const today = new Date();
  const birth = new Date(birthDate);
  let age = today.getFullYear() - birth.getFullYear();
  const monthDiff = today.getMonth() - birth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

const calculateMembershipDuration = (joinDate: string | Date): string => {
  const today = new Date();
  const join = new Date(joinDate);
  const months =
    (today.getFullYear() - join.getFullYear()) * 12 +
    today.getMonth() -
    join.getMonth();

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

const calculateDaysSince = (date: string | Date): number => {
  const today = new Date();
  const lastDate = new Date(date);
  const diffTime = Math.abs(today.getTime() - lastDate.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

const calculateStatistics = (users: User[]) => {
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter((u) => u.status === "active").length,
    inactiveUsers: users.filter((u) => u.status === "inactive").length,
    admins: users.filter((u) => u.role === "admin").length,
    regularUsers: users.filter((u) => u.role === "user").length,
    maleUsers: users.filter((u) => u.sex === "male").length,
    femaleUsers: users.filter((u) => u.sex === "female").length,
    disabledUsers: users.filter((u) => u.disability).length,
    averageAge: 0,
    marriageStats: {
      single: users.filter((u) => u.marriageStatus === "single").length,
      married: users.filter((u) => u.marriageStatus === "married").length,
      divorced: users.filter((u) => u.marriageStatus === "divorced").length,
      widowed: users.filter((u) => u.marriageStatus === "widowed").length,
    },
    regionalDistribution: {} as { [key: string]: number },
  };

  // Calculate average age
  const ages = users
    .filter((u) => u.dateOfBirth)
    .map((u) => calculateAge(u.dateOfBirth));
  stats.averageAge =
    ages.length > 0
      ? Math.round(ages.reduce((a, b) => a + b, 0) / ages.length)
      : 0;

  // Calculate regional distribution
  users.forEach((user) => {
    stats.regionalDistribution[user.region] =
      (stats.regionalDistribution[user.region] || 0) + 1;
  });

  return stats;
};

export default exportUsers;
