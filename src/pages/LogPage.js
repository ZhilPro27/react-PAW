import React, { useState, useEffect } from 'react';
import api from '../services/axiosInstance';
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, Chip } from '@mui/material';

const LogPage = () => {
  const [logs, setLogs] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(15);
  const [totalRows, setTotalRows] = useState(0);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get(`/admin/logs?page=${page + 1}&limit=${rowsPerPage}`);
        setLogs(response.data.data);
        setTotalRows(response.data.total);
      } catch (error) {
        console.error("Gagal memuat log:", error);
      }
    };
    fetchLogs();
  }, [page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
    setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    };


  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Catatan Aktivitas Login</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Waktu</TableCell>
              <TableCell>Tipe</TableCell>
              <TableCell>User ID</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {logs.map((log) => (
              <TableRow key={log.id}>
                <TableCell>{log.timestamp}</TableCell>
                <TableCell>
                  <Chip label={log.event_type} color={log.event_type === 'login' ? 'primary' : 'default'} size="small" />
                </TableCell>
                <TableCell>{log.user_id}</TableCell>
                <TableCell>{log.role}</TableCell>
                <TableCell>
                  <Chip label={log.success ? 'Berhasil' : 'Gagal'} color={log.success ? 'success' : 'error'} size="small" />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[15, 30, 50]}
          component="div"
          count={totalRows}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>
    </Container>
  );
};

export default LogPage;