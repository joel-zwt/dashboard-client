import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";

import { AdminToolbar, AdminTable } from "./components";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

const AdminList = () => {
  const classes = useStyles();

  const [filter, setFilter] = useState({
    values: {},
    filterSearch: false,
  });

  const [admin, setAdmin] = useState([]);
  const [adminTableData, setAdminTableData] = useState({
    page: 0,
    rowsPerPage: 10,
    orderColumn: "name",
    orderDirection: "asc",
  });
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteData, setDeleteData] = useState([]);
  const [edit, setEdit] = useState("");

  useEffect(() => {
    console.log(filter);
    console.log(adminTableData);
    setLoading(true);
    if (adminTableData.page >= 0) {
      if (filter.filterSearch == false) {
        axios({
          method: "post",
          url: "/admin/",
          data: { ...adminTableData },
        })
          .then((result) => {
            setAdmin(result.data.admin);
            setTotalAdmin(result.data.count);
            setTimeout(() => {
              setLoading(false);
            }, 300);
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
            setAdmin([]);
            setTotalAdmin(0);
            setTimeout(() => {
              setLoading(false);
            }, 300);
          });
      } else {
        var filterValues = filter.values;
        axios({
          method: "post",
          url: "/admin/search",
          data: {
            page: adminTableData.page,
            rowsPerPage: adminTableData.rowsPerPage,
            orderDirection: adminTableData.orderDirection,
            orderColumn: adminTableData.orderColumn,
            values: {
              v_email: filterValues.email ? filterValues.email : "",
              v_name: filterValues.name ? filterValues.name : "",
              v_department: filterValues.department
                ? filterValues.department
                : "",
              v_status: filterValues.status ? filterValues.status : "",
            },
          },
        })
          .then((result) => {
            console.log(result);
            setAdmin(result.data.admin);
            setTotalAdmin(result.data.count);
            setTimeout(() => {
              setLoading(false);
            }, 300);
            console.log(result);
          })
          .catch((err) => {
            console.log(err);
            setAdmin([]);
            setTotalAdmin(0);
            setTimeout(() => {
              setLoading(false);
            }, 300);
          });
      }
    }
  }, [filter, adminTableData]);

  useEffect(() => {
    setLoading(true);
    console.log(deleteData);
    axios({
      method: "post",
      url: "/admin/delete",
      data: {
        deleteRows: deleteData,
      },
    }).then((result) => {
      console.log(result.data);
      setTotalAdmin(result.data.count);
      setAdminTableData({
        ...adminTableData,
        page: 0,
      });
      setTimeout(() => {
        setLoading(false);
      }, 300);
    });
  }, [deleteData]);

  return (
    <div className={classes.root}>
      <AdminToolbar
        setFilter={setFilter}
        setAdminTableData={setAdminTableData}
        adminTableData={adminTableData}
      />
      <div className={classes.content}>
        <AdminTable
          // filter={filter}
          admin={admin}
          setAdminTableData={setAdminTableData}
          totalAdmin={totalAdmin}
          loading={loading}
          adminTableData={adminTableData}
          setDeleteData={setDeleteData}
        />
      </div>
    </div>
  );
};

export default AdminList;
