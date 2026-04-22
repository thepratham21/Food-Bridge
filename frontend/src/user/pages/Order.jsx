import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Order = () => {
  const navigate = useNavigate();
  useEffect(() => {
    navigate("/user/donate", { replace: true });
  }, []);
  return null;
};

export default Order;
