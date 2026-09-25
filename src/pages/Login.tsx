import { useState } from "react";
import { heroSectionData } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { BikeIcon, Loader2Icon, Store, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = () => {
    const { loginAsCustomer } = useAuth();
    const navigate = useNavigate();
    const [isLoginState, setIsLoginState] = useState(true);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [ForgotPassword, setForgotPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const customerName = name.trim() || (email ? email.split("@")[0] : "Customer");
            loginAsCustomer(email.trim() || "customer@example.com", customerName);
            setLoading(false);
            toast.success(isLoginState ? `Welcome back, ${customerName}!` : `Account created for ${customerName}!`, {
                icon: "👋",
            });
            navigate("/");
        }, 500);
    };

    return (
        <div className="min-h-screen flex">
            {/* Left side */}
            <div className="hidden lg:flex lg:w-1/2 bg-app-green relative items-center justify-center ">
                <img src={heroSectionData.hero_image} alt="" className="absolute inset-0
    object-cover h-full bg-center opacity-10" />
                <div className="relative text-center px-12 z-10">
                    <h2 className="text-4xl font-semibold text-white mb-4">Welcome back to Pasalmandu</h2>
                    <p className="text-white/60 font-serif text-xl max-w-sm mx-auto">Get the Fresh organic produce, delivered to your doorstep</p>
                </div>
            </div>


            {/* Right side */}
            <div className="flex-1 flex items-center justify-center px-4 py-12 bg-app-cream">
                <div className="w-full max-w-md">
                    {/* form header message */}
                    <div className="text-center mb-8">
                        <Link to="/" className="inline-flex items-center gap-2 mb-6">
                            <BikeIcon className="size-8 text-app-green" />
                            <span className="text-2xl font-semibold text-app-green">Pasalmandu</span>
                        </Link>
                        <h1 className="text-3xl font-bold mb-2">{isLoginState ? "Login" : "Register"}</h1>
                        <p className="text-gray-600">
                            {isLoginState ? "Access your customer account" : "Create a new customer account"}
                        </p>
                    </div>

                    {/* Login / Register Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLoginState && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="Your name"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-green"
                                    required={!isLoginState}
                                />
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-green"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">
                                Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-green"
                                required
                            />
                        </div>

                        {!isLoginState && (
                            <div>
                                <label className="block text-sm font-medium mb-2">
                                    Confirm Password
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Confirm your password"
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-app-green"
                                    required={!isLoginState}
                                />
                            </div>
                        )}

                        {isLoginState && (
                            <div className="flex items-center justify-between text-xs">
                                <label className="flex items-center gap-2 cursor-pointer text-gray-600">
                                    <input
                                        type="checkbox"
                                        checked={ForgotPassword}
                                        onChange={(e) => setForgotPassword(e.target.checked)}
                                        className="rounded border-gray-300 text-app-green focus:ring-app-green"
                                    />
                                    <span>Remember me</span>
                                </label>
                                <a
                                    href="#forgot"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        toast("Password reset link sent to your registered email (Demo)");
                                    }}
                                    className="text-app-green hover:underline"
                                >
                                    Forgot Password?
                                </a>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-app-green text-white py-2.5 rounded-xl font-semibold hover:opacity-90 transition disabled:opacity-50 flex items-center justify-center shadow-md"
                        >
                            {loading ? <Loader2Icon className="animate-spin size-5" /> :
                                (isLoginState ? "Login to Shop" : "Create Account")}
                        </button>
                    </form>

                    {/* Toggle between Login and Register */}
                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            {isLoginState ? "Don't have an account?" : "Already have an account?"}
                            <button
                                type="button"
                                onClick={() => setIsLoginState(!isLoginState)}
                                className="text-app-green font-semibold ml-1.5 hover:underline"
                            >
                                {isLoginState ? "Register" : "Login"}
                            </button>
                        </p>
                    </div>

                    {/* Dedicated Merchant & Vendor Portal Entry */}
                    <div className="mt-8 pt-6 border-t border-gray-200">
                        <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200/80 space-y-2 text-center">
                            <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-900">
                                <Store className="size-4 text-emerald-700" />
                                <span>Are you a Store Owner or Vendor?</span>
                            </div>
                            <p className="text-xs text-zinc-600">
                                Access your shop dashboard, fulfill orders, or register your local grocery store.
                            </p>
                            <div className="flex items-center justify-center gap-2 pt-1">
                                <Link
                                    to="/vendor/login"
                                    className="px-3.5 py-1.5 bg-app-green text-white text-xs font-semibold rounded-lg hover:bg-emerald-950 transition-colors flex items-center gap-1 shadow-2xs"
                                >
                                    <span>Vendor Login</span>
                                    <ArrowRight className="size-3" />
                                </Link>
                                <Link
                                    to="/become-seller"
                                    className="px-3.5 py-1.5 bg-white text-emerald-900 border border-emerald-300 text-xs font-semibold rounded-lg hover:bg-emerald-100 transition-colors"
                                >
                                    Become a Seller
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;


