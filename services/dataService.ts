import { Client, Invoice, Expense, AppState, CompanySettings } from '../types';

const STORAGE_KEY = 'acrozela_data_v4'; // Incremented version for new schema

const defaultSettings: CompanySettings = {
  name: 'ACROZELA ENTERPRISES',
  address: '123 Business Park, Tech Hub, Mumbai, MH - 400001',
  phone: '+91 98765 43210',
  email: 'billing@acrozela.com',
  gstin: '27ABCDE1234F1Z5',
  website: 'www.acrozela.com',
  notes: 'Thank you for your business!',
  bankDetails: 'Bank: HDFC Bank\nA/C: 50200012345678\nIFSC: HDFC0001234',
  upiId: 'acrozela@hdfcbank'
};

const getInitialState = (): AppState => ({
  clients: [],
  products: [],
  invoices: [],
  expenses: [],
  settings: defaultSettings,
  isGoogleConnected: false
});

export const loadData = (): AppState => {
  try {
    const serialized = localStorage.getItem(STORAGE_KEY);
    if (!serialized) return getInitialState();
    const data = JSON.parse(serialized);
    // Merge with default settings if missing
    if (!data.settings) data.settings = defaultSettings;
    if (data.isGoogleConnected === undefined) data.isGoogleConnected = false;
    if (!data.expenses) data.expenses = [];
    if (!data.products) data.products = [];
    return data;
  } catch (e) {
    console.error("Failed to load data", e);
    return getInitialState();
  }
};

export const saveData = (data: AppState) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    console.error("Failed to save data", e);
  }
};

// Helper IDs
export const generateId = () => Math.random().toString(36).substr(2, 9).toUpperCase();