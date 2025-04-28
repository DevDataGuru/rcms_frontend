'use client';
import App from '@/App';
import store from '@/store';
import { Provider } from 'react-redux';
import { ReactNode, Suspense } from 'react';
import Loading from '@/components/layouts/loading';
import { MantineProvider } from '@mantine/core';

interface IProps {
    children?: ReactNode;
}

const ProviderComponent = ({ children }: IProps) => {
    return (
        <Provider store={store}>
            <MantineProvider>
                <Suspense fallback={<Loading />}>
                    <App>{children} </App>
                </Suspense>
            </MantineProvider>
        </Provider>
    );
};

export default ProviderComponent;
// todo
// export default appWithI18Next(ProviderComponent, ni18nConfig);
