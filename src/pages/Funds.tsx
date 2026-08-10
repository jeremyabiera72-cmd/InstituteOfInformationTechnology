import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Landmark, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function Funds() {
  const [funds, setFunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFunds = async () => {
    try {
      const res = await axios.get('/api/funds');
      setFunds(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const totalFunds = funds.reduce((acc, fund) => {
    return fund.type === 'income' ? acc + fund.amount : acc - fund.amount;
  }, 0);

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
          <Landmark className="w-6 h-6" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Student Funds</h1>
          <p className="text-slate-500">Track how the school funds are being used.</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-indigo-500 to-indigo-700 rounded-2xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Landmark className="w-32 h-32" />
        </div>
        <div className="relative z-10">
          <p className="text-indigo-100 font-medium mb-1 tracking-wide">TOTAL AVAILABLE FUNDS</p>
          <h2 className="text-5xl font-extrabold tracking-tight">₱{totalFunds.toLocaleString()}</h2>
        </div>
      </div>

      <div className="space-y-4 pt-4">
        <h3 className="text-lg font-bold text-slate-800 border-b border-slate-200 pb-2">Recent Updates</h3>

        {funds.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <Landmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No fund updates yet</p>
          </div>
        ) : (
          funds.map(fund => (
            <div key={fund.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex gap-4">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${fund.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {fund.type === 'income' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-lg">{fund.title}</h4>
                    <p className="text-slate-500 mt-1 text-sm">{fund.description}</p>
                  </div>
                  <div className={`font-bold text-lg whitespace-nowrap ${fund.type === 'income' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {fund.type === 'income' ? '+' : '-'}₱{Math.abs(fund.amount).toLocaleString()}
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-4 text-xs font-medium text-slate-400">
                  <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {formatDistanceToNow(new Date(fund.createdAt), { addSuffix: true })}</span>
                  <span>•</span>
                  <span>Posted by {fund.author?.fullName || 'Admin'}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
