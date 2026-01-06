import React, { useState } from "react";
import DataTable from "react-data-table-component";

const TableFilter = ({ columnas, data, filterFields = [] }) => {
  const [filtro, setFiltro] = useState("");

  const datosFiltrados = data.filter((item) =>
    filterFields.some((field) =>
      item[field]?.toString().toLowerCase().includes(filtro.toLowerCase())
    )
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar..."
        className="form-control mb-3 w-25"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
      />
      <DataTable
        columns={columnas}
        data={datosFiltrados}
        pagination
        responsive
        highlightOnHover
        striped
      />
    </div>
  );
};

export default TableFilter;