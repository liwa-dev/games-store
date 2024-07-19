import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import styles from '../styles/Category.module.css';
import Card from '../libs/Card';
import { getServices } from '../supabase/getData';
import CustomLoader from '../asset/CustomLoader';
import NotService from './NotService';
import Button from '../libs/Button';

const Category = ({ onTogglePerspective, setData, setCurrentPage, currentPage }) => {
  const { categoryName } = useParams();
  const [services, setServices] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [itemsPerPage] = useState(15); // You can adjust this number as needed
  const [totalItems, setTotalItems] = useState(0); // State to store total number of items

  useEffect(() => {
    console.log('Fetching services for category:', categoryName);
    const fetchServices = async () => {
      setIsLoading(true);
      try {
        let supabaseData = [];
        const from = (currentPage - 1) * itemsPerPage;
        const to = from + itemsPerPage - 1;

        if (categoryName && categoryName.startsWith('SEARCH:')) {
          const searchTerms = categoryName.split('SEARCH:')[1].trim().toLowerCase().split(' ');
          supabaseData = await getServices();
          supabaseData.data = supabaseData.data.filter(service =>
            searchTerms.every(term =>
              service.name.toLowerCase().includes(term) ||
              service.description.toLowerCase().includes(term)
            )
          );
          setTotalItems(supabaseData.data.length);
        } else {
          const { data, count } = await getServices(categoryName);
          supabaseData = data;
          setTotalItems(count);
        }

        console.log(supabaseData);
        setServices(supabaseData);
      } catch (error) {
        console.error('Error fetching services:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchServices();
  }, [categoryName, currentPage]);

  const handleClick = async (service) => {
    await new Promise((resolve) => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setTimeout(resolve, 100); // Adjust the timeout to match the scroll duration
    });

    console.log('clicked', service);
    onTogglePerspective();
    setData(service);
    document.body.style.overflow = 'hidden';
  };

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  if (isLoading) {
    return <CustomLoader resourceName={categoryName || 'services'} />;
  }

  if (services.length === 0) {
    return <NotService />;
  }

  return (
    <div className={styles.container}>
      <h2>
        {categoryName && categoryName.startsWith('SEARCH:')
          ? `Search Results for: ${categoryName.split('SEARCH:')[1]}`
          : `Category: ${categoryName || 'All'}`
        }
      </h2>
      <div className={styles.cardContainer}>
      {console.log(services)}
        {services?.length > 0 ? services.map((service, index) => (
          <Card
            key={index}
            bgImage={service.image || service.coverImage}
            name={service.name}
            description={service.description}
            onClick={() => handleClick(service)}
          />
        )) : services.data.map((service, index) => (
          <Card
            key={index}
            bgImage={service.image || service.coverImage}
            name={service.name}
            description={service.description}
            onClick={() => handleClick(service)}
          />
        ))}
      </div>
      <Pagination
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
};

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className="flex justify-center mt-4 space-x-2">
        {pageNumbers.map(number => (
          <li key={number}>
            <Button color={currentPage === number ? 'red' : 'blue'} onClick={() => paginate(number)}>
              {number}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Category;