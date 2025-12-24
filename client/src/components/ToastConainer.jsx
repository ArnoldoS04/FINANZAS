import React from "react";
import { CToaster, CToast, CToastBody, CToastClose } from "@coreui/react";

const ToastContainer = ({ toasts, setToasts }) => {
  return (
    <CToaster placement="top-end" style={{ zIndex: 9999 }}>
      {toasts.map((toast) => (
        <CToast
          key={toast.id}
          autohide
          visible
          delay={4000}
          color={toast.color}
          className="text-white align-items-center"
          onClose={() =>
            setToasts((prev) => prev.filter((t) => t.id !== toast.id))
          }
        >
          <div className="d-flex">
            <CToastBody>{toast.message}</CToastBody>
            <CToastClose className="me-2 m-auto" />
          </div>
        </CToast>
      ))}
    </CToaster>
  );
};

export default ToastContainer;
