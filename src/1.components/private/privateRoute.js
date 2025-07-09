// import { useContext, useEffect, useState } from "react";
// import { Navigate, useLocation } from "react-router-dom";
// import { Auth } from "../../context/context";
// import Error from "../../2.pages/error";

// export default function PrivateRoute({ Component }) {
//   const [isAuth, setIsAuth] = useState(false);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { API } = useContext(Auth);
//   const location = useLocation(); 

//   useEffect(() => {
//     const checkPermission = async () => {
//       try {
//         const response = await fetch(`${API}/premission`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           credentials: "include", 
//         });

//         if (response.ok) {
//           const result = await response.json();
//           setIsAuth(result.Auth); // تأكد من حالة التوثيق
//         } else {
//           setIsAuth(false);
//           setError("لم يتم منح الإذن. يرجى تسجيل الدخول مرة أخرى."); 
//         }
//       } catch (error) {
//         console.error("فشل التحقق:", error);
//         setError("حدث خطأ أثناء التحقق من الإذن. يرجى المحاولة لاحقًا.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     checkPermission();
//   }, [API]);

//   if (loading) {
//     return <div>جاري التحقق من الإذن...</div>; // رسالة أثناء الانتظار
//   }

//   if (error) {
//     return <Error message={error}/>; // إظهار رسالة الخطأ في صفحة Error
//   }

//   if (!isAuth) {
//     return (
//       <Navigate
//         to="/"
//         state={{
//           from: location.pathname,
//           message: "الرجاء تسجيل الدخول للوصول إلى هذه الصفحة.",
//         }}
//       />
//     );
//   }

//   return <Component />;
// }
import { useLocation } from "react-router-dom";

export default function PrivateRoute({ Component }) {
  const location = useLocation(); 

  // ببساطة هنعرض الصفحة مباشرة بدون التحقق
  return <Component />;
}
