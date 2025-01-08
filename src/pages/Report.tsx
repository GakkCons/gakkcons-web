import React, { useState } from 'react';
import LogoSmall from '../assets/images/logosmall.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChartSimple, faChevronDown, faFilter, faMagnifyingGlass, faUser, faUsers } from '@fortawesome/free-solid-svg-icons';
import Navbar from './components/navbar';
import { Line } from 'react-chartjs-2';
import { 
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend,
 } from 'chart.js';
import axios from './plugins/axios';
import { useQuery } from '@tanstack/react-query';

 // Register Chart.js components
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Title,
  Tooltip,
  Legend
);
import './style.css';

const fetchAnalyticsData = async (token: string) => {
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await axios.get(
      'appointments/get/analytics',
      {
        headers: {
          Authorization: `Bearer ${token}`, // Corrected Authorization header format
        },
      }
    );
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch analytics data');
  }
};




function Report() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isStatusExpanded, setIsStatusExpanded] = useState<boolean>(false);
  const [status, setStatus] = useState('');
  const [reportType, setReportType] = useState('daily'); // Toggle between daily and weekly

  const token = sessionStorage.getItem('authToken');

// Correctly passing a function as queryFn
const { data, error, isLoading } = useQuery({
  queryKey: ['analytics'],  // Query key
  queryFn: () => fetchAnalyticsData(token),  // Pass the function, not the result
});



const dailyData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  datasets: [
    {
      label: 'Daily Reports',
      data: [
        data?.monday_appointments || 0,
        data?.tuesday_appointments || 0,
        data?.wednesday_appointments || 0,
        data?.thursday_appointments || 0,
        data?.friday_appointments || 0,
        data?.saturday_appointments || 0,
        data?.sunday_appointments || 0,
      ],
      fill: false,
      borderColor: '#4CAF50',
      backgroundColor: '#4CAF50',
      tension: 0.4,
    },
  ],
};

