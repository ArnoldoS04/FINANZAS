import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV } from "@fortawesome/free-solid-svg-icons";
import { CChartBar, CChartLine } from "@coreui/react-chartjs";

import Chart from "chart.js/auto";

import {
  CCard,
  CCardHeader,
  CCardBody,
  CProgress,
  CCardFooter,
  CCol,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CRow,
  CWidgetStatsA,
} from "@coreui/react";
import authFetch from "../../components/AuthFecth";
import ChartBar from "../../components/ChartBar";
import ChartLine from "../../components/ChartLine";
import { MONTHS } from "../../components/utils";

export const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    ingresosMesActual: 0,
    ingresosAnioActual: 0,
    egresosMesActual: 0,
    egresosAnioActual: 0,
    ingresosPorMes: [],
    egresosPorMes: [],
    ingresoPorCategoria: [],
    egresoPorCategoria: [],
  });
  // Función para obtener datos del dashboard
  const dashData = async () => {
    try {
      // Datos generales
      const responseDashboard = await authFetch("dash/dashboard");
      const dataDashboard = responseDashboard.data;

      // Ingresos por mes
      const responseIncomes = await authFetch("dash/incomes/month");
      const incomesByMonth = responseIncomes.data;

      // Egresos por mes
      const responseExpenses = await authFetch("dash/expenses/month");
      const expensesByMonth = responseExpenses.data;

      // Ingresos por categoría (porcentaje, totales, etc.)
      const responseCategories = await authFetch("dash/incomes/category");
      const categoriesByIncome = responseCategories.data;

      // Egresos por categoría
      const responseCategoriesExpense = await authFetch(
        "dash/expenses/category"
      );
      const categoriesByExpense = responseCategoriesExpense.data;

      setDashboardData({
        ...dataDashboard,
        ingresosPorMes: incomesByMonth,
        egresosPorMes: expensesByMonth,
        ingresoPorCategoria: categoriesByIncome,
        egresoPorCategoria: categoriesByExpense,
      });
    } catch (error) {
      console.log("Error al obtener datos del dashboard", error);
    }
  };
  useEffect(() => {
    dashData();
  }, []);
  // Formateo de moneda
  const formatQ = (val) =>
    new Intl.NumberFormat("es-GT", {
      style: "currency",
      currency: "GTQ",
      minimumFractionDigits: 2,
    }).format(val);

  const dataChartGeneral = {
    labels: dashboardData.ingresosPorMes.map((d) => MONTHS[d.Mes - 1]),
    datasets: [
      {
        label: "Ingresos",
        data: dashboardData.ingresosPorMes.map((d) => d.total_ingresos),
        backgroundColor: "rgba(75, 192, 192, 0.7)", // verde agua
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75, 192, 192, 0.9)",
        hoverBorderColor: "rgba(75, 192, 192, 1)",
      },
      {
        label: "Egresos",
        data: dashboardData.egresosPorMes.map((d) => d.total_egresos),
        backgroundColor: "rgba(255, 99, 122, 0.7)", // rojo suave
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(255, 99, 132, 0.9)",
        hoverBorderColor: "rgba(255, 99, 132, 1)",
      },
    ],
  };

  const data = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "My First dataset",
        backgroundColor: "red",
        borderColor: "rgba(255,255,255,.55)",
        pointBackgroundColor: "#39f",
        data: [1, 18, 9, 17, 34, 22, 11],
      },
    ],
  };
  const optionsBar = {
    responsive: true,
    maintainAspectRatio: false, // permite controlar altura
    layout: {
      padding: 20, // espacio alrededor del gráfico
    },
    plugins: {
      legend: {
        display: true,
        position: "top", // leyenda arriba
        labels: {
          font: {
            size: 14,
            weight: "bold",
          },
        },
      },
      tooltip: {
        enabled: true,
        mode: "index",
        intersect: false,

        padding: 10,
        cornerRadius: 6,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: Q${context.raw.toLocaleString(
              "es-GT",
              { minimumFractionDigits: 2 }
            )}`;
          },
        },
      },
      title: {
        display: true,
        text: "Ingresos y Egresos Mensuales",
        font: {
          size: 16,
          weight: "bold",
        },

        padding: {
          top: 10,
          bottom: 30,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false, // sin líneas verticales
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: { size: 12 },

          callback: (value) => `Q${value.toLocaleString("es-GT")}`, // formato moneda
        },
        grid: {
          color: "rgba(43, 40, 40, 0.87)",
          borderDash: [5, 5],
        },
      },
    },
  };

  const options = {
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
      y: {
        min: -9,
        max: 39,
        display: false,
        grid: {
          display: false,
        },
        ticks: {
          display: false,
        },
      },
    },
    elements: {
      line: {
        borderWidth: 1,
      },
      point: {
        radius: 4,
        hitRadius: 10,
        hoverRadius: 4,
      },
    },
  };
  return (
    <>
      <CRow>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="primary"
            value={
              <>
                {formatQ(dashboardData.ingresosAnioActual)}{" "}
                <span className="fs-6 fw-normal">(40.9% )</span>
              </>
            }
            title="Ingresos Anuales"
            // action={
            //   <CDropdown alignment="end">
            //     <CDropdownToggle
            //       color="transparent"
            //       caret={false}
            //       className="p-0"
            //     >
            //       <FontAwesomeIcon
            //         icon={faEllipsisV}
            //         className="text-white"
            //         size="lg"
            //       />
            //     </CDropdownToggle>
            //     <CDropdownMenu>
            //       <CDropdownItem>Action</CDropdownItem>
            //       <CDropdownItem>Another action</CDropdownItem>
            //       <CDropdownItem>Something else here...</CDropdownItem>
            //       <CDropdownItem disabled>Disabled action</CDropdownItem>
            //     </CDropdownMenu>
            //   </CDropdown>
            // }
            chart={
              <ChartLine
                style={{ height: "80px" }}
                className={"mt-3 mx-3"}
                data={data}
                options={options}
              />
            } // cambiar
          />
        </CCol>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="info"
            value={
              <>
                {formatQ(dashboardData.egresosAnioActual)}{" "}
                <span className="fs-6 fw-normal">(40.9% )</span>
              </>
            }
            title="Gastos Anuales"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle
                  color="transparent"
                  caret={false}
                  className="p-0"
                >
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className="text-white"
                    size="lg"
                  />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <ChartLine
                style={{ height: "80px" }}
                className={"mt-3 mx-3"}
                data={data}
                options={options}
              />
            }
          />
        </CCol>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="warning"
            value={
              <>
                {formatQ(dashboardData.ingresosMesActual)}{" "}
                <span className="fs-6 fw-normal">(40.9% )</span>
              </>
            }
            title="Ingresos Mensuales"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle
                  color="transparent"
                  caret={false}
                  className="p-0"
                >
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className="text-white"
                    size="lg"
                  />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartLine
                className="mt-3"
                style={{ height: "70px" }}
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                  ],
                  datasets: [
                    {
                      label: "My First dataset",
                      backgroundColor: "rgba(255,255,255,.2)",
                      borderColor: "rgba(255,255,255,.55)",
                      data: [78, 81, 80, 45, 34, 12, 40],
                      fill: true,
                    },
                  ],
                }}
                options={{
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  maintainAspectRatio: false,
                  scales: {
                    x: {
                      display: false,
                    },
                    y: {
                      display: false,
                    },
                  },
                  elements: {
                    line: {
                      borderWidth: 2,
                      tension: 0.4,
                    },
                    point: {
                      radius: 0,
                      hitRadius: 10,
                      hoverRadius: 4,
                    },
                  },
                }}
              />
            }
          />
        </CCol>
        <CCol sm={3}>
          <CWidgetStatsA
            className="mb-4"
            color="danger"
            value={
              <>
                {formatQ(dashboardData.egresosMesActual)}{" "}
                <span className="fs-6 fw-normal">(40.9% )</span>
              </>
            }
            title="Gastos Mensuales"
            action={
              <CDropdown alignment="end">
                <CDropdownToggle
                  color="transparent"
                  caret={false}
                  className="p-0"
                >
                  <FontAwesomeIcon
                    icon={faEllipsisV}
                    className="text-white"
                    size="lg"
                  />
                </CDropdownToggle>
                <CDropdownMenu>
                  <CDropdownItem>Action</CDropdownItem>
                  <CDropdownItem>Another action</CDropdownItem>
                  <CDropdownItem>Something else here...</CDropdownItem>
                  <CDropdownItem disabled>Disabled action</CDropdownItem>
                </CDropdownMenu>
              </CDropdown>
            }
            chart={
              <CChartBar
                className="mt-3 mx-3"
                style={{ height: "70px" }}
                data={{
                  labels: [
                    "January",
                    "February",
                    "March",
                    "April",
                    "May",
                    "June",
                    "July",
                    "August",
                    "September",
                    "October",
                    "November",
                    "December",
                    "January",
                    "February",
                    "March",
                    "April",
                  ],
                  datasets: [
                    {
                      label: "My First dataset",
                      backgroundColor: "rgba(255,255,255,.2)",
                      borderColor: "rgba(255,255,255,.55)",
                      data: [
                        78, 81, 80, 45, 34, 12, 40, 85, 65, 23, 12, 98, 34, 84,
                        67, 82,
                      ],
                      barPercentage: 0.6,
                    },
                  ],
                }}
                options={{
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false,
                    },
                  },
                  scales: {
                    x: {
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                    y: {
                      border: {
                        display: false,
                      },
                      grid: {
                        display: false,
                        drawTicks: false,
                      },
                      ticks: {
                        display: false,
                      },
                    },
                  },
                }}
              />
            }
          />
        </CCol>
      </CRow>
      <CRow>
        <CCol md={12}>
          <CCard>
            <CCardBody>
              <ChartBar
                data={dataChartGeneral}
                options={optionsBar}
                style={{ height: "500px" }}
              />
            </CCardBody>
            <CCardFooter>
              <CRow className="text-center">
                {dashboardData.ingresoPorCategoria.map((cat) => (
                  <CCol md={2} key={cat.id_subc}>
                    <strong>{cat.nombre_subcategoria}</strong>
                    <CProgress
                      className="my-2"
                      color={
                        cat.porcentaje_total > 50
                          ? "success"
                          : cat.porcentaje_total > 25
                          ? "info"
                          : "warning"
                      }
                      value={cat.porcentaje_total}
                      height={10}
                    />
                    <small>{cat.porcentaje_total.toFixed(2)}%</small>
                  </CCol>
                ))}

                {dashboardData.egresoPorCategoria.map((cat) => (
                  <CCol md={2} key={cat.id_subc}>
                    <strong>{cat.nombre_subcategoria}</strong>
                    <CProgress
                      className="my-2"
                      color={
                        cat.porcentaje_total > 50
                          ? "danger"
                          : cat.porcentaje_total > 25
                          ? "warning"
                          : "success"
                      }
                      value={cat.porcentaje_total}
                      height={10}
                    />
                    <small>{cat.porcentaje_total.toFixed(2)}%</small>
                  </CCol>
                ))}
              </CRow>
            </CCardFooter>
          </CCard>
        </CCol>
      </CRow>
    </>
  );
};
