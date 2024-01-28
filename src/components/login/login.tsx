import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [counter, setCounter] = useState(5);
  const navigate = useNavigate();


  const uuidv4 = () => {
    const cryptoArray = crypto.getRandomValues(new Uint8Array(1));
    const c = cryptoArray[0] as number;
    const result = ((c ^ (c & 15)) >> (c / 4)).toString(16);
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, result);
  }

  useEffect(() => {
    const handleLogin = () => {
      const gitlabBaseUrl = process.env.REACT_APP_GITLAB_BASE_URL;
      const clientId = process.env.REACT_APP_CLIENT_ID;
      const redirectUri = encodeURIComponent(process.env.REACT_APP_CALLBACK_URL);
      const responseType = 'code';
      const scope = encodeURIComponent('openid profile api read_api');
  
      window.location.href = `${gitlabBaseUrl}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${uuidv4()}`;
    };  

    const token = localStorage.getItem('token');
    let redirectUrl = localStorage.getItem('redirectUrl') || '/search';
    if (redirectUrl === '/login' || redirectUrl === '/') {
      redirectUrl = '/search';
    }
    if (token) {
      navigate(redirectUrl);
    } else if(counter > 0) {
      const timer = setTimeout(() => setCounter(counter - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      handleLogin();
    }
  }, [counter, navigate]);

  return (
    <h1>
      You will be redirected to login in {counter} seconds.
    </h1>
  );
};

export default Login;