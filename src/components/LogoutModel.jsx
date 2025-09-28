import { AnimatePresence, motion } from "framer-motion";
import React from "react";
import Cookies from "js-cookie";
import { HiOutlineLogout } from "react-icons/hi";
import { toast } from "react-toastify";

const LogoutModal = ({ show, onClose, setUser }) => {
    const handleLogout = () => {
        // مسح التوكن
        Cookies.remove("accessToken");
        setUser(null);

        toast.success("تم تسجيل الخروج بنجاح ✅");
        onClose();
    };

    return (
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.7, y: 40, opacity: 0 }}
                        animate={{ scale: 1, y: 0, opacity: 1 }}
                        exit={{ scale: 0.7, y: 40, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="bg-gradient-to-br from-gray-800 via-gray-900 to-black text-white p-8 rounded-3xl shadow-2xl max-w-md w-full mx-4 border border-gray-700 relative"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Icon */}
                        <motion.div
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 0.5 }}
                            className="text-center mb-6"
                        >
                            <div className="bg-red-500/20 p-4 rounded-full inline-block">
                                <HiOutlineLogout className="text-red-400" size={32} />
                            </div>
                        </motion.div>

                        <h3 className="text-2xl font-bold mb-4 text-white text-center">
                            تأكيد تسجيل الخروج
                        </h3>
                        <p className="mb-8 text-gray-300 text-center leading-relaxed">
                            هل أنت متأكد أنك تريد تسجيل الخروج من حسابك؟
                        </p>

                        <div className="flex gap-4">
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={onClose}
                                className="flex-1 px-6 py-3 border-2 border-gray-600 rounded-xl hover:bg-gray-700 text-gray-200 font-medium transition-all"
                            >
                                إلغاء
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                onClick={handleLogout}
                                className="flex-1 px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-xl hover:from-red-600 hover:to-red-700 font-medium shadow-lg transition-all"
                            >
                                تسجيل الخروج
                            </motion.button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default LogoutModal;