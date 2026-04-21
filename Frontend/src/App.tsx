import { useEffect } from 'react';
import { useAxios } from './api/useAxios';

function App() {
  const axios = useAxios();

  useEffect(() => {
    const testHealth = async () => {
      try {
        const response = await axios.get('/health');
        console.log('Health check:', response.data);
      } catch (error) {
        console.error('Health check failed:', error);
      }
    };

    testHealth();
  }, [axios]);

  return <div>App works</div>;
}

export default App;