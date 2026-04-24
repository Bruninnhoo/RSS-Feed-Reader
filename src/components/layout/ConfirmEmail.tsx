import { supabase } from "../../lib/supabase";
import { MailCheck } from "lucide-react";
import { Link } from "react-router-dom";

export function ConfirmEmail({ email }: { email: string }) {
    const handleResend = async () => {
        try {
            await supabase.auth.resend({ type: "signup", email });
            alert("Verification email resent!");
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="sm:mx-auto sm:w-full sm:max-w-md bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 border border-gray-200 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-6">
                <MailCheck size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
            <p className="text-gray-600 mb-6">
                We sent a verification link to <br/>
                <span className="font-semibold text-gray-900">{email}</span>
            </p>
            <p className="text-sm text-gray-500 mb-8">
                Please click the link in that email to sign in and start building your Frontpage.
            </p>
            
            <div className="flex flex-col gap-4 w-full">
                <button 
                    onClick={handleResend}
                    className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                    Resend email
                </button>
                <Link
                    to="/login"
                    className="text-sm font-medium text-blue-600 hover:text-blue-500"
                >
                    Back to log in
                </Link>
            </div>
        </div>
    );
}