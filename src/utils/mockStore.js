import bcrypt from "bcryptjs";

const DEMO_PW_HASH = "$2a$10$4B92fD7WskT7P9o03dY3h.Z9g6Pj0eI7eN3uL5K9eM3eO5uL5K9eM"; // Demo@1234
const BCRYPT_ROUNDS = 10;

export const mockUsers = [
  {
    id: "usr_admin_001",
    fullName: "Asha Deshpande",
    email: "admin@hostel.local",
    passwordHash: "",
    role: "ADMIN",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_warden_001",
    fullName: "Ramesh Kulkarni",
    email: "warden@hostel.local",
    passwordHash: "",
    role: "WARDEN",
    isActive: true,
    phone: "+91-90000-00001",
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_student_001",
    fullName: "Priya Sharma",
    email: "student@hostel.local",
    studentId: "STU-2024-001",
    passwordHash: "",
    role: "STUDENT",
    course: "B.Tech CSE",
    yearOfStudy: 2,
    phone: "+91-90000-10001",
    emergencyContactName: "Rakesh Sharma",
    emergencyContactPhone: "+91-90000-20001",
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    id: "usr_student_002",
    fullName: "Meera Iyer",
    email: "meera@hostel.local",
    studentId: "STU-2024-003",
    passwordHash: "",
    role: "STUDENT",
    course: "B.Sc Physics",
    yearOfStudy: 1,
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

// Hash initial password once
bcrypt.hash("Demo@1234", 10).then((h) => {
  mockUsers.forEach((u) => {
    u.passwordHash = h;
  });
});

export const mockRooms = [
  { id: "rm_101", roomNumber: "A-101", floor: 1, roomType: "DOUBLE", capacity: 2, status: "AVAILABLE", amenities: ["Wi-Fi", "Attached Bathroom", "Study Desk", "AC"], block: { id: "blk_1", name: "Block A — Aryabhata" } },
  { id: "rm_102", roomNumber: "A-102", floor: 1, roomType: "SINGLE", capacity: 1, status: "AVAILABLE", amenities: ["Wi-Fi", "Attached Bathroom", "AC", "Balcony"], block: { id: "blk_1", name: "Block A — Aryabhata" } },
  { id: "rm_201", roomNumber: "B-201", floor: 2, roomType: "DOUBLE", capacity: 2, status: "AVAILABLE", amenities: ["Wi-Fi", "Study Desk"], block: { id: "blk_2", name: "Block B — Ramanujan" } },
  { id: "rm_301", roomNumber: "C-101", floor: 1, roomType: "TRIPLE", capacity: 3, status: "AVAILABLE", amenities: ["Wi-Fi", "Attached Bathroom", "Study Desk"], block: { id: "blk_3", name: "Block C — Kalpana" } },
];

export const mockAllocations = [
  {
    id: "alloc_001",
    studentId: "usr_student_001",
    roomId: "rm_101",
    status: "ACTIVE",
    requestedAt: new Date(Date.now() - 30 * 86400000).toISOString(),
    decidedAt: new Date(Date.now() - 28 * 86400000).toISOString(),
    room: mockRooms[0],
    student: mockUsers[2],
  },
];

export const mockComplaints = [
  {
    id: "cmp_001",
    studentId: "usr_student_001",
    roomId: "rm_101",
    title: "Geyser not working in bathroom",
    category: "WATER",
    priority: "NORMAL",
    status: "IN_PROGRESS",
    submittedAt: new Date(Date.now() - 2 * 86400000).toISOString(),
    comments: [],
  },
];

export function findMockUser(identifier) {
  const needle = (identifier || "").toLowerCase().trim();
  return mockUsers.find(
    (u) =>
      u.email.toLowerCase() === needle ||
      (u.studentId && u.studentId.toLowerCase() === needle)
  );
}

export function findMockUserById(id) {
  return mockUsers.find((u) => u.id === id);
}

export async function createMockUser(data) {
  const existing = findMockUser(data.email) || (data.studentId && findMockUser(data.studentId));
  if (existing) {
    throw new Error("An account with this email or student ID already exists.");
  }
  const passwordHash = await bcrypt.hash(data.password, BCRYPT_ROUNDS);
  const user = {
    id: `usr_${Date.now()}`,
    fullName: data.fullName,
    email: data.email.toLowerCase(),
    studentId: data.studentId || `STU-${Math.floor(1000 + Math.random() * 9000)}`,
    phone: data.phone || null,
    course: data.course || "B.Tech",
    yearOfStudy: data.yearOfStudy || 1,
    passwordHash,
    role: "STUDENT",
    isActive: true,
    createdAt: new Date().toISOString(),
  };
  mockUsers.push(user);
  return user;
}
