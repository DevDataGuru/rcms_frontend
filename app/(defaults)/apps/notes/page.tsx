import ComponentsAppsNotes from '@/components/apps/notes/components-apps-notes';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Notes',
};

const Notes = () => {
    return <ComponentsAppsNotes />;
};

export default Notes;
