import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { tokens } from '../theme';
import { useDispatch } from 'react-redux';
import axios from 'axios';
import StatBox from '../components/StatBox';
import EmailIcon from '@mui/icons-material/Email';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import BandGraph from './BandGraph';
import USTExp from './USTExp';
import TableRepresentation from './TableRepresentation';
import ResourceType from './ResourceType';
import EmployeeStatusGraph from './EmployeeStatusGraph';
import AllocationPerGraph from './AllocationPerGraph';
import DashboardRepresentation from './DashboardRepresentation';
import ManagerSelect from '../scenes/global/ManagerSelect';
import PrimarySkills from '../scenes/global/PrimarySkills';
import setdata from '../actions';
import setSelectedData from '../actions/setSetlecteddata';
import Category from '../scenes/global/Category';
import { useSelector } from 'react-redux';
import { act } from 'react-dom/test-utils';


function DashboardData(props) {
  const dispatch = useDispatch();
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const employeeSelected = useSelector((state) => state.selectedData);
  console.log("emp selected")
  console.log(employeeSelected)




  const [employeeData, setEmployeeData] = useState(0);
  const [customerCount, setCustomerCount] = useState(0);
  const [activeEmployeeCount, setActiveEmployeeCount] = useState(0);
  const [resourceWithValidVisaCount, setResourceWithValidVisaCount] = useState(0);
  const [showRepresentation, setShowRepresentation] = useState(true);
  const [selectedBoxName, setSelectedBoxName] = useState("");
  const [TotalemployeeData, setTotalEmployeeData] = useState(0);
  useEffect(() => {
    fetchData();
  }, [props.isDataUploaded]);

  useEffect(() => {
    setEmployeeData(employeeSelected);
    activeEmp()
  }, [employeeSelected])


 

  const activeEmp = () => {
    let empActive = employeeSelected.filter((item) => item['Employee Status'] === 'Active')
   
    let empwithCustomer =  [...new Set(employeeSelected.map(item => item['Customer ID']))];
     console.log("customerA" + empwithCustomer.length)
   setCustomerCount(empwithCustomer.length)
    let empwithValidVisa = employeeSelected.filter((item) => item['Resource with Valid VISA'])
    setActiveEmployeeCount(empActive.length)
    setResourceWithValidVisaCount(empwithValidVisa.length)
  }



  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3004/fetchdata');
      dispatch(setdata(response.data));
      dispatch(setSelectedData(response.data))
      const data = response.data;
      setTotalEmployeeData(data.length)

      setEmployeeData(employeeSelected);
      const datac = data.map((item)=>item['Customer ID'])
      const customerIDs = [...new Set(data.map(item => item['Customer ID']))];
      // console.log("cus"+customerIDs.length)
      // console.log(datac.length+"c")
      setCustomerCount(customerIDs.length);

      const activeEmployees = employeeData.filter(item => item['Employee Status'] === 'Active');
      // const activeEmployees =  [...new Set(employeeData.map(item => item['Employee Status'] === 'Active'))];
      setActiveEmployeeCount(activeEmployees.length);

      const resourcesWithValidVisa = employeeData.filter(item => item['Resource with Valid VISA']);
      setResourceWithValidVisaCount(resourcesWithValidVisa.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };



  const handleBoxClick = (boxName) => {
    setSelectedBoxName(boxName);

  };

  const handlePrimarySelect = (boxName) => {
    setSelectedBoxName(boxName + 'skills');

  };

  const handleManagerSelect = (boxName) => {
    setSelectedBoxName(boxName + 'manager');
    setShowRepresentation(true);
  };

  const handleCategory = (boxName) => {

    setSelectedBoxName(boxName + 'category');

    setShowRepresentation(true);
  };
  const boxes = [
    { title: 'Total Employees', value: employeeData.length, color: "#006E74" },
    { title: 'Total Customers', value: customerCount, color: "#0097AC" },
    { title: 'Active Employee Count', value: activeEmployeeCount, color: "#01B27C" },
    { title: 'Resources with Valid Visa', value: resourceWithValidVisaCount, color: "#003C51" },
  ];

  return (
    <>
      <span style={{ display: 'inline-block', marginBottom: '1rem', width: '80%', }}>


        <div className='d-flex  ' style={{ width: '100%',  }} >

          <ManagerSelect handleBoxClick={handleManagerSelect} />

          <PrimarySkills handleBoxClick={handlePrimarySelect} />

          <Category handleBoxClick={handleCategory} />


          <div style={{ display: 'flex',marginLeft:'auto'}}>
            <div style={{ height: "120px", boxShadow: '5px 5px 5px 5px', fontFamily: 'sans-serif', fontSize: '2rem', color: '#003C51' }}>
              <h1 style={{ fontSize: '0.9rem', textAlign: 'center', padding: '0.5rem', fontWeight: 'bold' }}>Total Employee Count</h1>
              <p style={{ textAlign: 'center', }}>{TotalemployeeData}</p>

            </div>


          </div>


        </div>






      </span>
      <div>

        <div style={{ margin: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'start', gap: '1rem', flexWrap: 'wrap', }}>
            <div style={{ display: 'flex', backgroundColor: "white", borderRadius: "5px", boxShadow: "2px 1px 5px" }}>
              {boxes.map((box, index) => (

                <div key={index} style={{ padding: '0.5rem', borderRadius: '4px', backgroundColor: `${box.color}`, textAlign: 'center', cursor: 'pointer', margin: "1rem", }} onClick={() => handleBoxClick(box.title)}>
                  <h4 style={{ fontSize: '1rem', fontWeight: 'bold', fontFamily: 'serif', color: 'white' }}>{box.title}</h4>
                  <p style={{ color: 'white', fontSize: '2rem' }}>{box.value}</p>
                </div>

              ))}
            </div>

          </div>
          <div className="d-flex justify-content-center" style={{ marginTop: '1rem' }}>
            <div style={{ width: '30%', textAlign: 'center' }}>
              <BandGraph isDataUploaded={props.isDataUploaded} />
            </div>
            <div style={{ width: '40%', textAlign: 'center' }}>
              <USTExp isDataUploaded={props.isDataUploaded} />

            </div>
            <div style={{ width: '30%', textAlign: 'center' }}>
              <ResourceType columnname="Resource Type" isDataUploaded={props.isDataUploaded} />

            </div>
          </div>
          <div className="d-flex justify-content-around" style={{ marginTop: '2rem' }}>
            <TableRepresentation columnname="Country" isDataUploaded={props.isDataUploaded} />

            <EmployeeStatusGraph columnname="Employee Status" isDataUploaded={props.isDataUploaded} />
            {/* <AllocationPerGraph columnname="Allocation Percentage" isDataUploaded={props.isDataUploaded} /> */}

          </div>

          <Button className="m-2" variant="contained" color="primary" onClick={() => handleBoxClick('selectedlist')}>Shortlist List</Button>
          <Button className="m-2" variant="contained" color="primary" onClick={() => handleBoxClick('removedlist')}>Removed List</Button>

          {showRepresentation && <DashboardRepresentation data={selectedBoxName} />}
        </div>
      </div>
    </>
  );
}

export default DashboardData;
