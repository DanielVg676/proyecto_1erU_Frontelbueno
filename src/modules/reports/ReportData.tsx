import { useState, useEffect } from "react";
import { Table, Tag, Input } from "antd";
import dayjs from "dayjs";

const { Search } = Input;

const mockReports = [
  {
    id: "rep-001",
    type: "Ventas",
    description: "Reporte mensual de ventas",
    date: "2025-07-01T10:30:00Z",
    responsible: "Ana Torres",
    status: "completado",
  },
  {
    id: "rep-002",
    type: "Inventario",
    description: "Conteo físico bodega 1",
    date: "2025-07-04T14:00:00Z",
    responsible: "Luis Méndez",
    status: "pendiente",
  },
  {
    id: "rep-003",
    type: "Pedidos",
    description: "Análisis de pedidos demorados",
    date: "2025-07-02T09:15:00Z",
    responsible: "María López",
    status: "en proceso",
  },
];

type Report = {
  id: string;
  type: string;
  description: string;
  date: string;
  responsible: string;
  status: string;
};

function ReportData() {
  const [reports, setReports] = useState<Report[]>([]);
  const [filteredReports, setFilteredReports] = useState<Report[]>([]);

  useEffect(() => {
    // Simular carga de datos
    setReports(mockReports);
    setFilteredReports(mockReports);
  }, []);

  const handleSearch = (value: string) => {
    const filtered = reports.filter((report) =>
      report.type.toLowerCase().includes(value.toLowerCase()) ||
      report.description.toLowerCase().includes(value.toLowerCase()) ||
      report.responsible.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredReports(filtered);
  };

  const columns = [
    {
      title: "Tipo",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Descripción",
      dataIndex: "description",
      key: "description",
    },
    {
      title: "Fecha",
      dataIndex: "date",
      key: "date",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Responsable",
      dataIndex: "responsible",
      key: "responsible",
    },
    {
      title: "Estado",
      dataIndex: "status",
      key: "status",
      render: (status: string) => {
        let color = "default";
        if (status === "completado") color = "green";
        else if (status === "pendiente") color = "red";
        else if (status === "en proceso") color = "orange";
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  return (
    <div className="p-4">
      <Search
        placeholder="Buscar por tipo, descripción o responsable"
        allowClear
        enterButton="Buscar"
        size="large"
        onSearch={handleSearch}
        className="mb-4"
      />

      <Table
        columns={columns}
        dataSource={filteredReports}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}

export default ReportData;
