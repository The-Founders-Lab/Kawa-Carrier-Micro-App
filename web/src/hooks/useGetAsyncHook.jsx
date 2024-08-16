import { useState, useEffect } from "react";

export default function useGetAsyncHook(url) {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [reload, setReload] = useState(0);

  useEffect(() => {
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        setData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error in useGetAsyncHook", error);
        setError(error);
        setIsLoading(false);
      });
  }, [reload]);

  return { data, isLoading, error, setReload };
}
