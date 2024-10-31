import { Client } from "./baseApiClient";
import { LocalStorageConstants } from "../local-storage-constants";

class CustomApiClient extends Client {
  constructor(baseUrl?: string) {
    super(baseUrl, { fetch: CustomApiClient.fetchWithAuth });
  }

  private static async fetchWithAuth(
    url: RequestInfo,
    init?: RequestInit
  ): Promise<Response> {
    const token = LocalStorageConstants.getString(LocalStorageConstants.Token);

    if (!token) {
      LocalStorageConstants.setItem(
        LocalStorageConstants.RedirectUrl,
        window.location.pathname
      );
      window.location.href = "/login";
    }

    init = init || {};
    init.headers = {
      ...(init.headers || {}),
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, init);

      // Check if the response status is 401 (Unauthorized)
      // TODO: Manager status 406 (Not Acceptable) as well in the Api
      if (response.status === 401 || response.status === 406) {
        // Clear the token and redirect to login
        LocalStorageConstants.removeItem(LocalStorageConstants.Token);
        window.location.href = "/login";
        // Optionally return a rejected Promise so the caller knows the redirection happened
        return Promise.reject(
          new Error("Unauthorized access. Redirecting to login.")
        );
      }

      // If the status is not 401, return the response as usual
      return response;
    } catch (error) {
      // Handle fetch errors if needed
      console.error("Fetch error:", error);
      throw error;
    }
  }
}

const GitlabApiClient = new CustomApiClient(
  process.env.REACT_APP_GITLAB_BACKEND_URL || ""
);
export default GitlabApiClient;
