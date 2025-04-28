import ComponentsAppsInvoiceList from '@/components/apps/mailbox/invoice/components-apps-invoice-list';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Rental car management',
};

const InvoiceList = () => {
  return <ComponentsAppsInvoiceList />;
};

export default InvoiceList;
