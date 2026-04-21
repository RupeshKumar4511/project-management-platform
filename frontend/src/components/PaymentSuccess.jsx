import { Check } from 'lucide-react';
import { redirect, useLocation } from 'react-router-dom';

const PaymentSuccess = () => {

  const query = new URLSearchParams(useLocation().search);
  const payment_id = query.get("payment_id");

  const onReturn = () => {
    redirect(`${import.meta.env.FRONTEND_URL}/app/create-workspace`)

  }
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="flex w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 drop-shadow-2xl items-center justify-center overflow-hidden">
        <div className="flex flex-col items-center justify-start p-10 space-y-6 w-full">

          {/* Animated Background Decoration */}
          <div className="flex flex-col items-center justify-center w-full h-32 relative">
            <div className="absolute top-[10%] left-[20%] rounded-full w-2 h-2 bg-green-400 animate-pulse" />
            <div className="absolute top-[80%] left-[15%] rounded-full w-3 h-3 bg-indigo-500 animate-bounce" />
            <div className="absolute top-[20%] left-[80%] rounded-full w-2 h-2 bg-yellow-400 animate-pulse" />
            <div className="absolute top-[70%] left-[75%] rounded-full w-4 h-4 bg-green-500/20 border border-green-500/50" />

            {/* Success Icon */}
            <div className="rounded-full w-24 h-24 bg-green-500/10 border-4 border-green-500 flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.3)]">
              <Check className="text-green-500 w-12 h-12" strokeWidth={3} />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Payment Successful!</h3>
            <p className="text-zinc-400 text-sm px-6">
              Thank you for purchasing our premium plan.
            </p >
            <p className="text-blue-500 text-sm px-6">
              Your payment id is {payment_id}
            </p>
          </div>

          <button
            onClick={onReturn}
            className="w-full py-3 px-6 bg-white hover:bg-zinc-200 text-black font-bold rounded-xl transition-all active:scale-95"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentSuccess;
