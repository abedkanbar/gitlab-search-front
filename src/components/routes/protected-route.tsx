import { CircularProgress } from '@material-ui/core';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    } else {
      setIsLoading(false);
    }
  }, [navigate]);

  if (isLoading) {
    return <CircularProgress />;
  }

  return children;
};

export default ProtectedRoute;