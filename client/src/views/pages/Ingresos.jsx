import React, { useState, useEffect } from "react";
import {
  CCol,
  CButton,
  CForm,
  CFormSwitch,
  CFormFeedback,
  CFormInput,
  CFormLabel,
  CInputGroup,
  CInputGroupText,
  CFormSelect,
  CCard,
  CCardHeader,
  CCardBody,
  CFormTextarea,
  CRow,
} from "@coreui/react";
import { CustomSelect } from "../../components/CustomSelect";
import authFetch from "../../components/AuthFecth";
import ToastContainer from "../../components/ToastConainer";

const Ingresos = () => {
  // Inputs
  const [comentarios, setComentarios] = useState("");
  const [monto, setMonto] = useState("");
  const [fechaPago, setFechaPago] = useState("");
  const [categoriaOptions, setCategoriaOptions] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [validated, setValidated] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [esRecurrente, setEsRecurrente] = useState(false);

  // Función para mostrar Toasts
  const showToast = (message, color = "danger") => {
    const id = Date.now(); // ID único
    setToasts((prev) => [...prev, { id, message, color }]);
  };

  // Obtiene y llena select's
  const dataSelect = async () => {
    try {
      const catCat = 2; // Categoría 'Ingresos' en la tabla CATEGORI

      const resCategoria = await authFetch(`/in/categorias/${catCat}`);

      // Adaptamos el formato para el CustomSelect (label y value)

      const categoriaAdaptada = resCategoria.data.map((item) => ({
        label: item.name,
        value: item.id_subc,
      }));

      setCategoriaOptions(categoriaAdaptada);
    } catch (error) {
      console.error("Error al llenar selects", error);
    }
  };

  // Validacion de formulario
  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return; // Si no es válido, no sigue
    }
    setValidated(true);

    try {
      const ingresoData = {
        id_subc: Number(categoriaSeleccionada),
        description: comentarios,
        date_in: new Date(fechaPago),
        amount: parseFloat(monto),
        auto: esRecurrente ? true : false,
      };
      await authFetch.post("/in/saveIn", ingresoData);
      showToast("Ingreso guardado exitosamente", "success");
      // Después del POST exitoso:
      setCategoriaSeleccionada("");
      setComentarios("");
      setFechaPago("");
      setMonto("");
      setValidated(false);
    } catch (error) {
      console.log("Error al guardar ingreso", error);
      showToast("Error al guardar ingreso", "danger");
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
            <strong>Nuevo Ingreso</strong>
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
                      label="Guardar este ingreso como recurrente"
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
                  Registrar Ingreso
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
export default Ingresos;
