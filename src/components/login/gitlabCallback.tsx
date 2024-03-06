import React, { useEffect } from 'react';
import axios from 'axios';
import { LocalStorageConstants } from '../../local-storage-constants';

const GitlabCallback = () => {
  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    if (code) {
      getAccessToken(code);
    }
  }, []);

  const getAccessToken = async (code) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_GITLAB_BASE_URL}/oauth/token`, {
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_CLIENT_SECRET,
        code,
        grant_type: 'authorization_code',
        redirect_uri: process.env.REACT_APP_CALLBACK_URL
      });

      const accessToken = response.data.access_token;      
      LocalStorageConstants.setItem(LocalStorageConstants.Token, accessToken);
      window.location.href = LocalStorageConstants.getString(LocalStorageConstants.RedirectUrl) || '/home';
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
  };

  return (
    <div>
      Traitement de la connexion...
    </div>
  );
};

export default GitlabCallback;
