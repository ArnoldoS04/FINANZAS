import React, { useState, useEffect } from "react";
import {
  CCol,
  CButton,
  CForm,
  CFormInput,
  CFormLabel,
  CFormSwitch,
  CFormTextarea,
  CCard,
  CCardHeader,
  CCardBody,
  CRow,
} from "@coreui/react";
import { CustomSelect } from "../../components/CustomSelect";
import authFetch from "../../components/AuthFecth";
import ToastContainer from "../../components/ToastConainer";

const Egreso = () => {
  const [comentarios, setComentarios] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [categoriaOptions, setCategoriaOptions] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [validated, setValidated] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [esRecurrente, setEsRecurrente] = useState(false);

  const showToast = (message, color = "danger") => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, color }]);
  };

  const dataSelect = async () => {
    try {
      const catCat = 3; // diferente de ingresos, si corresponde
      const resCategoria = await authFetch(`/in/categorias/${catCat}`);

      setCategoriaOptions(
        resCategoria.data.map((item) => ({
          label: item.name,
          value: item.id_subc,
        }))
      );
    } catch (error) {
      console.error("Error al llenar selects", error);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.checkValidity()) {
      event.stopPropagation();
      setValidated(true);
      return;
    }
    setValidated(true);

    try {
      const egresoData = {
        id_subc: Number(categoriaSeleccionada),
        description: comentarios,
        date_out: new Date(fechaPago),
        amount: parseFloat(monto),
        auto: esRecurrente ? true : false,
      };

      await authFetch.post("/out/saveOut", egresoData);
      showToast("Egreso guardado exitosamente", "success");

      // reset
      setCategoriaSeleccionada("");
      setComentarios("");
      setFechaPago("");
      setMonto("");
      setValidated(false);
    } catch (error) {
      console.error("Error al guardar egreso", error);
      showToast("Error al guardar egreso", "danger");
    }
  };

  useEffect(() => {
    dataSelect();
  }, []);

  return (
    <>
      <div className="d-flex justify-content-center w-100">
        <CCard className="mb-4" style={{ maxWidth: "800px", width: "100%" }}>
          <CCardHeader>
            <strong>Nuevo Egreso</strong>
          </CCardHeader>
          <CCardBody>
            <CForm
              className="row g-3 needs-validation"
              noValidate
              validated={validated}
              onSubmit={handleSubmit}
            >
              {/* Selección de categoría */}
              <CCol xs={12} md={6}>
                <CustomSelect
                  name="categoria"
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                  options={categoriaOptions}
                  required
                />
              </CCol>

              <hr className="my-4 w-100" />

              <CRow className="w-100">
                {/* Comentarios */}
                <CCol xs={12} md={6}>
                  <CFormTextarea
                    id="comentarios"
                    value={comentarios}
                    onChange={(e) => setComentarios(e.target.value)}
                    placeholder="Escriba sus comentarios aquí..."
                    rows={4}
                    style={{ resize: "none", overflow: "hidden" }}
                    required
                  />
                </CCol>

                {/* Fecha y Monto */}
                <CCol xs={12} md={6}>
                  <CRow className="g-2">
                    <CCol xs={6}>
                      <CFormLabel>Fecha de pago:</CFormLabel>
                    </CCol>
                    <CCol xs={6}>
                      <CFormInput
                        type="date"
                        id="fechaPago"
                        name="fechaPago"
                        required
                        onKeyDown={(e) => e.preventDefault()}
                        value={fechaPago}
                        onChange={(e) => setFechaPago(e.target.value)}
                      />
                    </CCol>

                    <CCol xs={12} className="mt-2">
                      <CFormInput
                        type="number"
                        min={1}
                        step={0.1}
                        id="validationCustom05"
                        placeholder="Monto"
                        value={monto}
                        onChange={(e) => setMonto(e.target.value)}
                        required
                      />
                    </CCol>
                    <CFormSwitch
                      label="Guardar este egreso como recurrente"
                      id="formSwitchCheckDefault"
                      checked={esRecurrente}
                      onChange={() => setEsRecurrente(!esRecurrente)}
                    />
                  </CRow>
                </CCol>
              </CRow>

              <hr className="w-100" />

              {/* Botón enviar */}
              <CCol
                xs={12}
                className="d-flex d-md-block justify-content-center justify-content-md-start"
              >
                <CButton color="primary" type="submit">
                  Registrar Egreso
                </CButton>
              </CCol>
            </CForm>
          </CCardBody>
        </CCard>
      </div>
      <ToastContainer toasts={toasts} setToasts={setToasts} />
    </>
  );
};

export default Egreso;
