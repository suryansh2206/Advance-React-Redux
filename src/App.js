import { useDispatch, useSelector } from "react-redux";
import Cart from "./components/Cart/Cart";
import Layout from "./components/Layout/Layout";
import Products from "./components/Shop/Products";
import { Fragment, useEffect } from "react";
import { uiActions } from "./store/ui-slice";
import Notification from "./components/UI/Notification";

let isInitial = true;
function App() {
  const showCart = useSelector((state) => state.ui.cartIsVisible);
  const cart = useSelector((state) => state.cart);
  const dispatch = useDispatch();
  const notification = useSelector((state) => state.ui.notification);

  useEffect(() => {
    const sendCartData = async () => {
      dispatch(
        uiActions.setNotification({
          status: "pending",
          message: "Sending cart data...",
          title: "Sending",
        })
      );
      const response = await fetch(
        "https://react-http-a080a-default-rtdb.firebaseio.com/cart.json",
        {
          method: "PUT",
          body: JSON.stringify(cart),
        }
      );
      if (!response.ok) {
        throw new Error("Sending cart data failed");
      }

      dispatch(
        uiActions.setNotification({
          status: "success",
          message: "Success",
          title: "Send cart data successfully",
        })
      );
    };

    if (isInitial) {
      isInitial = false;
      return;
    }

    sendCartData().catch((error) => {
      dispatch(
        uiActions.setNotification({
          status: "error",
          message: "Error.",
          title: "Sending cart data failed",
        })
      );
    });
  }, [cart, dispatch]);

  return (
    <Fragment>
      {notification && (
        <Notification
          status={notification.status}
          title={notification.title}
          message={notification.message}
        />
      )}
      <Layout>
        {showCart && <Cart />}
        <Products />
      </Layout>
    </Fragment>
  );
}

export default App;
