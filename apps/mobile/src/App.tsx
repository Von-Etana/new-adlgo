import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import RootNavigator from './navigation/RootNavigator';

import ErrorBoundary from './components/common/ErrorBoundary';
import { ToastProvider } from './context/ToastContext';

const App = () => {
    return (
        <SafeAreaProvider>
            <ErrorBoundary>
                <ToastProvider>
                    <RootNavigator />
                </ToastProvider>
            </ErrorBoundary>
        </SafeAreaProvider>
    );
};

export default App;
