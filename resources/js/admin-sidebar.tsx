import React from 'react';
import { createRoot } from 'react-dom/client';
import AdminSidebar from './src/components/AdminSidebar';

// Mount the custom sidebar into the Filament sidebar slot
const el = document.getElementById('admin-custom-sidebar');
if (el) {
    createRoot(el).render(<AdminSidebar />);
}
