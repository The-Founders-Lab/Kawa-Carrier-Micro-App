const SERVER_URL = import.meta.env.VITE_SERVER_URL;

export async function assignRider({ orderId, riderId, environment }) {
  const resp = await fetch(
    `${SERVER_URL}/orders/assign-rider?environment=${environment}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        riderId,
      }),
    },
  );

  const data = await resp.json();

  if (!data.response || data.response?.statusCode !== 200) {
    throw new Error(data?.message || data?.response?.message);
  }

  return data;
}

export async function updateOrderStatus({
  orderId,
  status = "",
  otherUpdateData,
  environment,
}) {
  const resp = await fetch(
    `${SERVER_URL}/orders/update-status?environment=${environment}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        orderId,
        orderStatus: status,
        ...otherUpdateData,
      }),
    },
  );

  const data = await resp.json();

  if (data?.statusCode !== 200 && data?.data?.statusCode !== 200) {
    throw new Error(data?.message);
  }

  return data;
}
