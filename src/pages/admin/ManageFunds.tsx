import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Loader2, Landmark, Plus, Trash2, TrendingUp, TrendingDown, Clock, Banknote } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function ManageFunds() {
  const [funds, setFunds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newFund, setNewFund] = useState({
    title: '',
    amount: '',
    type: 'expense',
    description: ''
  });

  const fetchFunds = async () => {
    try {
      const res = await axios.get('/api/funds');
      setFunds(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFunds();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/api/funds', { ...newFund, amount: parseInt(newFund.amount) });
      setIsAdding(false);
      setNewFund({ title: '', amount: '', type: 'expense', description: '' });
      fetchFunds();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: number) => {

    try {
      await axios.delete(`/api/funds/${id}`);
      fetchFunds();
    } catch (err) {
      console.error(err);
    }
  };

  const totalFunds = funds.reduce((acc, fund) => {
    return fund.type === 'income' ? acc + fund.amount : acc - fund.amount;
  }, 0);

  if (loading) {
    return <div className="flex h-[60vh] items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-indigo-600" /></div>;
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <Landmark className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Manage Funds</h1>
            <p className="text-slate-500">Track and publish school funds updates.</p>
          </div>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium text-sm transition-colors shadow-sm"
        >
          {isAdding ? 'Cancel' : <><Plus className="w-4 h-4" /> Post Update</>}
        </button>
      </div>

      <div className="bg-gradient-to-r from-slate-900 to-indigo-900 rounded-2xl p-8 text-white shadow-lg flex items-center justify-between relative overflow-hidden">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 opacity-10">
          <Banknote className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <p className="text-indigo-200 font-semibold mb-2 text-sm uppercase tracking-wider">Current Balance</p>
          <h2 className="text-5xl font-bold">₱{totalFunds.toLocaleString()}</h2>
        </div>
      </div>

      {isAdding && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mb-6">
          <div className="p-6">
            <h2 className="text-lg font-bold text-slate-800 mb-4">New Fund Update</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Title</label>
                  <input type="text" required value={newFund.title} onChange={e => setNewFund({ ...newFund, title: e.target.value })} placeholder="e.g. Server Maintenance" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1.5">Amount (₱)</label>
                  <input type="number" min="0" required value={newFund.amount} onChange={e => setNewFund({ ...newFund, amount: e.target.value })} placeholder="0" className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Type</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg flex-1">
                    <input type="radio" name="type" value="expense" checked={newFund.type === 'expense'} onChange={e => setNewFund({ ...newFund, type: e.target.value })} className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                    <span className="text-slate-700 font-medium flex items-center gap-2">Expense <TrendingDown className="w-4 h-4 text-rose-500" /></span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-lg flex-1">
                    <input type="radio" name="type" value="income" checked={newFund.type === 'income'} onChange={e => setNewFund({ ...newFund, type: e.target.value })} className="text-indigo-600 focus:ring-indigo-500 w-4 h-4" />
                    <span className="text-slate-700 font-medium flex items-center gap-2">Income <TrendingUp className="w-4 h-4 text-emerald-500" /></span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Description (Optional)</label>
                <textarea value={newFund.description} onChange={e => setNewFund({ ...newFund, description: e.target.value })} placeholder="Details about this transaction..." className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 min-h-[80px] transition-colors resize-none" />
              </div>

              <div className="flex justify-end pt-4">
                <button type="submit" className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-semibold shadow-sm transition-colors">Save Update</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {funds.map(fund => (
          <div key={fund.id} className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row justify-between gap-4 transition-all hover:shadow-md">
            <div className="flex items-start gap-4 flex-1">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${fund.type === 'income' ? 'bg-emerald-100 text-emerald-600' : 'bg-rose-100 text-rose-600'}`}>
                {fund.type === 'income' ? <TrendingUp className="w-6 h-6" /> : <TrendingDown className="w-6 h-6" />}
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-lg">{fund.title}</h4>
                <div className="flex items-center gap-3 mt-1.5 text-sm font-medium text-slate-500">
                  <span className={`font-bold px-2.5 py-0.5 rounded-md ${fund.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {fund.type === 'income' ? '+' : '-'}₱{Math.abs(fund.amount).toLocaleString()}
                  </span>
                  <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-slate-400" /> {formatDistanceToNow(new Date(fund.createdAt), { addSuffix: true })}</span>
                </div>
                {fund.description && (
                  <p className="mt-2 text-sm text-slate-600">{fund.description}</p>
                )}
              </div>
            </div>
            <div className="shrink-0 flex items-start pt-1">
              <button
                onClick={() => handleDelete(fund.id)}
                className="flex items-center gap-1.5 px-3 py-2 bg-white text-slate-500 rounded-md hover:bg-rose-50 hover:text-rose-600 text-sm font-medium transition-colors border border-slate-200 hover:border-rose-200 shadow-sm"
              >
                <Trash2 className="w-4 h-4" /> Delete
              </button>
            </div>
          </div>
        ))}
        {funds.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 border-dashed">
            <Landmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 font-medium">No funds recorded yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
