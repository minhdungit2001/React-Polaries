import axiosInstance from "../service/axiosInstance";
import { useState, useEffect } from "react";

export default function useFetchApi({
  url = "",
  defaultData = [],
  presentDataFunc = null,
  initLoad = true,
  method = "GET",
  postData = {},
}) {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(defaultData);
  const [pagination, setPagination] = useState({});
  const [errors, setErrors] = useState([]);
  const [fetched, setFetched] = useState(false);

  async function fetchApi() {
    if (url === "") {
      return;
    }

    try {
      setLoading(true);
      const resp = await axiosInstance({
        url: url,
        data: postData,
        method: method,
      });

      if (resp.data) {
        const newData = presentDataFunc
          ? presentDataFunc(resp.data)
          : resp.data;
        setData(newData);
      }
      if (resp.pagination) {
        setPagination(resp.pagination);
      }
      if (resp.errors) {
        setErrors([...errors, resp.errors]);
      }
    } catch (error) {
      setErrors([...errors, error.message]);
      console.log(error);
    } finally {
      setLoading(false);
      setFetched(true);
    }
  }

  async function api({
    url = "",
    method = "GET",
    postData = {},
    presentDataFunc = null,
  }) {
    if (url === "") {
      return;
    }
    try {
      const resp = await axiosInstance({
        url: url,
        data: postData,
        method: method,
      });

      if (presentDataFunc) {
        return presentDataFunc(resp.data);
      }
      return resp.data;
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (initLoad) {
      fetchApi();
    }
  }, []);

  return {
    data,
    setData,
    loading,
    setLoading,
    pagination,
    setPagination,
    fetched,
    setFetched,
    refetch: fetchApi,
    errors,
    setErrors,
    api,
  };
}
