import { X } from 'lucide-react';
import { redirect } from 'react-router-dom';

const PaymentFail = () => {

  const onTryAgain = ()=>{
    redirect(`${import.meta.env.VITE_FRONTEND_URL}/app/payment`)
  }
  return (
    <div className="w-screen min-h-screen flex items-center justify-center bg-zinc-950 p-4">
      <div className="flex w-full max-w-md bg-zinc-900 rounded-2xl border border-zinc-800 drop-shadow-2xl items-center justify-center">
        <div className="flex flex-col items-center justify-start p-10 space-y-6 w-full">
          
          {/* Error Icon Area */}
          <div className="flex flex-col items-center justify-center w-full h-32 relative">
            <div className="rounded-full w-24 h-24 bg-red-500/10 border-4 border-red-500 flex items-center justify-center shadow-[0_0_30px_rgba(239,68,68,0.3)]">
              <X className="text-red-500 w-12 h-12" strokeWidth={3} />
            </div>
          </div>

          <div className="text-center space-y-2">
            <h3 className="text-2xl font-bold text-white">Payment Failed</h3>
            <p className="text-zinc-400 text-sm px-6">
              We couldn't process your transaction. Please check your card details or try a different method.
            </p>
          </div>

          <div className="w-full flex flex-col gap-3">
            <button 
              onClick={onTryAgain}
              className="w-full py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentFail;
