import ComponentsUsersAccountSettingsTabs from '@/components/users/account-settings/components-users-account-settings-tabs';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Account Setting',
};

const UserAccountSettings = () => {
    return (
        <div>
            <ComponentsUsersAccountSettingsTabs />
        </div>
    );
};

export default UserAccountSettings;
