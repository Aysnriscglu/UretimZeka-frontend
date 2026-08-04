import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Box, Chip } from "@mui/material";

type Props = {
  rows: any[];
};

export default function RootCauseDataGrid({ rows }: Props) {
  const columns: GridColDef[] = [
    {
      field: "Makine",
      headerName: "Makine",
      flex: 1.4,
    },
    {
      field: "Tarih",
      headerName: "Duruş Tarihi",
      flex: 1,
    },
    {
      field: "Duruş",
      headerName: "Duruş",
      flex: 1.6,
    },
    {
      field: "Duruş Tipi Tanımı",
      headerName: "Duruş Tipi",
      flex: 1.5,
    },
    {
      field: "Toplam Süre(dk)",
      headerName: "Süre (dk)",
      flex: 0.8,
    },
    {
      field: "Vardiya",
      headerName: "Vardiya",
      flex: 0.8,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color="primary"
          size="small"
        />
      ),
    },
    {
      field: "Çağrı Tipi",
      headerName: "Çağrı Tipi",
      flex: 1,
    },
    {
      field: "Üretim Dışı Duruş",
      headerName: "Üretim Dışı",
      flex: 1,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Evet" ? "error" : "success"}
          size="small"
        />
      ),
    },
  ];

  const data = rows.map((row, index) => ({
    id: index,
    ...row,
  }));

  return (
    <Box sx={{ mt: 3, height: 550 }}>
      <DataGrid
        rows={data}
        columns={columns}
        pageSizeOptions={[10, 25, 50]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
   
      sx={{
  backgroundColor: "#111827",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 3,

  "& .MuiDataGrid-columnHeaders": {
    backgroundColor: "#1e293b",
    color: "#fff",
    fontSize: 15,
    fontWeight: 700,
    borderBottom: "1px solid rgba(255,255,255,.08)",
  },

  "& .MuiDataGrid-columnHeaderTitle": {
    color: "#fff",
    fontWeight: 700,
  },

  "& .MuiDataGrid-columnSeparator": {
    display: "none",
  },

  "& .MuiDataGrid-cell": {
    borderColor: "rgba(255,255,255,.08)",
    fontSize: 14,
  },

  "& .MuiDataGrid-row:hover": {
    backgroundColor: "rgba(59,130,246,.08)",
  },

  "& .MuiDataGrid-footerContainer": {
    backgroundColor: "#111827",
    color: "#fff",
    borderTop: "1px solid rgba(255,255,255,.08)",
  },

  "& .MuiTablePagination-root": {
    color: "#fff",
  },

  "& .MuiSvgIcon-root": {
    color: "#fff",
  },
}}
      />
    </Box>
  );
}