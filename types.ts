export enum ClientType {
  WHOLESALE = 'Wholesale',
  RETAILER = 'Retailer',
  DISTRIBUTOR = 'Distributor',
  BUSINESS_PARTNER = 'Business Partner',
  BUYER = 'Buyer',
  SELLER = 'Seller',
  SUPPLIER = 'Supplier',
  NEARBY_BUYER = 'Nearby Buyer'
}

export interface Client {
  id: string;
  name: string;
  type: ClientType;
  email: string;
  phone: string;
  address: string;
  locationPin?: string; // New: Shop Location Pin
  photo?: string;       // New: Base64 Photo string
  gstin?: string; 
  balance: number;
}

export interface Product {
  id: string;
  name: string;
  quality: string;      // New: Quality
  quantity: number;     // New: Stock Quantity
  rate: number;
}

export interface InvoiceItem {
  id: string;
  description: string;
  quality?: string;     // New: Item Quality
  quantity: number;
  rate: number;
  discount?: number;
  total: number;
}

export interface Invoice {
  id: string;
  clientId: string;
  clientName: string; 
  clientAddress?: string;
  clientGstin?: string;
  date: string;
  dueDate: string;
  items: InvoiceItem[];
  subtotal: number;
  gstRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  paymentMethod?: 'Cash' | 'Bank' | 'UPI';
  notes?: string;
  terms?: string;
}

export interface Expense {
  id: string;
  category: string;
  amount: number;
  date: string;
  description: string;
  paymentMethod: 'Cash' | 'Bank' | 'UPI';
}

export interface CompanySettings {
  name: string;
  address: string;
  phone: string;
  email: string;
  gstin: string;
  website: string;
  notes: string;
  bankDetails?: string;
  upiId?: string;
}

export interface AppState {
  clients: Client[];
  products: Product[]; // New: Inventory
  invoices: Invoice[];
  expenses: Expense[];
  settings: CompanySettings;
  isGoogleConnected: boolean;
}

export enum ViewState {
  DASHBOARD = 'DASHBOARD',
  CLIENTS = 'CLIENTS',
  INVENTORY = 'INVENTORY', // New View
  INVOICES = 'INVOICES',
  EXPENSES = 'EXPENSES',
  GOOGLE_TOOLS = 'GOOGLE_TOOLS',
  REPORTS = 'REPORTS',
  SETTINGS = 'SETTINGS'
}