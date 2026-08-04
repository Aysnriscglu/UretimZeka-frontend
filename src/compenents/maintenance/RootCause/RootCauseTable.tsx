import { Paper, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";

type Props = {
  rows: any[];
};

export default function RootCauseTable({ rows }: Props) {
    console.log("ROOT CAUSE TABLE ÇALIŞTI");
  const get = (row: any, ...keys: string[]) => {
    for (const key of keys) {
      const value = row[key];

      if (
        value !== undefined &&
        value !== null &&
        String(value).trim() !== ""
      ) {
        return value;
      }
    }

    return "-";
  };

  const columns: GridColDef[] = [
    {
      field: "İş Merkezi",
      headerName: "İş Merkezi",
      flex: 1.4,
    },
    {
      field: "Makine",
      headerName: "Makine",
      flex: 1.6,
    },
    {
      field: "Çağrı Nedeni",
      headerName: "Çağrı Nedeni",
      flex: 2.2,
    },
    {
      field: "Durum",
      headerName: "Durum",
      flex: 1,
    },
    {
      field: "MTTR",
      headerName: "MTTR (dk)",
      flex: 1,
    },
    {
      field: "Tarih",
      headerName: "Başlangıç",
      flex: 1.4,
    },
  ];

  const tableRows = rows.map((row, index) => ({
    
    id: index,

    "İş Merkezi": get(row, "İş Merkezi"),

    Makine: get(
      row,
      "Ekipman Adı",
      "İş Merkezi"
    ),

    "Çağrı Nedeni": get(
      row,
      "Çağrı Nedeni",
      "Duruş Adı"
    ),

    Durum: get(row, "Durum"),

    MTTR: get(
      row,
      "Müdahale Süresi(dk)",
      "Müdahale Süresi (dk)"
    ),

    Tarih: get(
      row,
      "M. Başlangıç Tarihi"
    ),
  }));
  console.log("Table Rows:", tableRows[0]);

  return (
    <Paper
      sx={{
        mt: 3,
        p: 2,
        borderRadius: 4,
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <Typography
        variant="h6"
        sx={{
          color: "#fff",
          mb: 2,
          fontWeight: 700,
        }}
      >
        Son Bakım Çağrıları
      </Typography>

      <DataGrid
        rows={tableRows}
        columns={columns}
        autoHeight
        pageSizeOptions={[10, 20, 50]}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        disableRowSelectionOnClick
        sx={{
          border: 0,
          color: "#fff",

          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#0f172a",
            color: "#fff",
            fontWeight: 700,
          },

          "& .MuiDataGrid-cell": {
            borderColor: "rgba(255,255,255,.08)",
          },

          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#0f172a",
            color: "#fff",
          },

          "& .MuiSvgIcon-root": {
            color: "#fff",
          },

          "& .MuiTablePagination-root": {
            color: "#fff",
          },
        }}
      />
    </Paper>
  );
}