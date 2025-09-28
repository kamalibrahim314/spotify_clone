import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLoginMutation, useRegisterMutation } from "../redux/features/auth/authApiSlice";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { signUpSchema, signInSchema } from "../validation/auth.vaidator";

const AuthModal = ({ show, onClose, setUser }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = isLogin
        ? useState({ email: "", password: "" })
        : useState({ email: "", password: "", name: "" });
    const [formErrors, setFormErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState("");

    const [login] = useLoginMutation();
    const [register] = useRegisterMutation();

    const switchMode = () => {
        setIsLogin(!isLogin);
        setFormData({ email: "", password: "", name: "" });
        setFormErrors({});
    };

    const validateForm = (schema) => {
        const { error } = schema.validate(formData, { abortEarly: false });
        if (!error) return {};

        const formattedErrors = {};
        for (const detail of error.details) {
            formattedErrors[detail.path[0]] = detail.message;
        }
        return formattedErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setFormErrors({});

        try {
            const schema = isLogin ? signInSchema : signUpSchema;
            const errors = validateForm(schema);
            if (Object.keys(errors).length > 0) {
                setFormErrors(errors);
                setIsLoading(false);
                return;
            }
            const payload = isLogin
                ? { email: formData.email, password: formData.password }
                : { email: formData.email, password: formData.password, name: formData.name };

            const res = isLogin
                ? await login(payload).unwrap()
                : await register(payload).unwrap();

            if (res?.data?.success === false) {
                setServerError(res.error.data.message);
                cosnole.log(res);
                return;
            }

            if (res?.accessToken) {
                Cookies.set("accessToken", res.accessToken, {
                    expires: 15,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: "strict",
                });

                if (isLogin) {
                    setUser(res.user);
                    toast.success("تم تسجيل الدخول بنجاح");
                } else {
                    toast.success("تم إنشاء الحساب بنجاح");
                    setTimeout(() => setIsLogin(true), 1000);
                }

                setFormData({ email: "", password: "", name: "" });
                onClose();
            }
        } catch (err) {
            toast.error(err?.data?.message || "فشل العملية");
            console.log(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({ email: "", password: "", name: "" });
        setFormErrors({});
        onClose();
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={handleClose}
                >
                    <motion.div
                        initial={{ scale: 0.7, y: 40, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.7, y: 40, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-gradient-to-br from-gray-900 to-black text-white p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-gray-700 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* زر الإغلاق */}
                        <button
                            onClick={handleClose}
                            className="absolute top-4 left-4 text-gray-400 hover:text-white transition-colors"
                        >
                            ✕
                        </button>

                        {/* العنوان */}
                        <motion.div
                            key={isLogin ? "login" : "register"}
                            initial={{ y: -20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ duration: 0.4 }}
                            className="text-center mb-6"
                        >
                            <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-indigo-500 bg-clip-text text-transparent">
                                {isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
                            </h3>
                        </motion.div>

                        {/* النموذج */}
                        <motion.form
                            key={`form-${isLogin}`}
                            initial={{ x: isLogin ? -30 : 30, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            onSubmit={handleSubmit}
                            className="flex flex-col gap-4"
                        >
                            {!isLogin && (
                                <motion.div
                                    initial={{ y: 10, opacity: 0 }}
                                    animate={{ y: 0, opacity: 1 }}
                                    transition={{ delay: 0.1 }}
                                >
                                    <input
                                        type="text"
                                        placeholder="اسم المستخدم"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                    />
                                    {formErrors.name && (
                                        <motion.p
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className="text-red-400 text-sm mt-1"
                                        >
                                            {formErrors.name}
                                        </motion.p>
                                    )}
                                </motion.div>
                            )}

                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: isLogin ? 0.1 : 0.2 }}
                            >
                                <input
                                    type="email"
                                    placeholder="البريد الإلكتروني"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                />
                                {formErrors.email && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-red-400 text-sm mt-1"
                                    >
                                        {formErrors.email}
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ y: 10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: isLogin ? 0.2 : 0.3 }}
                            >
                                <input
                                    type="password"
                                    placeholder="كلمة المرور"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full bg-gray-800 border border-gray-700 p-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300"
                                />
                                {formErrors.password && (
                                    <motion.p
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-red-400 text-sm mt-1"
                                    >
                                        {formErrors.password}
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isLoading}
                                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl font-medium shadow-lg transition-all disabled:opacity-50 relative overflow-hidden"
                            >
                                <span className="relative z-10">
                                    {isLoading ? "جاري المعالجة..." : isLogin ? "تسجيل الدخول" : "إنشاء حساب"}
                                </span>
                                {isLoading && (
                                    <motion.div
                                        initial={{ x: -100 }}
                                        animate={{ x: 400 }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-30deg]"
                                    />
                                )}
                            </motion.button>
                        </motion.form>
                        {/* server error */}
                        {serverError && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm mt-1"
                            >
                                {serverError}
                            </motion.p>
                        )}

                        {/* التبديل */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="text-center mt-6"
                        >
                            <p className="text-gray-400">
                                {isLogin ? "ليس لديك حساب؟" : "لديك حساب بالفعل؟"}{" "}
                                <motion.span
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={switchMode}
                                    className="text-purple-400 hover:text-indigo-400 cursor-pointer font-semibold transition-colors duration-300"
                                >
                                    {isLogin ? "إنشاء حساب" : "تسجيل الدخول"}
                                </motion.span>
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default AuthModal;
