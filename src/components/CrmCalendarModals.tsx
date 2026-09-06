import React, { useState } from 'react';
import { X, Calendar, UserPlus, CheckCircle, Clock, Building2, Mail, Users } from 'lucide-react';
import { CustomerState, CrmLead, CalendarBooking } from '../types/salespilot';

interface CrmModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: CustomerState;
  onSubmitLead: (lead: Partial<CrmLead>) => Promise<void>;
}

export const CrmModal: React.FC<CrmModalProps> = ({
  isOpen,
  onClose,
  state,
  onSubmitLead,
}) => {
  const [formData, setFormData] = useState({
    name: state.customer_profile.name || 'Priya Sharma',
    company: state.customer_profile.company || 'ApexScale Corp',
    email: state.customer_profile.email || 'priya.s@apexscale.io',
    userCount: state.user_count || 50,
    plan: state.product_interest || 'Growth Plan',
    notes: 'Lead qualified with score ' + state.qualification_score + '/100 via SalesPilot AI conversation.',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitLead(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl border border-white bg-white/95 backdrop-blur-xl p-6 shadow-2xl text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">Create CRM Lead Record</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-600 mb-2 animate-bounce" />
            <h4 className="text-base font-bold text-slate-900">Lead Successfully Created!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Pushed to CRM queue with qualification score {state.qualification_score}/100.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Contact Name</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Company</label>
              <input
                type="text"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Seats (Users)</label>
                <input
                  type="number"
                  value={formData.userCount}
                  onChange={(e) => setFormData({ ...formData, userCount: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                  required
                />
              </div>
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Plan</label>
              <input
                type="text"
                value={formData.plan}
                onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Deal Notes</label>
              <textarea
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold hover:bg-indigo-700 shadow-sm transition-colors"
              >
                {isSubmitting ? 'Saving...' : 'Confirm Lead Creation'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

interface CalendarModalProps {
  isOpen: boolean;
  onClose: () => void;
  state: CustomerState;
  onSubmitBooking: (booking: Partial<CalendarBooking>) => Promise<void>;
}

export const CalendarModal: React.FC<CalendarModalProps> = ({
  isOpen,
  onClose,
  state,
  onSubmitBooking,
}) => {
  const [bookingData, setBookingData] = useState({
    customerName: state.customer_profile.name || 'Priya Sharma',
    company: state.customer_profile.company || 'ApexScale Corp',
    date: '2026-09-09',
    time: '02:00 PM EST',
    attendeeEmail: state.customer_profile.email || 'priya.s@apexscale.io',
    notes: `Enterprise Solutions Architecture demo for ${state.user_count} seats on ${state.product_interest}.`,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmitBooking(bookingData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 1800);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-md p-4">
      <div className="w-full max-w-md rounded-2xl border border-white bg-white/95 backdrop-blur-xl p-6 shadow-2xl text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-emerald-600" />
            <h3 className="text-sm font-bold text-slate-900">Schedule Solutions Architect Demo</h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        {success ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <CheckCircle className="h-12 w-12 text-emerald-600 mb-2 animate-bounce" />
            <h4 className="text-base font-bold text-slate-900">Demo Booked Successfully!</h4>
            <p className="text-xs text-slate-500 mt-1">
              Sales stage progressed to "Demo Booked". Calendar invite dispatched to {bookingData.attendeeEmail}.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Attendee Name & Company</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={bookingData.customerName}
                  onChange={(e) => setBookingData({ ...bookingData, customerName: e.target.value })}
                  className="w-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
                <input
                  type="text"
                  value={bookingData.company}
                  onChange={(e) => setBookingData({ ...bookingData, company: e.target.value })}
                  className="w-1/2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                  required
                />
              </div>
              <div>
                <label className="block text-slate-600 font-semibold mb-1">Time Slot</label>
                <select
                  value={bookingData.time}
                  onChange={(e) => setBookingData({ ...bookingData, time: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                >
                  <option>10:00 AM EST</option>
                  <option>11:30 AM EST</option>
                  <option>02:00 PM EST</option>
                  <option>04:00 PM EST</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Invitee Email</label>
              <input
                type="email"
                value={bookingData.attendeeEmail}
                onChange={(e) => setBookingData({ ...bookingData, attendeeEmail: e.target.value })}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Architecture Notes</label>
              <textarea
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="mt-4 flex justify-end gap-2 pt-2 border-t border-slate-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-100 text-slate-700 font-medium hover:bg-slate-200 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-700 shadow-sm transition-colors"
              >
                {isSubmitting ? 'Confirming...' : 'Confirm Demo Booking'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
