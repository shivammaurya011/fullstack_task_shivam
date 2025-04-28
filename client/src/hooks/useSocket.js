import { useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';

const socket = io(import.meta.env.VITE_SOCKET_URL, {
  reconnection: true,
  cors: { origin: import.meta.env.VITE_CORS_ORIGIN },
});

function useSocket(setTasks, setIsLoading, setError) {
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/fetchAllTasks`);
        setTasks(response.data);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();

    socket.on('update', (tasks) => {
      setTasks(tasks);
      setError(null);
    });

    socket.on('error', (message) => {
      console.error('Socket error:', message);
      setError(message);
    });

    return () => {
      socket.off('update');
      socket.off('error');
    };
  }, [setTasks, setIsLoading, setError]);

  return socket;
}

export default useSocket;