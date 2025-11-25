export interface User {
  _id: string;
  studentId: string;
  email: string;
  password: string;
  role: "admin" | "user";
  firstName: string;
  middleName: string;
  lastName: string;
  sex: "male" | "female";
  phoneNumber: string;
  disability: boolean;
  disabilityType?: string;
  dateOfBirth: string;
  country: string;
  region: string;
  zone: string;
  woreda: string;
  church: string;
  occupation: string;
  marriageStatus: "single" | "married" | "divorced" | "widowed";
  parentStatus: "both" | "mother" | "father" | "guardian";
  parentFullName: string;
  parentEmail: string;
  parentPhoneNumber: string;
  nationalId: string;
  avatar?: string;
  joinDate: string;
  status: "active" | "inactive";
  lastLogin?: string;
}

export interface Asset {
  id?: string;
  code: string;
  name: string;
  description: string;
  category: string;
  status: "available" | "assigned" | "maintenance" | "retired";
  assignedTo?: string;
  purchaseDate: string;
  purchasePrice: number;
  location: string;
  condition: "excellent" | "good" | "fair" | "poor";
  lastMaintenanceDate?: string;
  nextMaintenanceDate?: string;
  supplier: string;
  warrantyExpiry?: string;
  serialNumber?: string;
  tags: string[];
  images: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  authorId: string;
  category: "announcement" | "lesson" | "event" | "general";
  status: "draft" | "published" | "archived";
  publishDate: string;
  expiryDate?: string;
  tags: string[];
  likes: string[];
  comments: Comment[];
  shares: number;
  image?: string;
  isPinned: boolean;
  targetAudience: "all" | "students" | "teachers" | "parents";
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  author: string;
  authorId: string;
  text: string;
  likes: string[];
  parentId?: string;
  replies: Comment[];
  createdAt: string;
}

export interface AppState {
  userrs: User[];
  assets: Asset[];
  posts: Post[];
  currentUser: User | null;
  isLoading: boolean;
}

export type Language = "en" | "am" | "om";
export type Theme = "light" | "dark";
