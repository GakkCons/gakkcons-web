import React, { useState } from 'react';
import LogoSmall from '../assets/images/logosmall.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';

function Home() {
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [isStatusExpanded, setIsStatusExpanded] = useState<boolean>(false);

  const toggleExpansion = () => {
    setIsExpanded((prevState) => !prevState);
  };
  const toggleExpansionStatus = () => {
    setIsStatusExpanded((prevState) => !prevState);
  };


  return (
    <>
      <div className=" mr-10 mt-5">
        <div className="flex items-center ">
          <img src={LogoSmall} alt="logo" className="w-30 h-1/12" />
          <h1 className="m-0 p-0 text-5xl font-black font-montserrat" style={{letterSpacing: '2px'}}>GakkCons</h1>
        </div>
      </div>

      <div className="flex flex-col items-center mt-5">
        <div
          style={{
            border: '1px solid black',
            borderRadius: '7px',
            width: '300px', // Adjust as needed
            position: 'fixed',
            top: '60px',
            right: '20px'
          }}
        >
          <div className="flex items-center p-3 cursor-pointer"  onClick={toggleExpansion} 
          >
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
                className={`transform transition-transform ${
                  isExpanded ? 'rotate-180' : ''
                }`}
              />
            </span>
          </div>

          {/* Expanded Content Inside */}
          {isExpanded && (
            <div
              className=" px-4 pt-1 pb-3 rounded-b"
              style={{ width: '100%' }}
            >
              <button className='text-sm font-semibold'>
                <a href="/">Logout</a>
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="mx-10">
        <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-4">
          <div className="col-span-1 md:col-span-4 lg:col-span-3" >

            <div  style={{position: 'relative', maxWidth: '100%', width: '300px', background: '#D9D9D9', border: '1px solid black', borderRadius: '7px'}} >
            <div className='flex items-center p-3  cursor-pointer'onClick={toggleExpansionStatus}>
              <h1 className="pr-10 font-medium">Status</h1>
              <span style={{ position: 'absolute', right: '20px' }}>
                <FontAwesomeIcon
                  icon={faChevronDown}
                  className={`transform transition-transform ${ 
                    isExpanded ? 'rotate-180' : ''
                  }`}
                />
              </span>
            </div>

            {isStatusExpanded && (
              <div>
            <div
              className="flex justify-between items-center py-4 pt-1 pb-3 rounded-b"
              style={{ width: '100%' }}
            >
              <h1 className='text-md ml-3 font-normal'>Available</h1>
              <div
              className="mr-5"
              style={{
                width: '10px',
                height: '10px',
                background: '#15B31B',
                borderRadius: '30px',
                padding: '10px',
              }}
            ></div>
            </div>

            <div
              className="flex justify-between items-center py-4 pt-1 pb-3 rounded-b"
              style={{ width: '100%' }}
            >
              <h1 className='text-md ml-3 font-normal'>Unvailable</h1>
              <div
              className="mr-5"
              style={{
                width: '10px',
                height: '10px',
                background: '#CD1616',
                borderRadius: '30px',
                padding: '10px',
              }}
            ></div>
            </div>
                </div>

          )}
            </div>
           


          </div>

          
          <div className="col-span-1 md:col-span-8 lg:col-span-9 p-10" style={{maxWidth: '100%', width: '100vw', maxHeight: '100%', height: '80vh', background: '#282726', borderRadius: '7px'}}>

            <div className="pt-5" style={{width: '100%', height: '70vh', maxHeight: '100%', background: '#D9D9D9', borderRadius: '7px'}}>



            </div>

          </div>
        </div>
      </div>




    </>
  );
}

export default Home;
