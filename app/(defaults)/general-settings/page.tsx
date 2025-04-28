import ComponentAdvanceSettings from '@/components/settings/component-advance-settings';
import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
    title: 'Rental car management',
};

const GeneralSettings = () => {
    return <ComponentAdvanceSettings />;
};

export default GeneralSettings;
