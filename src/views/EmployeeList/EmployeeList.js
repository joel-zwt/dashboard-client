import React, { useState, useEffect } from "react";
import { makeStyles } from "@material-ui/styles";

import { EmployeesToolbar, EmployeesTable } from "./components";
import axios from "axios";

const useStyles = makeStyles((theme) => ({
  root: {
    padding: theme.spacing(3),
  },
  content: {
    marginTop: theme.spacing(2),
  },
}));

const EmployeeList = () => {
  const classes = useStyles();

  const [filter, setFilter] = useState({
    values: {},
    filterSearch: false,
  });

  const [employees, setEmployees] = useState([]);
  const [employeeTableData, setEmployeeTableData] = useState({
    page: 0,
    rowsPerPage: 10,
    orderColumn: "name",
    orderDirection: "asc",
  });
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [loading, setLoading] = useState(false);
  const [deleteData, setDeleteData] = useState([]);

  useEffect(() => {
    console.log(filter);
    console.log(employeeTableData);
    setLoading(true);
    if (employeeTableData.page >= 0) {
      if (filter.filterSearch == false) {
        axios({
          method: "post",
          url: "/employees/",
          data: { ...employeeTableData },
        }).then((result) => {
          setEmployees(result.data.employees);
          setTotalEmployees(result.data.count);
          setTimeout(() => {
            setLoading(false);
          }, 300);
          console.log(result);
        });
      } else {
        var filterValues = filter.values;
        axios({
          method: "post",
          url: "/employees/search",
          data: {
            page: employeeTableData.page,
            rowsPerPage: employeeTableData.rowsPerPage,
            orderDirection: employeeTableData.orderDirection,
            orderColumn: employeeTableData.orderColumn,
            values: {
              v_email: filterValues.email ? filterValues.email : "",
              v_name: filterValues.name ? filterValues.name : "",
              v_department: filterValues.department
                ? filterValues.department
                : "",
              e_gender: filterValues.gender ? filterValues.gender : "",
            },
          },
        }).then((result) => {
          console.log(result);
          setEmployees(result.data.employees);
          setTotalEmployees(result.data.count);
          setTimeout(() => {
            setLoading(false);
          }, 300);
          console.log(result);
        });
      }
    }
  }, [filter, employeeTableData]);

  useEffect(() => {
    setLoading(true);
    console.log(deleteData);
    axios({
      method: "post",
      url: "/employees/delete",
      data: {
        deleteRows: deleteData,
      },
    }).then((result) => {
      console.log(result.data);
      setTotalEmployees(result.data.count);
      setEmployeeTableData({
        ...employeeTableData,
        page: 0,
      });
      setTimeout(() => {
        setLoading(false);
      }, 300);
    });
  }, [deleteData]);

  return (
    <div className={classes.root}>
      <EmployeesToolbar
        setFilter={setFilter}
        setEmployeeTableData={setEmployeeTableData}
        employeeTableData={employeeTableData}
      />
      <div className={classes.content}>
        <EmployeesTable
          // filter={filter}
          employees={employees}
          setEmployeeTableData={setEmployeeTableData}
          totalEmployees={totalEmployees}
          loading={loading}
          employeeTableData={employeeTableData}
          setDeleteData={setDeleteData}
        />
      </div>
    </div>
  );
};

export default EmployeeList;
