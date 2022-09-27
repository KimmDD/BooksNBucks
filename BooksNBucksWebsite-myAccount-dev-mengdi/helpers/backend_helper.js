import { del, get, post } from "./api_helper";
import { data } from "autoprefixer";

export const postRegister = (data) => post("/user/register", data);
export const postLogin = (data) => post("/user/login", data);
export const postSocialLogin = (data) => post("/user/social-login", data);
export const getVerify = (data) => get("/user/verify", data);
export const postRole = (data) => post("/user/role", data);
export const fetchProfile = (data) => get("/user/profile", data);

export const fetchParentProfile = (data) => get("/user/parentprofile", data);
export const fetchUpdateParentProfile = (data) =>
  get("/user/updateParentprofile", data);
export const fetchUpdateParentSetting = (data) =>
  get("/user/updateParentsetting", data);
export const fetchAddCode = (data) => get("/user/add_code", data);
export const addStudent = (data) => post("/user/add_student", data);
export const fetchMyStudents = (data) => get("/user/my_students", data);
export const removeStudent = (data) => post("/user/remove_student", data);
export const fetchStudentDashboard = (data) =>
  post("/user/student_dashboard", data);

export const fetchDashboard = (data) => get("/user/dashboard", data);

export const getSchools = (data) => get("/school/list", data);

export const fetchProducts = (data) => get("/store/products", data);
export const postProductAdd = (data) => post("/store/add", data);
export const postProductUpdate = (data) => post("/store/update", data);
export const delProduct = (data) => del("/store/delete", data);

export const fetchPurchases = (data) => get("/store/purchases", data);
export const postPurchase = (data) => post("/store/purchase", data);
export const postPurchaseStatus = (data) =>
  post("/store/purchase-status", data);

export const fetchWishlist = (data) => get("/user/wishlist", data);
export const postWishlist = (data) => post("/user/wishlist", data);
export const postGoal = (data) => post("/user/goal", data);

export const fetchStudents = (data) => get("/user/students", data);
export const fetchTeachers = (data) => get("/user/teachers", data);

export const fetchClasses = (data) => get("/class/list", data);
export const fetchClass = (data) => get("/class/get", data);
export const postClass = (data) => post("/class/create", data);
export const postClassUpdate = (data) => post("/class/update", data);

export const fetchTraits = (data) => get("/trait/list", data);
export const postTraitAdd = (data) => post("/trait/add", data);
export const postTraitUpdate = (data) => post("/trait/update", data);
export const delTrait = (data) => del("/trait/delete", data);

export const fetchAwards = (data) => get("/award/list", data);
export const fetchWeeklySummery = (data) => get("/award/week_summery", data);
export const postAwards = (data) => post("/award/create", data);
export const fetchMyStudentAward = (data) =>
  get("/award/my_student_award", data);

export const fetchAttendance = (data) => get("/attendance", data);
export const fetchMyStudentsAttendance = (data) =>
  get("/attendance/attendance", data);
export const fetchAttendanceStatus = (data) => get("/attendance/status", data);
export const postAttendance = (data) => post("/attendance", data);

export const fetchQuizzes = (data) => get("/quiz/list", data);
export const fetchQuiz = (data) => get("/quiz/get", data);
export const getGrades = (data) => get("/quiz/grades", data);
export const postQuiz = (data) => post("/quiz/add", data);
export const postQuizUpdate = (data) => post("/quiz/update", data);
export const delQuiz = (data) => del("/quiz/delete", data);

export const fetchSubmissions = (data) => get("/quiz/submissions", data);
export const submitQuiz = (data) => post("/quiz/submit", data);

export const fetchPurchaseHistory = (data) => get("/purchase/history", data);
export const fetchPendingPurchases = (data) => get("/purchase/pending", data);
export const updataePurchaseStatus = (data) =>
  post("/purchase/update_status", data);
