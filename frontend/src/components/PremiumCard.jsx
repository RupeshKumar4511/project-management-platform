import { useSelector } from 'react-redux';
import image from '../assets/workspace_img_default.png'
import { Check, Zap, IndianRupee } from 'lucide-react';

const PremiumCard = () => {

    const { authResponse } = useSelector((store) => store.auth);

    const checkoutHandler = async ({ amount }) => {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/checkout`, {
            method: "POST",
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ amount })
        })

        const order = await response.json();

        console.log(order)

        const options = {
            "key": import.meta.env.VITE_RAZORPAY_API_KEY_ID,
            "amount": order.amount,
            "currency": "INR",
            "name": "Payment razorpay",
            "description": "Test Transaction",
            "image": image,
            "order_id": order.id,
            callback_url: `${import.meta.env.VITE_BACKEND_URL}/api/v1/payment/verification`,
            "prefill": {
                "name": authResponse.username,
                "email": authResponse.email,
                "contact": "9000090000"
            },
            "notes": {
                "address": "Projectly : A Project Management Platform"
            },
            "theme": {
                "color": "#3399cc"
            }
        };

        const rzp1 = new window.Razorpay(options);

        rzp1.open()

    }
    const features = [
        "Unlimited Projects & Teams",
        "Unlimited Tasks inside Project",
        "Projects Dashboard",
        "Task and Progress Analytics",
        "Task's Query Discussion",
        "AI Assistant"

    ];

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 p-6 font-sans">
            <div className="relative w-full max-w-sm p-8 bg-white border border-gray-200 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Featured Badge */}
                <div className="absolute top-0 right-10 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 text-white text-xs font-bold uppercase tracking-widest rounded-full shadow-lg">
                    Most Popular
                </div>

                {/* Pricing Header */}
                <div className="mb-8 text-center">
                    <h3 className="text-lg font-semibold text-gray-500 uppercase tracking-wide">Premium</h3>
                    <div className="mt-4 flex items-baseline justify-center gap-1">
                        <span className="text-5xl font-black tracking-tight text-gray-900"><IndianRupee size={20} />100</span>
                        <span className="text-gray-400 font-medium">/month</span>
                    </div>
                    <p className="mt-3 text-gray-600 text-sm italic">
                        "The powerhouse for high-velocity teams."
                    </p>
                </div>

                {/* Features list using flexbox for alignment */}
                <ul className="space-y-4 mb-10">
                    {features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-3">
                            <div className="shrink-0 w-6 h-6 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                <Check size={14} strokeWidth={4} />
                            </div>
                            <span className="text-gray-700 text-sm font-medium">{feature}</span>
                        </li>
                    ))}
                </ul>

                {/* CTA Button with active states */}
                <button className="w-full py-4 px-6 flex items-center justify-center gap-3 bg-gray-900 hover:bg-indigo-700 text-white font-bold rounded-2xl transition-all duration-200 active:scale-95 shadow-xl" onClick={() => checkoutHandler({ amount: 100 })}>
                    <Zap size={20} className="fill-current text-yellow-400" />
                    <span>Purchase Plan</span>
                </button>

            </div>
        </div>
    );
}

export default PremiumCard
