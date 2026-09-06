import React, { useState } from 'react';
import {
  X,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Lock,
  ArrowRight,
  Gift,
  Building2,
  Tag,
  Clock,
  Zap,
} from 'lucide-react';
import { ShowroomItem, PaymentSession } from '../types/salespilot';

interface PaymentCheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  showroom: ShowroomItem;
  quantity: number;
  discountPercentage: number;
  onPaymentSuccess: (session: PaymentSession) => void;
}

export const PaymentCheckoutModal: React.FC<PaymentCheckoutModalProps> = ({
  isOpen,
  onClose,
  showroom,
  quantity,
  discountPercentage,
  onPaymentSuccess,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'invoice' | 'wire'>('card');
  const [customerName, setCustomerName] = useState('Priya Sharma');
  const [customerEmail, setCustomerEmail] = useState('priya.sharma@apexscale.io');

  if (!isOpen) return null;

  const baseTotal = showroom.basePrice * quantity;
  const discountAmount = Math.round(baseTotal * (discountPercentage / 100));
  const finalTotal = baseTotal - discountAmount;

  const handlePay = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsPaid(true);

      const session: PaymentSession = {
        id: `txn_${Date.now()}`,
        amount: finalTotal,
        currency: 'INR',
        seats: quantity,
        plan: showroom.name,
        discountPercent: discountPercentage,
        status: 'paid',
        transactionId: `TXN-${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
        customerName,
        customerEmail,
        timestamp: new Date().toLocaleTimeString(),
      };

      onPaymentSuccess(session);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4 animate-fade-in">
      <div className="w-full max-w-lg rounded-2xl border border-white bg-white/95 backdrop-blur-xl p-6 shadow-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600">
              <CreditCard className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                Instant One-Click Agentic Checkout
                <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 font-bold">
                  Lock Negotiated Deal
                </span>
              </h3>
              <p className="text-xs text-slate-500">
                Guaranteed price freeze & priority batch reservation
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 rounded-lg">
            <X className="h-4 w-4" />
          </button>
        </div>

        {isPaid ? (
          <div className="py-8 flex flex-col items-center justify-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 mb-3 animate-bounce">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <h4 className="text-lg font-black text-slate-900">Order & Reservation Confirmed!</h4>
            <p className="text-xs text-slate-600 mt-1 max-w-xs">
              Transaction has been verified and synced to the CRM database. Receipt sent to <strong>{customerEmail}</strong>.
            </p>
            <div className="mt-4 p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 font-mono">
              Order ID: SP-EV-{Math.floor(100000 + Math.random() * 900000)} · Status: FULFILLED
            </div>
            <button
              onClick={onClose}
              className="mt-5 px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800 transition-colors shadow-sm"
            >
              Return to Showroom
            </button>
          </div>
        ) : (
          <form onSubmit={handlePay} className="space-y-4 text-xs">
            {/* Order Summary Card */}
            <div className="rounded-xl border border-indigo-100 bg-gradient-to-br from-indigo-50/70 via-white to-slate-50 p-3.5 shadow-2xs">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 block">
                    {showroom.category}
                  </span>
                  <span className="text-sm font-black text-slate-900">{showroom.name}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold text-[10px]">
                  Qty: {quantity}
                </span>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-slate-200/80 text-[11px]">
                <div className="flex justify-between text-slate-500">
                  <span>List Total:</span>
                  <span className="line-through">₹{baseTotal.toLocaleString('en-IN')}</span>
                </div>
                {discountPercentage > 0 && (
                  <div className="flex justify-between text-emerald-600 font-semibold">
                    <span className="flex items-center gap-1">
                      <Tag className="h-3 w-3" /> Negotiated Volume Discount ({discountPercentage}%):
                    </span>
                    <span>-₹{discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-900 font-black text-sm pt-1 border-t border-slate-200">
                  <span>Final Investment:</span>
                  <span className="text-indigo-600 font-black">₹{finalTotal.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>

            {/* Zero-Risk Psychological Guarantee Seal */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-3 text-xs flex items-start gap-2.5">
              <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-emerald-900 block">30-Day Zero-Risk Ironclad Guarantee</span>
                <p className="text-[11px] text-emerald-800 leading-relaxed mt-0.5">
                  If you aren't completely blown away by the hardware throughput and voice precision, receive a 100% full refund with zero cancellation friction.
                </p>
              </div>
            </div>

            {/* Customer Contact Details */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Authorized Contact</label>
                <input
                  type="text"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Work Email</label>
                <input
                  type="email"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 focus:border-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            {/* Payment Method Selector */}
            <div>
              <label className="block text-slate-600 font-semibold mb-1 text-[11px]">Payment Authorization</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'card', label: 'Corporate Card', desc: 'Instant Approval' },
                  { id: 'invoice', label: 'Net-30 Invoice', desc: 'PO Required' },
                  { id: 'wire', label: 'RTGS / Wire', desc: 'Same-Day Clearance' },
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id as any)}
                    className={`p-2 rounded-xl text-left border transition-all ${
                      paymentMethod === m.id
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-900 font-bold'
                        : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <div className="text-[11px] font-bold">{m.label}</div>
                    <div className="text-[9px] text-slate-400">{m.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
              <div className="flex items-center gap-1 text-[10px] text-slate-500">
                <Lock className="h-3 w-3 text-emerald-600" />
                <span>256-Bit TLS Secured Transaction</span>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-semibold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isProcessing}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 text-white font-black hover:bg-emerald-700 shadow-sm transition-all active:scale-95 disabled:opacity-50"
                >
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>{isProcessing ? 'Authorizing...' : 'Authorize & Reserve Now'}</span>
                </button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
