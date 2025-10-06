import { useEffect, useState } from "react";
import { startupAPI, userAPI } from "../services/api";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const { toast } = useToast();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('all'); // 'all' | 'pending' | 'approved' | 'rejected' | 'requests'
  const [q, setQ] = useState('');
  const adminEmail = 'divyprakashpandey6@gmail.com';
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [counts, setCounts] = useState({ totalStartups: 0, totalUsers: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const email = (localStorage.getItem('userEmail') || '').toLowerCase();
    if (!isLoggedIn || email !== adminEmail) {
      window.location.href = '/login';
      return;
    }
    load('all');
    // fetch counts
    (async () => {
      try {
        const counts = await startupAPI.adminCounts();
        setCounts(counts);
      } catch {}
    })();
  }, []);

  const load = async (nextTab = tab) => {
    try {
      setLoading(true);
      const params = {};
      const status = nextTab === 'requests' ? 'pending' : nextTab;
      if (status !== 'all') params.status = status;
      if (q) params.q = q;
      const res = await startupAPI.adminList(params);
      setItems(res.startups || []);
    } catch (e) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const setStatus = async (id, status) => {
    try {
      const ok = window.confirm(`Are you sure you want to mark this as ${status}?`);
      if (!ok) return;
      await startupAPI.setStatus(id, status);
      // Optimistically update UI without full reload
      setItems(prev => {
        // When reviewing pending/requests, remove item from the list after action
        if (tab === 'pending' || tab === 'requests') {
          return prev.filter(s => (s._id || s.id) !== id);
        }
        // In "all" tab, update the status badge inline
        if (tab === 'all') {
          return prev.map(s => ((s._id || s.id) === id ? { ...s, status } : s));
        }
        // In specific status tabs, remove item if it no longer matches the tab
        if (tab === 'approved' && status !== 'approved') {
          return prev.filter(s => (s._id || s.id) !== id);
        }
        if (tab === 'rejected' && status !== 'rejected') {
          return prev.filter(s => (s._id || s.id) !== id);
        }
        return prev;
      });
      toast({ title: `Startup ${status}`, description: `Status set to ${status}.` });
    } catch (e) {
      toast({ title: 'Action failed', description: 'Please try again.', variant: 'destructive' });
    }
  };

  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'requests', label: 'New requests' },
    { key: 'pending', label: 'Pending' },
    { key: 'approved', label: 'Approved' },
    { key: 'rejected', label: 'Rejected' },
  ];

  const bulk = async (status) => {
    const ok = window.confirm(`Apply ${status} to ${items.length} startups?`);
    if (!ok || items.length === 0) return;
    try {
      for (const s of items) {
        await startupAPI.setStatus(s._id || s.id, status);
      }
      toast({ title: `Applied ${status} to ${items.length}`, description: 'Bulk action complete.' });
      await load();
    } catch (e) {
      toast({ title: 'Bulk action failed', description: 'Please try again.', variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#f8fafc] relative">
      {/* Your Content/Components */}
      <div className="relative z-10">
        <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <div className="flex gap-2">
          {(tab === 'pending' || tab === 'requests') && (
            <>
              <Button variant="outline" onClick={() => bulk('approved')}>Approve All</Button>
              <Button variant="outline" onClick={() => bulk('rejected')}>Reject All</Button>
            </>
          )}
          <Button
            variant="outline"
            onClick={async ()=>{
              try {
                setIsLoggingOut(true);
                await userAPI.logout();
              } catch {}
              try {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userName');
                localStorage.removeItem('userEmail');
              } catch {}
              window.location.href = '/login';
            }}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? 'Logging out…' : 'Logout'}
          </Button>
        </div>
      </div>

      {/* Stat row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          { key: 'totalStartups', label: 'Total Startups' },
          { key: 'totalUsers', label: 'Total Users' },
          { key: 'pending', label: 'Pending' },
          { key: 'approved', label: 'Approved' },
          { key: 'rejected', label: 'Rejected' },
        ].map((c)=> (
          <div key={c.key} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-600">{c.label}</div>
            <div className="text-2xl font-bold text-gray-900">{counts?.[c.key] ?? 0}</div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2">
          {tabs.map(t => (
            <button
              key={t.key}
              onClick={() => { setTab(t.key); load(t.key); }}
              className={`px-3 py-1.5 rounded-lg border ${tab===t.key? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'}`}
            >{t.label}</button>
          ))}
        </div>
        <input
          value={q}
          onChange={(e)=>setQ(e.target.value)}
          onKeyDown={(e)=>{ if(e.key==='Enter') load(); }}
          placeholder="Search startups, founders..."
          className="h-10 w-64 border border-gray-200 rounded-lg px-3"
        />
      </div>
      {loading ? (
        <div>Loading…</div>
      ) : (
        <div className="space-y-4">
          {items.map(s => (
            <div key={s._id || s.id} className="bg-white border rounded-xl p-4 flex items-center justify-between">
              <div>
                <div className="font-semibold">{s.name}</div>
                <div className="text-sm text-gray-600">{s.tagline}</div>
              </div>
              <div className="flex gap-2">
                <span className={`px-2 py-1 rounded-full text-xs ${s.status==='approved'?'bg-green-100 text-green-700': s.status==='pending'?'bg-yellow-100 text-yellow-700':'bg-red-100 text-red-700'}`}>{s.status || 'pending'}</span>
                {(tab === 'pending' || tab === 'requests') && (
                  <>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white" onClick={() => setStatus(s._id || s.id, 'approved')}>Approve</Button>
                    <Button variant="outline" onClick={() => setStatus(s._id || s.id, 'rejected')}>Reject</Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;


