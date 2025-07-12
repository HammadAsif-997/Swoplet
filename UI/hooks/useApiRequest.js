import { useState, useCallback } from "react";
import { callApi } from "../utils/apiHandler";

export function useApiRequest(
  initialUrl = null,
  initialMethod = "GET",
  initialBody = null
) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const makeRequest = useCallback(
    async (override = {}) => {
      setLoading(true);
      setError(null);

      const {
        url = initialUrl,
        method = initialMethod,
        body = initialBody,
        headers = {},
      } = override;

      const {
        success,
        data,
        error: apiError,
      } = await callApi({ url, method, body, headers });

      if (success) {
        setData(data);
      } else {
        setError(apiError);
        setData(null);
      }

      setLoading(false);
      return { success, data, error: apiError };
    },
    [initialUrl, initialMethod, initialBody]
  );

  return { data, loading, error, makeRequest };
}
