import { createContext, useContext, useState, useCallback } from 'react';
import LoadingScreen from '../components/LoadingScreen';

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProps, setLoadingProps] = useState({
    onCancel: null,
  });

  const showLoading = useCallback((options = {}) => {
    setLoadingProps({
      onCancel: options.onCancel || null,
    });
    setIsLoading(true);
  }, []);

  const hideLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingProps({ onCancel: null });
  }, []);

  const withLoading = useCallback(async (asyncFn, options = {}) => {
    showLoading(options);
    try {
      const result = await asyncFn();
      return result;
    } finally {
      hideLoading();
    }
  }, [showLoading, hideLoading]);

  return (
    <LoadingContext.Provider value={{ showLoading, hideLoading, withLoading, isLoading }}>
      {children}

      {isLoading && (
        <div className="fixed inset-0 z-9999">
          <LoadingScreen
            onCancel={loadingProps.onCancel ? () => {
              loadingProps.onCancel();
              hideLoading();
            } : null}
          />
        </div>
      )}
    </LoadingContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
}