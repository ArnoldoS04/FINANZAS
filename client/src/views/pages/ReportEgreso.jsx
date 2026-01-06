import { useState, useEffect } from "react";
import TableFilter from "../../components/TableFilter";
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CModalFooter,
  CCard,
} from "@coreui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandHoldingDollar } from "@fortawesome/free-solid-svg-icons";
import { formatCurrency } from "../../components/formatCurrency";
import authFetch from "../../components/AuthFecth";
import ToastContainer from "../../components/ToastConainer";

const ReportEgreso = () => {
  const [egresos, setEgresos] = useState([]);
  const [toasts, setToasts] = useState([]);
  const dateNow = new Date();

  // Función para mostrar Toasts
  const showToast = (message, color = "danger") => {
    const id = Date.now(); // ID único
    setToasts((prev) => [...prev, { id, message, color }]);
  };

  const getEgresos = async () => {
    try {
      const res = await authFetch("/out/getOut");
      setEgresos(res.data);
    } catch (error) {
      console.log("Error fetching egresos:", error);
    }
  };

  useEffect(() => {
    getEgresos();
  }, []);

  const columnas = [
    {
      name: "Descripción",
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: "Fecha Pago",
      selector: (row) => new Date(row.date_out),
      sortable: true,
      format: (row) => new Date(row.date_out).toLocaleDateString("es-GT"),
    },
    {
      name: "Total",
      selector: (row) => formatCurrency(row.amount),
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) =>
        row.auto ? (
          <CButton
            size="sm"
            className={`border-0 ${
              new Date(row.date_out).getMonth() + 1 === dateNow.getMonth() + 1
                ? "disabled"
                : ""
            }`}
            onClick={() => handlePagoAuto(row.id_out)}
          >
            <FontAwesomeIcon
              icon={faHandHoldingDollar}
              color="green"
              size="2xl"
            />
          </CButton>
        ) : null,
      ignoreRowClick: true, // SOLO para DataTable
      allowOverflow: true, // SOLO para DataTable
      button: true, // SOLO para DataTable
    },
  ];

  const handlePagoAuto = async (id) => {
    try {
      await authFetch.post(`/out/addAutoEgresos/${id}`);
      showToast("Pago automático registrado exitosamente", "success");
      getEgresos(); // Actualiza la lista de egresos
    } catch (error) {
      console.log("Error al registrar pago automático:", error);
      showToast("Error al registrar pago automático", "danger");
    }
  };

  return (
    <CCard className="p-4 bg-transparent rounded-3">
      {/* <div className="d-inline-flex justify-content-end gap-2 bg-danger rounded p-2">
        <a href="">Agregar</a>
        <a href="">Agregar</a>
        <a href="">Agregar</a>
      </div> */}

      <TableFilter
        columnas={columnas}
        data={egresos}
        filterFields={["description", "date_out", "amount"]}
      />
      <ToastContainer toasts={toasts} setToasts={setToasts} />
    </CCard>
  );
};

export default ReportEgreso;