const weeklyData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Weekly Reports',
      data: [
        data?.week_1_appointments || 0,
        data?.week_2_appointments || 0,
        data?.week_3_appointments || 0,
        data?.week_4_appointments || 0,
      ],
      fill: false,
      borderColor: '#2196F3',
      backgroundColor: '#2196F3',
      tension: 0.4,
    },
  ],
};

  
  const yearlyData = {
    labels: ['Year'],
    datasets: [
      {
        label: 'Yearly Reports',
        data: [data?.yearly_appointments || 0],
        fill: false,
        borderColor: '#FF6347',
        backgroundColor: '#FF6347',
        tension: 0.4,
      },
    ],
  };


  const options1 = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        grid: {
          drawBorder: false,
        },
        ticks: {
          beginAtZero: true,
        },
      },
    },
  };

  
  const toggleExpansion = () => {
    setIsExpanded((prevState) => !prevState);
  };

  const toggleExpansionStatus = () => {
    setIsStatusExpanded((prevState) => !prevState);
  };

  const toggleStatus = (newStatus: React.SetStateAction<string>) => {
    setStatus(newStatus);
    setIsStatusExpanded(false);
  };
  return (
    <>
      <div className="mr-10 mt-5 logo">
        <div className="flex items-center">
          <img src={LogoSmall} alt="logo" className="w-30 h-1/12" />
          <h1
            className="m-0 p-0 text-5xl font-black font-montserrat"
            style={{ letterSpacing: '2px' }}
          >
            GakkCons
          </h1>
        </div>
      </div>


      <div className="flex  items-center  dropdowncontainer"  >
        <div
          style={{
            border: '1px solid black',
            borderRadius: '7px',
            width: '300px',
            position: 'absolute',
            top: '60px',
            right: '20px',
          }}
          className='dropdownlist'
        >
          <div className="flex items-center p-3 cursor-pointer" onClick={toggleExpansion}>
            <div
              className="mr-3"
              style={{
                width: '10px',
                height: '10px',
                background: '#282726',
                borderRadius: '30px',
                padding: '10px',
                
              }}
            ></div>
            <h1 className="pr-10">Teacher</h1>
            <span style={{ position: 'absolute', right: '10px' }}>
              <FontAwesomeIcon
                icon={faChevronDown}
                className={`transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
              />
            </span>
          </div>

          {/* Expanded Content Inside */}
          {isExpanded && (
            <div className="px-4 pt-1 pb-3 rounded-b" style={{ width: '100%' }}>
              <button className="text-sm font-semibold">
                <a href="/">Logout</a>
              </button>
            </div>
          )}
        </div>
      </div>


      <div className="mx-2 sm:mx-4 md:mx-10 details mt-4">
       <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4">
       <div className="col-span-1 md:col-span-4 lg:col-span-3 detail-status" style={{ position:  'relative' }}>
           
            <Navbar />
          </div>

              <div
                className="col-span-1 md:col-span-8 lg:col-span-9"
                style={{
                  maxWidth: '100%',
                  width: '100%',
                  maxHeight: '100%',
                  height: 'auto',
                  background: 'white',
                  borderRadius: '7px',
                }}
              >

      <div className="pb-2 px-2 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Header Section */}
        <div className="flex justify-start items-center gap-2">
          <h1 className="text-black text-xl sm:text-2xl tracking-wide font-semibold">
            Consultation Report Dashboard
          </h1>
          <FontAwesomeIcon className="text-xl sm:text-2xl text-black" icon={faChartSimple} />
        </div>

        {/* Controls Section (Inline Search and Filter) */}
        <div className="flex items-center gap-4">
          {/* Search Input */}
          <div className="relative">
            <input
              className="p-2 w-60 border border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
              type="text"
              name="search"
              placeholder="Search Instructor"
            />
            <FontAwesomeIcon
              className="text-xl text-black absolute right-3 top-2.5"
              icon={faMagnifyingGlass}
            />
          </div>

            {/* Filter Icon */}
            <FontAwesomeIcon className="text-2xl text-black cursor-pointer" icon={faFilter} />
             </div>
           </div>


            <div className=' p-2 md:p-4 mb-2' style={{background: '#282726'}}>
              <div className="flex justify-between items-center mb-2">
                <h1 className="text-white text-2xl tracking-wide font-semibold">Overall Instructor</h1>
              </div>

              <div
                className="px-5 py-6"
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '100%',
                  background: '#D9D9D9',
                  borderRadius: '7px',
                }}
              >
                <div className="bg-white rounded-md py-5 px-7 mb-5">
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold tracking-wide text-xl">Daily Report</h1>
                    <p className="text-xl text-black">
                      <span className="font-bold mr-4">{data.daily_total_appointments}</span>
                      <FontAwesomeIcon icon={faUser} />
                    </p>
                  </div>
                  {/* daily report graph */}
                  <div className="mt-4" style={{ width: '100%', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Line data={dailyData} options={options1} />
                  </div>
                </div>

                <div className="bg-white rounded-md py-5 px-7 mb-5">
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold tracking-wide text-xl">Weekly Report</h1>
                    <FontAwesomeIcon className="text-xl text-black" icon={faUsers} />
                  </div>
                  {/* weekly report graph */}
                  <div className="mt-4" style={{ width: '100%', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Line data={weeklyData} options={options1} />
                  </div>
                </div>


                <div className="bg-white rounded-md py-5 px-7">
                  <div className="flex justify-between items-center">
                    <h1 className="font-semibold tracking-wide text-xl">Monthly Report</h1>
                    <FontAwesomeIcon className="text-xl text-black" icon={faUsers} />
                  </div>
                  {/* monthly report graph */}
                  <div className="mt-4" style={{ width: '100%', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
                    <Line data={yearlyData} options={options1} />
                  </div>
                </div>
              </div>
            </div>
          </div>


        </div>
      </div>




    </>
  );
}

export default Report;
