import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import apiService from "../../services/apiservices";
import { ToastContext } from "../../toast-provider";
import { LocalStorageConstants } from "../../local-storage-constants";

const Login = () => {
  const navigate = useNavigate();
  const { openToast } = useContext(ToastContext);

  const uuidv4 = () => {
    const cryptoArray = crypto.getRandomValues(new Uint8Array(1));
    const c = cryptoArray[0] as number;
    const result = ((c ^ (c & 15)) >> (c / 4)).toString(16);
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, result);
  };

  useEffect(() => {
    const token = LocalStorageConstants.getString(LocalStorageConstants.Token);
    if (token) {
      verifyToken();
    } else {
      handleLoginClick();
    }
  }, [navigate]);

  const verifyToken = async () => {
    const token = LocalStorageConstants.getString(LocalStorageConstants.Token);
    try {
      const response = await apiService.get(`/token/info?token=${token}`);
      if (response.status === 200) {
        navigateToRedirectUrl();
      } else {        
        openToast('Token invalid or expired', 'error');
      }
    } catch (error) {
      LocalStorageConstants.removeItem(LocalStorageConstants.Token);
      openToast("Token verification failed:", 'error', error);
    }
  };

  const navigateToRedirectUrl = () => {
    let redirectUrl = LocalStorageConstants.getString(LocalStorageConstants.RedirectUrl);
    if (redirectUrl === "/login" || redirectUrl === "/") {
      redirectUrl = "/";
    }
    navigate(redirectUrl);
  };

  const handleLoginClick = () => {
    // previousUrl = window.location.pathname;
    const gitlabBaseUrl = process.env.REACT_APP_GITLAB_BASE_URL;
    const clientId = process.env.REACT_APP_CLIENT_ID;
    const redirectUri = encodeURIComponent(process.env.REACT_APP_CALLBACK_URL);
    const responseType = "code";
    const scope = encodeURIComponent("openid profile api read_api");

    window.location.href = `${gitlabBaseUrl}/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=${responseType}&scope=${scope}&state=${uuidv4()}`;
  };

  return null;
};

export default Login;
