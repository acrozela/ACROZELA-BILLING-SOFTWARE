import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  FileText, 
  CreditCard, 
  Grid, 
  TrendingUp, 
  Settings, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  Printer, 
  Share2, 
  Download, 
  Barcode, 
  Percent, 
  LogOut, 
  Menu, 
  Search, 
  Bell, 
  CheckCircle, 
  AlertCircle, 
  ArrowUpRight, 
  ArrowDownRight, 
  Building2, 
  Database, 
  RefreshCw, 
  Mail, 
  Phone, 
  MapPin, 
  Locate, 
  Calculator, 
  Wallet, 
  Landmark, 
  Receipt, 
  Package, 
  Camera, 
  Image as ImageIcon 
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { Client, Invoice, InvoiceItem, Expense, Product, ClientType, ViewState, AppState, CompanySettings } from './types.ts';
import { loadData, saveData, generateId } from './services/dataService.ts';
import { Logo } from './components/Logo.tsx';
import { GoogleSuite } from './components/GoogleSuite.tsx';

// --- Utilities ---
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  }).format(amount);
};

const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = error => reject(error);
  });
};

// --- Helper Components ---
const Card = ({ children, className = "", ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={`bg-white rounded-2xl border border-slate-100 shadow-lg shadow-slate-200/50 p-6 hover:shadow-xl transition-all duration-300 ${className}`} {...props}>
    {children}
  </div>
);

const Button = ({ children, onClick, variant = "primary", className = "", ...props }: any) => {
  const baseClass = "px-5 py-2.5 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 active:scale-95";
  const variants = {
    primary: "bg-brand-600 text-white shadow-lg shadow-brand-200 hover:bg-brand-700 hover:shadow-brand-300",
    secondary: "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 shadow-sm",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
    ghost: "text-slate-600 hover:bg-slate-100"
  };
  return (
    <button className={`${baseClass} ${variants[variant as keyof typeof variants]} ${className}`} onClick={onClick} {...props}>
      {children}
    </button>
  );
};

const Badge = ({ children, color = "blue" }: { children?: React.ReactNode, color?: string }) => {
  const colors: any = {
    blue: "bg-brand-100 text-brand-700",
    green: "bg-emerald-100 text-emerald-700",
    red: "bg-rose-100 text-rose-700",
    yellow: "bg-amber-100 text-amber-700",
    slate: "bg-slate-100 text-slate-700"
  };
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${colors[color] || colors.slate}`}>
      {children}
    </span>
  );
};

// --- Main App Component ---
export default function App() {
  // State
  const [data, setData] = useState<AppState>({ clients: [], products: [], invoices: [], expenses: [], settings: {} as CompanySettings, isGoogleConnected: false });
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Interaction States
  const [viewInvoice, setViewInvoice] = useState<Invoice | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [filterClientType, setFilterClientType] = useState<string>('ALL');
  
  // Tool States
  const [barcodeText, setBarcodeText] = useState("12345678");
  const [offerText, setOfferText] = useState({ title: "SUMMER SALE", discount: "20%" });
  const [gstCalc, setGstCalc] = useState({ amount: '', rate: 18, type: 'exclusive' });
  
  // Modal States
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [clientForm, setClientForm] = useState<Partial<Client>>({});
  
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [productForm, setProductForm] = useState<Partial<Product>>({});

  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [invoiceForm, setInvoiceForm] = useState<Partial<Invoice>>({ items: [], gstRate: 18, date: new Date().toISOString().split('T')[0] });
  const [invoiceItem, setInvoiceItem] = useState<Partial<InvoiceItem>>({ description: '', quantity: 1, rate: 0, discount: 0, quality: '' });

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseForm, setExpenseForm] = useState<Partial<Expense>>({ date: new Date().toISOString().split('T')[0] });

  // Load Data on Mount
  useEffect(() => {
    setData(loadData());
  }, []);

  // Save Data on Change
  useEffect(() => {
    if (data.clients.length > 0 || data.invoices.length > 0 || data.settings.name || data.products.length > 0) {
      saveData(data);
    }
  }, [data]);

  // --- Handlers ---

  const handleConnectGoogle = () => {
    setData(prev => ({ ...prev, isGoogleConnected: true }));
  };

  const handleSaveClient = () => {
    if (!clientForm.name || !clientForm.type) return alert("Name and Type are required");
    if (editingClient) {
      setData(prev => ({ ...prev, clients: prev.clients.map(c => c.id === editingClient.id ? { ...c, ...clientForm } as Client : c) }));
    } else {
      setData(prev => ({ ...prev, clients: [...prev.clients, { id: generateId(), balance: 0, name: clientForm.name!, type: clientForm.type!, email: clientForm.email || '', phone: clientForm.phone || '', address: clientForm.address || '', gstin: clientForm.gstin || '', locationPin: clientForm.locationPin || '', photo: clientForm.photo }] }));
    }
    setIsClientModalOpen(false); setEditingClient(null); setClientForm({});
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const base64 = await fileToBase64(e.target.files[0]);
      setClientForm(prev => ({ ...prev, photo: base64 }));
    }
  };

  const handleSaveProduct = () => {
    if (!productForm.name || !productForm.rate) return alert("Product Name and Rate are required");
    const newProduct: Product = {
      id: generateId(),
      name: productForm.name!,
      quality: productForm.quality || '',
      quantity: productForm.quantity || 0,
      rate: Number(productForm.rate)
    };
    setData(prev => ({ ...prev, products: [...prev.products, newProduct] }));
    setIsProductModalOpen(false); setProductForm({});
  };

  const handleSaveExpense = () => {
      if (!expenseForm.category || !expenseForm.amount) return alert("Category and Amount required");
      const newExpense: Expense = {
          id: generateId(),
          category: expenseForm.category!,
          amount: Number(expenseForm.amount),
          date: expenseForm.date || new Date().toISOString(),
          description: expenseForm.description || '',
          paymentMethod: expenseForm.paymentMethod || 'Cash'
      };
      setData(prev => ({ ...prev, expenses: [newExpense, ...prev.expenses] }));
      setIsExpenseModalOpen(false); setExpenseForm({ date: new Date().toISOString().split('T')[0] });
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
       navigator.geolocation.getCurrentPosition(
           (pos) => setClientForm(prev => ({ ...prev, locationPin: `${pos.coords.latitude.toFixed(6)}, ${pos.coords.longitude.toFixed(6)}` })),
           (err) => alert("Could not fetch location.")
       );
    }
  };

  const handleSaveInvoice = () => {
    if (!invoiceForm.clientId || !invoiceForm.items?.length) return alert("Select client and add items");
    const client = data.clients.find(c => c.id === invoiceForm.clientId);
    const subtotal = invoiceForm.items.reduce((acc, item) => acc + item.total, 0);
    const taxAmount = subtotal * ((invoiceForm.gstRate || 0) / 100);
    const total = subtotal + taxAmount;
    
    const newInvoice: Invoice = {
      id: generateId(),
      clientId: invoiceForm.clientId,
      clientName: client?.name || 'Unknown',
      clientAddress: client?.address,
      clientGstin: client?.gstin,
      date: invoiceForm.date || new Date().toISOString(),
      dueDate: invoiceForm.dueDate || new Date().toISOString(),
      items: invoiceForm.items,
      subtotal,
      gstRate: invoiceForm.gstRate || 0,
      taxAmount,
      discount: 0,
      total,
      status: 'Pending',
      notes: invoiceForm.notes,
      terms: invoiceForm.terms
    };
    
    setData(prev => ({ 
        ...prev, 
        invoices: [newInvoice, ...prev.invoices],
        clients: prev.clients.map(c => c.id === client?.id ? { ...c, balance: c.balance + total } : c)
    }));
    setIsInvoiceModalOpen(false); setInvoiceForm({ items: [], gstRate: 18, date: new Date().toISOString().split('T')[0] });
  };

  const stats = useMemo(() => {
    const totalSales = data.invoices.reduce((acc, inv) => acc + inv.total, 0);
    const totalExpenses = data.expenses.reduce((acc, exp) => acc + exp.amount, 0);
    const totalProfit = totalSales - totalExpenses;
    const pendingAmount = data.invoices.filter(i => i.status === 'Pending').reduce((acc, i) => acc + i.total, 0);
    return { totalSales, totalExpenses, totalProfit, pendingAmount, totalClients: data.clients.length };
  }, [data]);

  const filteredClients = useMemo(() => {
    if (filterClientType === 'ALL') return data.clients;
    return data.clients.filter(c => c.type === filterClientType);
  }, [data.clients, filterClientType]);

  // --- Views ---

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-gradient-to-br from-brand-600 to-brand-700 text-white border-none shadow-brand-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-brand-100 text-sm font-medium mb-1">Total Revenue</p>
              <h3 className="text-3xl font-bold tracking-tight">{formatCurrency(stats.totalSales)}</h3>
            </div>
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <TrendingUp size={24} className="text-white" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-xs text-brand-100 gap-1 bg-white/10 w-fit px-2 py-1 rounded-lg">
             <ArrowUpRight size={14} /> <span>Income</span>
          </div>
        </Card>

        <Card>
           <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Total Expenses</p>
              <h3 className="text-3xl font-bold text-slate-800">{formatCurrency(stats.totalExpenses)}</h3>
            </div>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <ArrowDownRight size={24} />
            </div>
          </div>
           <div className="mt-4 flex items-center text-xs text-red-600 gap-1">
             <ArrowUpRight size={14} /> <span>Outgoing</span>
          </div>
        </Card>

         <Card>
           <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Net Profit</p>
              <h3 className={`text-3xl font-bold ${stats.totalProfit >= 0 ? 'text-emerald-600' : 'text-red-600'}`}>{formatCurrency(stats.totalProfit)}</h3>
            </div>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <Wallet size={24} />
            </div>
          </div>
           <div className="mt-4 flex items-center text-xs text-emerald-600 gap-1">
             <span>{stats.totalProfit >= 0 ? 'Profitable' : 'Loss Making'}</span>
          </div>
        </Card>

        <Card>
           <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Pending Dues</p>
              <h3 className="text-3xl font-bold text-slate-800">{formatCurrency(stats.pendingAmount)}</h3>
            </div>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <AlertCircle size={24} />
            </div>
          </div>
           <div className="mt-4 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
             <div className="bg-amber-500 h-full rounded-full" style={{ width: '45%' }}></div>
          </div>
        </Card>
      </div>

      {/* Quick Tools */}
      <div>
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Grid size={20}/> Business Tools</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {[
                  { label: 'GST Calc', icon: <Calculator size={24} />, action: () => setActiveTool('GST') },
                  { label: 'Profit Calc', icon: <TrendingUp size={24} />, action: () => setActiveTool('Income') },
                  { label: 'Barcode', icon: <Barcode size={24} />, action: () => setActiveTool('Barcode') },
                  { label: 'Offers', icon: <Percent size={24} />, action: () => setActiveTool('Offers') },
                  { label: 'Share', icon: <Share2 size={24} />, action: () => { if(navigator.share) navigator.share({title: 'Billing', url: window.location.href}) } },
                  { label: 'Backup', icon: <Download size={24} />, action: () => { const b = new Blob([JSON.stringify(data)],{type:'application/json'}); const a=document.createElement('a'); a.href=URL.createObjectURL(b); a.download='backup.json'; a.click(); } },
              ].map((tool, idx) => (
                  <button key={idx} onClick={tool.action} className="group flex flex-col items-center justify-center p-6 bg-white border border-slate-200 rounded-2xl hover:border-brand-500 hover:shadow-lg transition-all duration-300 active:scale-95">
                      <div className="mb-3 text-slate-500 group-hover:text-brand-600 transition-colors bg-slate-50 group-hover:bg-brand-50 p-3 rounded-xl">{tool.icon}</div>
                      <span className="text-sm font-bold text-slate-600 group-hover:text-slate-900">{tool.label}</span>
                  </button>
              ))}
          </div>
      </div>
    </div>
  );

  const ExpensesView = () => (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
                <h2 className="text-2xl font-bold text-slate-800">Expense Tracker</h2>
                <p className="text-slate-500 text-sm">Monitor your business spending and overheads</p>
            </div>
            <Button onClick={() => setIsExpenseModalOpen(true)}>
                <Plus size={18} /> Add Expense
            </Button>
       </div>
       <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
            <table className="w-full text-left">
                 <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Category</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Description</th>
                        <th className="p-4 text-sm font-semibold text-slate-600">Amount</th>
                        <th className="p-4 text-sm font-semibold text-slate-600 text-right">Action</th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-slate-100">
                    {data.expenses.length === 0 ? (
                        <tr><td colSpan={5} className="p-12 text-center text-slate-400">No expenses recorded yet.</td></tr>
                    ) : (
                        data.expenses.map(exp => (
                            <tr key={exp.id} className="hover:bg-slate-50">
                                <td className="p-4 text-slate-600">{new Date(exp.date).toLocaleDateString('en-IN')}</td>
                                <td className="p-4"><Badge color="red">{exp.category}</Badge></td>
                                <td className="p-4 text-slate-600">{exp.description}</td>
                                <td className="p-4 font-bold text-slate-800">{formatCurrency(exp.amount)}</td>
                                <td className="p-4 text-right">
                                    <button onClick={() => setData(prev => ({...prev, expenses: prev.expenses.filter(e => e.id !== exp.id)}))} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                </td>
                            </tr>
                        ))
                    )}
                 </tbody>
            </table>
       </div>
    </div>
  );

  // --- Print View (Professional GST Invoice) ---
  if (viewInvoice) {
      return (
          <div className="min-h-screen bg-slate-600 p-4 md:p-8 flex justify-center overflow-auto print:p-0 print:bg-white">
              <div className="bg-white w-[210mm] min-h-[297mm] shadow-2xl p-8 md:p-12 text-slate-900 relative animate-in fade-in zoom-in duration-300 print:shadow-none print:w-full">
                  {/* Print Actions */}
                  <div className="absolute top-4 right-4 print:hidden flex gap-2">
                      <Button onClick={() => window.print()}><Printer size={16}/> Print</Button>
                      <Button variant="secondary" onClick={() => setViewInvoice(null)}><X size={16}/> Close</Button>
                  </div>

                  {/* Invoice Header */}
                  <div className="flex justify-between items-start border-b-2 border-slate-800 pb-6 mb-6">
                      <div className="flex flex-col">
                          <div className="mb-4">
                             <Logo className="h-10 w-auto" />
                          </div>
                          <h1 className="text-3xl font-extrabold text-brand-700 tracking-tight mb-2">{data.settings.name || "YOUR COMPANY"}</h1>
                          <p className="w-72 text-sm text-slate-600 leading-relaxed">{data.settings.address}</p>
                          <div className="mt-4 space-y-1 text-sm">
                              <p>GSTIN: <span className="font-semibold">{data.settings.gstin}</span></p>
                              <p>Email: <span className="font-semibold">{data.settings.email}</span></p>
                              <p>Phone: <span className="font-semibold">{data.settings.phone}</span></p>
                          </div>
                      </div>
                      <div className="text-right">
                          <h2 className="text-3xl font-bold text-slate-800 uppercase tracking-widest">Tax Invoice</h2>
                          <p className="text-slate-500 mt-1">Original for Recipient</p>
                          <div className="mt-6 text-right">
                              <p className="text-sm text-slate-500">Invoice No.</p>
                              <p className="text-xl font-mono font-bold">#{viewInvoice.id}</p>
                              <p className="text-sm text-slate-500 mt-2">Date</p>
                              <p className="font-medium">{new Date(viewInvoice.date).toLocaleDateString('en-IN')}</p>
                          </div>
                      </div>
                  </div>

                  {/* Billed To */}
                  <div className="bg-slate-50 p-6 rounded-lg border border-slate-100 mb-8 flex justify-between">
                      <div>
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Billed To</p>
                          <h3 className="text-xl font-bold text-slate-900">{viewInvoice.clientName}</h3>
                          <p className="text-sm text-slate-600 whitespace-pre-wrap mt-1 max-w-sm">{viewInvoice.clientAddress || "Address not provided"}</p>
                      </div>
                      <div className="text-right">
                          {viewInvoice.clientGstin && (
                              <div className="mb-2">
                                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Client GSTIN</p>
                                  <p className="font-mono font-semibold">{viewInvoice.clientGstin}</p>
                              </div>
                          )}
                          <div>
                              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Due Date</p>
                              <p className="font-medium text-red-600">{new Date(viewInvoice.dueDate).toLocaleDateString('en-IN')}</p>
                          </div>
                      </div>
                  </div>

                  {/* Items Table */}
                  <table className="w-full mb-8 border-collapse">
                      <thead>
                          <tr className="bg-slate-800 text-white">
                              <th className="py-3 px-4 text-left text-sm font-semibold first:rounded-tl-lg">Product / Description</th>
                              <th className="py-3 px-4 text-left text-sm font-semibold">Quality</th>
                              <th className="py-3 px-4 text-right text-sm font-semibold">Qty</th>
                              <th className="py-3 px-4 text-right text-sm font-semibold">Rate</th>
                              <th className="py-3 px-4 text-right text-sm font-semibold">Disc</th>
                              <th className="py-3 px-4 text-right text-sm font-semibold last:rounded-tr-lg">Total</th>
                          </tr>
                      </thead>
                      <tbody>
                          {viewInvoice.items.map((item, i) => (
                              <tr key={i} className="border-b border-slate-200">
                                  <td className="py-4 px-4 text-sm font-medium">{item.description}</td>
                                  <td className="py-4 px-4 text-sm text-slate-600">{item.quality || '-'}</td>
                                  <td className="py-4 px-4 text-right text-sm">{item.quantity}</td>
                                  <td className="py-4 px-4 text-right text-sm">{formatCurrency(item.rate)}</td>
                                  <td className="py-4 px-4 text-right text-sm">{item.discount ? item.discount + '%' : '-'}</td>
                                  <td className="py-4 px-4 text-right text-sm font-bold">{formatCurrency(item.total)}</td>
                              </tr>
                          ))}
                      </tbody>
                  </table>

                  {/* Calculations */}
                  <div className="flex justify-end mb-12">
                      <div className="w-72 bg-slate-50 p-4 rounded-lg border border-slate-100">
                          <div className="flex justify-between text-slate-600 mb-2">
                              <span>Subtotal</span>
                              <span className="font-medium">{formatCurrency(viewInvoice.subtotal)}</span>
                          </div>
                          <div className="flex justify-between text-slate-600 mb-2">
                              <span>GST ({viewInvoice.gstRate}%)</span>
                              <span className="font-medium">{formatCurrency(viewInvoice.taxAmount)}</span>
                          </div>
                          <div className="flex justify-between text-slate-900 font-bold text-xl pt-4 border-t-2 border-slate-200 mt-2">
                              <span>Grand Total</span>
                              <span>{formatCurrency(viewInvoice.total)}</span>
                          </div>
                          <div className="text-right text-xs text-slate-500 mt-2">Amount inclusive of all taxes</div>
                      </div>
                  </div>

                  {/* Bank & Terms */}
                  <div className="grid grid-cols-2 gap-8 border-t border-slate-200 pt-8">
                      <div>
                          <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase">Bank Details</h4>
                          <pre className="text-sm text-slate-600 font-sans whitespace-pre-wrap">{data.settings.bankDetails}</pre>
                          <div className="mt-4">
                              <h4 className="font-bold text-slate-800 mb-2 text-sm uppercase">Terms & Conditions</h4>
                              <p className="text-xs text-slate-500 leading-relaxed">
                                  1. Goods once sold will not be taken back.<br/>
                                  2. Interest @18% p.a. will be charged if payment is delayed.<br/>
                                  3. Subject to local jurisdiction.
                              </p>
                          </div>
                      </div>
                      <div className="flex flex-col justify-end items-end">
                          <div className="h-20 mb-2"></div> 
                          <div className="text-right">
                              <p className="font-bold text-slate-900 text-lg mb-1">{data.settings.name}</p>
                              <p className="text-xs text-slate-500 uppercase tracking-widest border-t border-slate-300 pt-2">Authorized Signatory</p>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-900 text-white transform transition-transform duration-300 lg:relative lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} shadow-2xl flex flex-col`}>
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="bg-white px-3 py-1.5 rounded-lg shadow-lg shadow-white/10">
             <Logo className="h-6" />
          </div>
          <button className="lg:hidden text-slate-400 hover:text-white" onClick={() => setIsMobileMenuOpen(false)}><X size={24}/></button>
        </div>
        
        <nav className="p-4 space-y-2 mt-4 flex-1">
          {[
            { id: ViewState.DASHBOARD, label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
            { id: ViewState.CLIENTS, label: 'Client Manager', icon: <Users size={20} /> },
            { id: ViewState.INVENTORY, label: 'Inventory / Stock', icon: <Package size={20} /> },
            { id: ViewState.INVOICES, label: 'Invoices & Orders', icon: <FileText size={20} /> },
            { id: ViewState.EXPENSES, label: 'Expenses', icon: <ArrowDownRight size={20} /> },
            { id: ViewState.GOOGLE_TOOLS, label: 'Google Suite', icon: <Grid size={20} /> },
            { id: ViewState.SETTINGS, label: 'Settings', icon: <Settings size={20} /> },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => { setCurrentView(item.id); setIsMobileMenuOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 border border-transparent font-medium tracking-wide ${currentView === item.id ? 'bg-brand-600 text-white shadow-lg shadow-brand-900/50' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}
            >
              {item.icon}
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-slate-800 bg-slate-950/30">
             <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center font-bold text-white shadow-md">A</div>
                 <div>
                     <p className="text-sm font-semibold text-white">Admin</p>
                     <p className="text-xs text-brand-300">Premium Plan</p>
                 </div>
             </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 h-16 flex items-center justify-between px-6 lg:px-8 z-40 sticky top-0 shadow-sm">
            <div className="flex items-center gap-4">
                <button className="lg:hidden text-slate-600" onClick={() => setIsMobileMenuOpen(true)}>
                    <Menu size={24} />
                </button>
                <div className="hidden md:flex items-center gap-2 text-slate-400 bg-slate-100 px-4 py-2 rounded-full border border-slate-200 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 transition-all">
                    <Search size={16} />
                    <input type="text" placeholder="Search..." className="bg-transparent outline-none text-sm text-slate-700 w-48"/>
                </div>
            </div>
            <div className="flex items-center gap-4">
                <div className="text-right hidden sm:block">
                    <p className="text-xs font-bold text-slate-800 uppercase tracking-wide">{new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
            </div>
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 scroll-smooth flex flex-col">
            <div className="max-w-7xl mx-auto pb-12 w-full flex-grow">
                {currentView === ViewState.DASHBOARD && <DashboardView />}
                {currentView === ViewState.EXPENSES && <ExpensesView />}
                {currentView === ViewState.GOOGLE_TOOLS && <GoogleSuite isConnected={data.isGoogleConnected} onConnect={handleConnectGoogle} />}
                
                {currentView === ViewState.INVENTORY && (
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                          <h2 className="text-2xl font-bold text-slate-800">Inventory & Stock</h2>
                          <Button onClick={() => setIsProductModalOpen(true)}><Plus size={18}/> Add Product</Button>
                      </div>
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                          <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                      <th className="p-4 text-sm font-semibold text-slate-600">Product Name</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600">Quality</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600">Qty in Stock</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600">Rate</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600 text-right">Action</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {data.products.length === 0 ? (
                                      <tr><td colSpan={5} className="p-8 text-center text-slate-400">No products added yet.</td></tr>
                                  ) : (
                                      data.products.map(prod => (
                                          <tr key={prod.id} className="hover:bg-slate-50">
                                              <td className="p-4 font-medium text-slate-800">{prod.name}</td>
                                              <td className="p-4 text-slate-600">{prod.quality}</td>
                                              <td className="p-4 font-bold text-slate-800">{prod.quantity}</td>
                                              <td className="p-4 text-slate-800">{formatCurrency(prod.rate)}</td>
                                              <td className="p-4 text-right">
                                                  <button onClick={() => setData(prev => ({...prev, products: prev.products.filter(p => p.id !== prod.id)}))} className="text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
                                              </td>
                                          </tr>
                                      ))
                                  )}
                              </tbody>
                          </table>
                      </div>
                   </div>
                )}

                {currentView === ViewState.CLIENTS && (
                   <div className="space-y-6">
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                          <div>
                            <h2 className="text-2xl font-bold text-slate-800">Client Manager</h2>
                            <p className="text-slate-500 text-sm">Manage Retailers, Wholesalers, Distributors</p>
                          </div>
                          <div className="flex gap-2">
                             <select className="bg-white border p-2.5 rounded-xl text-sm" value={filterClientType} onChange={e => setFilterClientType(e.target.value)}>
                                 <option value="ALL">All Clients</option>
                                 {Object.values(ClientType).map(t => <option key={t} value={t}>{t}</option>)}
                             </select>
                             <Button onClick={() => { setClientForm({}); setEditingClient(null); setIsClientModalOpen(true); }}><Plus size={18}/> New Client</Button>
                          </div>
                      </div>
                      
                      {/* Rich Data Table for Clients */}
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-x-auto">
                          <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                      <th className="p-4 text-sm font-semibold text-slate-600 w-16">Photo</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600">Name & Type</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600">Contact</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600">Shop Address & Pin</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600">Orders</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600 text-right">Action</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {filteredClients.length === 0 ? (
                                      <tr><td colSpan={6} className="p-8 text-center text-slate-400">No clients found.</td></tr>
                                  ) : (
                                      filteredClients.map(client => (
                                          <tr key={client.id} className="hover:bg-slate-50">
                                              <td className="p-4">
                                                  {client.photo ? (
                                                      <img src={client.photo} alt="Client" className="w-10 h-10 rounded-full object-cover border border-slate-200"/>
                                                  ) : (
                                                      <div className="w-10 h-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">{client.name.charAt(0)}</div>
                                                  )}
                                              </td>
                                              <td className="p-4">
                                                  <div className="font-bold text-slate-900">{client.name}</div>
                                                  <div className="text-xs text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full w-fit mt-1">{client.type}</div>
                                              </td>
                                              <td className="p-4">
                                                  <div className="text-sm font-medium text-slate-800">{client.phone}</div>
                                                  <div className="text-xs text-slate-500">{client.email}</div>
                                              </td>
                                              <td className="p-4">
                                                  <div className="text-sm text-slate-600 max-w-xs truncate">{client.address}</div>
                                                  {client.locationPin && (
                                                      <div className="flex items-center gap-1 text-xs text-brand-600 mt-1">
                                                          <MapPin size={10} /> {client.locationPin}
                                                      </div>
                                                  )}
                                              </td>
                                              <td className="p-4">
                                                  <span className="font-bold text-slate-800">
                                                      {data.invoices.filter(i => i.clientId === client.id).length}
                                                  </span>
                                                  <span className="text-xs text-slate-400 ml-1">Orders</span>
                                              </td>
                                              <td className="p-4 text-right">
                                                  <button onClick={() => { setEditingClient(client); setClientForm(client); setIsClientModalOpen(true); }} className="p-2 text-slate-400 hover:text-brand-600"><Edit2 size={16}/></button>
                                              </td>
                                          </tr>
                                      ))
                                  )}
                              </tbody>
                          </table>
                      </div>
                   </div>
                )}

                {currentView === ViewState.INVOICES && (
                   <div className="space-y-6">
                      <div className="flex justify-between items-center">
                          <h2 className="text-2xl font-bold text-slate-800">Invoices & Orders</h2>
                          <Button onClick={() => setIsInvoiceModalOpen(true)}><Plus size={18}/> New Invoice</Button>
                      </div>
                      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                          <table className="w-full text-left">
                              <thead className="bg-slate-50 border-b border-slate-200">
                                  <tr>
                                      <th className="p-4 text-sm font-semibold text-slate-600">ID</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600">Client</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600">Date</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600">Amount</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600">Status</th>
                                      <th className="p-4 text-sm font-semibold text-slate-600 text-right">Action</th>
                                  </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                  {data.invoices.map(inv => (
                                      <tr key={inv.id} className="hover:bg-slate-50">
                                          <td className="p-4 font-mono text-xs font-bold text-slate-500">#{inv.id}</td>
                                          <td className="p-4 font-medium text-slate-800">{inv.clientName}</td>
                                          <td className="p-4 text-sm text-slate-600">{new Date(inv.date).toLocaleDateString('en-IN')}</td>
                                          <td className="p-4 font-bold text-slate-800">{formatCurrency(inv.total)}</td>
                                          <td className="p-4"><Badge color={inv.status === 'Paid' ? 'green' : 'yellow'}>{inv.status}</Badge></td>
                                          <td className="p-4 text-right">
                                              <button onClick={() => setViewInvoice(inv)} className="text-brand-600 font-medium hover:underline text-sm">View</button>
                                          </td>
                                      </tr>
                                  ))}
                              </tbody>
                          </table>
                      </div>
                   </div>
                )}
            </div>

            {/* Footer */}
            <footer className="mt-12 py-8 bg-white border-t border-slate-200">
                <div className="max-w-7xl mx-auto px-4 flex flex-col items-center">
                    <div className="mb-4">
                        <Logo className="h-8 w-auto" />
                    </div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-slate-900 tracking-wide">ACROZELA</span>
                        <span className="text-slate-400">|</span>
                        <span className="text-slate-500 text-sm">Billing Software</span>
                    </div>
                    <p className="text-slate-400 text-sm font-medium">© 2025 Acrozela Enterprises. All rights reserved.</p>
                </div>
            </footer>
        </div>
      </main>

      {/* --- Modals --- */}
      
      {/* Client Modal */}
      {isClientModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl animate-in zoom-in-95 overflow-y-auto max-h-[90vh]">
                 <div className="flex justify-between mb-4">
                     <h3 className="text-xl font-bold">Client Details</h3>
                     <button onClick={() => setIsClientModalOpen(false)}><X className="text-slate-400"/></button>
                 </div>
                 <div className="space-y-4">
                     {/* Photo Upload */}
                     <div className="flex items-center gap-4">
                         <div className="relative w-20 h-20 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center overflow-hidden">
                             {clientForm.photo ? <img src={clientForm.photo} className="w-full h-full object-cover"/> : <ImageIcon className="text-slate-400"/>}
                             <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={handlePhotoUpload}/>
                         </div>
                         <div>
                             <p className="text-sm font-bold text-slate-700">Upload Photo</p>
                             <p className="text-xs text-slate-500">Click to upload logo or profile</p>
                         </div>
                     </div>

                     <div className="grid grid-cols-2 gap-4">
                         <input type="text" placeholder="Name" className="border p-2.5 rounded-lg" value={clientForm.name || ''} onChange={e => setClientForm({...clientForm, name: e.target.value})}/>
                         <select className="border p-2.5 rounded-lg" value={clientForm.type} onChange={e => setClientForm({...clientForm, type: e.target.value as ClientType})}>
                             <option value="">Select Type</option>
                             {Object.values(ClientType).map(t => <option key={t} value={t}>{t}</option>)}
                         </select>
                     </div>
                     <input type="tel" placeholder="Phone Number" className="w-full border p-2.5 rounded-lg" value={clientForm.phone || ''} onChange={e => setClientForm({...clientForm, phone: e.target.value})}/>
                     <input type="email" placeholder="Email" className="w-full border p-2.5 rounded-lg" value={clientForm.email || ''} onChange={e => setClientForm({...clientForm, email: e.target.value})}/>
                     <textarea placeholder="Shop Address" className="w-full border p-2.5 rounded-lg h-20 resize-none" value={clientForm.address || ''} onChange={e => setClientForm({...clientForm, address: e.target.value})}/>
                     <div className="flex gap-2">
                         <input type="text" placeholder="Location Pin (Lat, Long)" className="flex-1 border p-2.5 rounded-lg" value={clientForm.locationPin || ''} onChange={e => setClientForm({...clientForm, locationPin: e.target.value})}/>
                         <button onClick={handleGetLocation} className="px-3 bg-brand-50 text-brand-600 rounded-lg border border-brand-200"><Locate size={20}/></button>
                     </div>
                     <input type="text" placeholder="GSTIN" className="w-full border p-2.5 rounded-lg" value={clientForm.gstin || ''} onChange={e => setClientForm({...clientForm, gstin: e.target.value})}/>
                     
                     <div className="flex justify-end gap-2 pt-2">
                         <Button variant="secondary" onClick={() => setIsClientModalOpen(false)}>Cancel</Button>
                         <Button onClick={handleSaveClient}>Save Client</Button>
                     </div>
                 </div>
             </div>
          </div>
      )}

      {/* Product Modal */}
      {isProductModalOpen && (
          <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
                 <div className="flex justify-between mb-4">
                     <h3 className="text-xl font-bold">Add Product</h3>
                     <button onClick={() => setIsProductModalOpen(false)}><X className="text-slate-400"/></button>
                 </div>
                 <div className="space-y-4">
                     <input type="text" placeholder="Product Name" className="w-full border p-2.5 rounded-lg" value={productForm.name || ''} onChange={e => setProductForm({...productForm, name: e.target.value})}/>
                     <input type="text" placeholder="Quality (e.g. Premium, Grade A)" className="w-full border p-2.5 rounded-lg" value={productForm.quality || ''} onChange={e => setProductForm({...productForm, quality: e.target.value})}/>
                     <div className="grid grid-cols-2 gap-4">
                         <input type="number" placeholder="Quantity" className="border p-2.5 rounded-lg" value={productForm.quantity || ''} onChange={e => setProductForm({...productForm, quantity: Number(e.target.value)})}/>
                         <input type="number" placeholder="Rate" className="border p-2.5 rounded-lg" value={productForm.rate || ''} onChange={e => setProductForm({...productForm, rate: Number(e.target.value)})}/>
                     </div>
                     <div className="flex justify-end gap-2 pt-2">
                         <Button variant="secondary" onClick={() => setIsProductModalOpen(false)}>Cancel</Button>
                         <Button onClick={handleSaveProduct}>Save Product</Button>
                     </div>
                 </div>
             </div>
          </div>
      )}

      {/* GST Calculator Modal */}
      {activeTool === 'GST' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl relative">
                <button onClick={() => setActiveTool(null)} className="absolute top-4 right-4 text-slate-400"><X/></button>
                <Calculator className="text-brand-600 mb-4" size={40}/>
                <h3 className="text-xl font-bold mb-4">GST Calculator</h3>
                <div className="space-y-3">
                    <input type="number" placeholder="Amount" className="w-full border p-2 rounded-lg" value={gstCalc.amount} onChange={e => setGstCalc({...gstCalc, amount: e.target.value})}/>
                    <div className="flex gap-2">
                         {[5, 12, 18, 28].map(r => (
                             <button key={r} onClick={() => setGstCalc({...gstCalc, rate: r})} className={`flex-1 py-1 rounded border ${gstCalc.rate === r ? 'bg-brand-600 text-white' : 'bg-slate-50'}`}>{r}%</button>
                         ))}
                    </div>
                    <div className="flex gap-2">
                         <button onClick={() => setGstCalc({...gstCalc, type: 'exclusive'})} className={`flex-1 py-1 rounded border ${gstCalc.type === 'exclusive' ? 'bg-brand-600 text-white' : 'bg-slate-50'}`}>Exclusive</button>
                         <button onClick={() => setGstCalc({...gstCalc, type: 'inclusive'})} className={`flex-1 py-1 rounded border ${gstCalc.type === 'inclusive' ? 'bg-brand-600 text-white' : 'bg-slate-50'}`}>Inclusive</button>
                    </div>
                    {gstCalc.amount && (
                        <div className="bg-slate-50 p-4 rounded-lg mt-4 text-center">
                            <p className="text-xs text-slate-500">Tax Amount</p>
                            <p className="font-bold text-lg">
                                {gstCalc.type === 'exclusive' 
                                    ? formatCurrency(Number(gstCalc.amount) * (gstCalc.rate/100)) 
                                    : formatCurrency(Number(gstCalc.amount) - (Number(gstCalc.amount) * (100 / (100 + gstCalc.rate))))}
                            </p>
                            <p className="text-xs text-slate-500 mt-2">Total Amount</p>
                            <p className="font-bold text-xl text-brand-600">
                                {gstCalc.type === 'exclusive'
                                    ? formatCurrency(Number(gstCalc.amount) * (1 + gstCalc.rate/100))
                                    : formatCurrency(Number(gstCalc.amount))}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      )}

      {/* Income Calculator Modal */}
      {activeTool === 'Income' && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl p-8 w-full max-w-sm shadow-2xl relative text-center">
                <button onClick={() => setActiveTool(null)} className="absolute top-4 right-4 text-slate-400"><X/></button>
                <Landmark className="text-emerald-600 mb-4 mx-auto" size={40}/>
                <h3 className="text-xl font-bold mb-1">Profit & Loss</h3>
                <p className="text-sm text-slate-500 mb-6">Based on current data</p>
                <div className="space-y-4">
                     <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
                         <span className="text-emerald-800 font-medium">Total Income</span>
                         <span className="font-bold text-emerald-700">{formatCurrency(stats.totalSales)}</span>
                     </div>
                     <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                         <span className="text-red-800 font-medium">Total Expenses</span>
                         <span className="font-bold text-red-700">- {formatCurrency(stats.totalExpenses)}</span>
                     </div>
                     <div className="border-t pt-4">
                         <p className="text-sm text-slate-500">Net Profit</p>
                         <p className={`text-3xl font-black ${stats.totalProfit >= 0 ? 'text-slate-800' : 'text-red-600'}`}>{formatCurrency(stats.totalProfit)}</p>
                     </div>
                </div>
            </div>
        </div>
      )}

       {/* Expense Modal */}
       {isExpenseModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95">
                 <div className="flex justify-between mb-4">
                     <h3 className="text-xl font-bold">Add Expense</h3>
                     <button onClick={() => setIsExpenseModalOpen(false)}><X className="text-slate-400"/></button>
                 </div>
                 <div className="space-y-4">
                     <input type="date" className="w-full border p-2.5 rounded-lg" value={expenseForm.date} onChange={e => setExpenseForm({...expenseForm, date: e.target.value})}/>
                     <input type="text" placeholder="Category (e.g. Rent, Salary)" className="w-full border p-2.5 rounded-lg" value={expenseForm.category || ''} onChange={e => setExpenseForm({...expenseForm, category: e.target.value})}/>
                     <input type="number" placeholder="Amount" className="w-full border p-2.5 rounded-lg" value={expenseForm.amount || ''} onChange={e => setExpenseForm({...expenseForm, amount: Number(e.target.value)})}/>
                     <textarea placeholder="Description" className="w-full border p-2.5 rounded-lg h-24 resize-none" value={expenseForm.description || ''} onChange={e => setExpenseForm({...expenseForm, description: e.target.value})}/>
                     <div className="flex justify-end gap-2 pt-2">
                         <Button variant="secondary" onClick={() => setIsExpenseModalOpen(false)}>Cancel</Button>
                         <Button onClick={handleSaveExpense}>Save Expense</Button>
                     </div>
                 </div>
             </div>
        </div>
       )}
       
       {/* Invoice Modal */}
       {isInvoiceModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl p-0 h-[90vh] flex flex-col animate-in zoom-in-95 duration-200 overflow-hidden">
             <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50">
                <h3 className="text-xl font-bold text-slate-800">New Invoice</h3>
                <button onClick={() => setIsInvoiceModalOpen(false)}><X className="text-slate-400"/></button>
            </div>
            <div className="flex-1 overflow-auto p-8 space-y-6">
                <div className="grid md:grid-cols-3 gap-4">
                     <select className="border p-2 rounded-lg" value={invoiceForm.clientId} onChange={e => setInvoiceForm({...invoiceForm, clientId: e.target.value})}>
                         <option value="">Select Client</option>
                         {data.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                     </select>
                     <input type="date" className="border p-2 rounded-lg" value={invoiceForm.date} onChange={e => setInvoiceForm({...invoiceForm, date: e.target.value})}/>
                     <input type="date" className="border p-2 rounded-lg" value={invoiceForm.dueDate} onChange={e => setInvoiceForm({...invoiceForm, dueDate: e.target.value})}/>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border">
                    <div className="grid grid-cols-12 gap-2 mb-2 items-end">
                        <div className="col-span-3">
                           <label className="text-xs text-slate-500 font-semibold ml-1">Product</label>
                           <input className="w-full border p-2 rounded" placeholder="Item Name" value={invoiceItem.description} onChange={e => setInvoiceItem({...invoiceItem, description: e.target.value})}/>
                        </div>
                        <div className="col-span-2">
                           <label className="text-xs text-slate-500 font-semibold ml-1">Quality</label>
                           <input className="w-full border p-2 rounded" placeholder="Grade/Qual" value={invoiceItem.quality || ''} onChange={e => setInvoiceItem({...invoiceItem, quality: e.target.value})}/>
                        </div>
                        <div className="col-span-2">
                           <label className="text-xs text-slate-500 font-semibold ml-1">Qty</label>
                           <input className="w-full border p-2 rounded" type="number" placeholder="0" value={invoiceItem.quantity} onChange={e => setInvoiceItem({...invoiceItem, quantity: Number(e.target.value)})}/>
                        </div>
                        <div className="col-span-2">
                           <label className="text-xs text-slate-500 font-semibold ml-1">Rate</label>
                           <input className="w-full border p-2 rounded" type="number" placeholder="0.00" value={invoiceItem.rate} onChange={e => setInvoiceItem({...invoiceItem, rate: Number(e.target.value)})}/>
                        </div>
                        <div className="col-span-2">
                           <label className="text-xs text-slate-500 font-semibold ml-1">Disc %</label>
                           <input className="w-full border p-2 rounded" type="number" placeholder="0" value={invoiceItem.discount || ''} onChange={e => setInvoiceItem({...invoiceItem, discount: Number(e.target.value)})}/>
                        </div>
                        <div className="col-span-1">
                           <button onClick={() => { if(invoiceItem.description) { const qty = invoiceItem.quantity || 1; const rate = invoiceItem.rate || 0; const disc = invoiceItem.discount || 0; const total = qty * rate * (1 - disc/100); setInvoiceForm(p => ({...p, items: [...(p.items||[]), {...invoiceItem, id: generateId(), quantity: qty, rate: rate, discount: disc, total: total} as InvoiceItem]})); setInvoiceItem({description:'', quantity:1, rate:0, discount: 0, quality: ''}); }}} className="w-full h-10 bg-brand-600 text-white rounded flex items-center justify-center hover:bg-brand-700 transition"><Plus/></button>
                        </div>
                    </div>
                    {invoiceForm.items?.map(item => (
                        <div key={item.id} className="flex justify-between border-b py-2 text-sm items-center">
                            <div className="flex-1">
                                <p className="font-semibold text-slate-800">{item.description}</p>
                                <p className="text-xs text-slate-500">Qual: {item.quality || 'Standard'} | Qty: {item.quantity} | Rate: {item.rate}</p>
                            </div>
                            <div className="flex items-center gap-4">
                                {item.discount ? <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">-{item.discount}%</span> : null}
                                <span className="font-bold">{formatCurrency(item.total)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="p-6 border-t bg-slate-50 flex justify-end gap-3">
                 <Button onClick={handleSaveInvoice}>Generate Invoice</Button>
            </div>
           </div>
        </div>
       )}

      {/* Barcode/Offer Modals (Kept same logic, updated style) */}
      {(activeTool === 'Barcode' || activeTool === 'Offers') && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-sm text-center relative">
                 <button onClick={() => setActiveTool(null)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                 {activeTool === 'Barcode' ? <Barcode size={48} className="mx-auto text-slate-800 mb-4" /> : <Percent size={48} className="mx-auto text-brand-600 mb-4" />}
                 <h3 className="text-xl font-bold text-slate-800 mb-4">{activeTool === 'Barcode' ? 'Barcode Generator' : 'Offer Card'}</h3>
                 {activeTool === 'Barcode' ? (
                     <input className="w-full border p-2 rounded mb-4 text-center" value={barcodeText} onChange={e => setBarcodeText(e.target.value)}/>
                 ) : (
                     <div className="space-y-2 mb-4"><input className="w-full border p-2 rounded" value={offerText.title} onChange={e => setOfferText({...offerText, title: e.target.value})}/><input className="w-full border p-2 rounded" value={offerText.discount} onChange={e => setOfferText({...offerText, discount: e.target.value})}/></div>
                 )}
                 <div className="bg-slate-100 p-4 rounded mb-4 flex justify-center min-h-[100px] items-center">
                    {activeTool === 'Barcode' ? (
                         <div className="flex h-12 items-end gap-1">{barcodeText.split('').map((_, i) => <div key={i} className="bg-black w-1" style={{height: Math.random()*30+20+'px'}}></div>)}</div>
                    ) : (
                         <div className="bg-gradient-to-r from-brand-500 to-purple-600 text-white p-4 rounded-lg w-full">
                             <p className="font-bold text-xl">{offerText.title}</p>
                             <p className="text-2xl font-black text-yellow-300">{offerText.discount}</p>
                         </div>
                    )}
                 </div>
                 <Button onClick={() => window.print()} className="w-full"><Printer size={16}/> Print</Button>
             </div>
        </div>
      )}

    </div>
  );
}