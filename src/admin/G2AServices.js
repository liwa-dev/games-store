import React, { useEffect, useState, useRef } from 'react';
import styles from './ServiceManagement.module.css';
import { G2A } from '../asset/G2A';
import HoverCard from './HoverCard';
import Button from '../libs/Button';
import { useModal } from '../provider/ModalProvider';
import CustomInput from '../libs/CustomInput';
import { convertCurrency } from '../asset/CurrencyConvert';
import { ServiceForm } from './ServiceForm'; // Import the ServiceForm component
import { addService, updateService } from '../supabase/setData'; // Import addService and updateService
import { useNotification } from '../provider/NotificationProvider'; // Import useNotification

export default function G2AServices() {
  const [g2aServices, setG2aServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPageInput, setCurrentPageInput] = useState(1);
  const { openModal, closeModal } = useModal();
  const serviceFormRef = useRef(null); // Reference to the ServiceForm component
  const { notifySuccess, notifyError, notifyInfo } = useNotification(); // Destructure notification functions

  useEffect(() => {
    const fetchG2AServices = async (page) => {
      try {
        const g2aData = [];
        const uniqueIds = new Set();

        const g2aResponse = await G2A(page);
        for (const doc of g2aResponse.docs) {
          if (doc.categories && doc.availableToBuy) {
            for (const category of doc.categories) {
              const categoryNameLower = category.name.toLowerCase();
              if ((categoryNameLower.includes('gam') || categoryNameLower.startsWith('gam')) && !uniqueIds.has(doc.id)) {
                uniqueIds.add(doc.id);
                const convertedPrice = await convertCurrency(doc.minPrice);
                g2aData.push({ ...doc, convertedPrice });
              }
            }
          }
        }

        setG2aServices(g2aData);
        setTotalPages(g2aResponse.total);
      } catch (error) {
        console.error('Error fetching G2A services:', error);
      }
    };

    fetchG2AServices(currentPage);
  }, [currentPage]);

  const handleSave = async (editedService) => {
    try {
      const serviceToSave = {
        ...editedService,
        categorie: Array.isArray(editedService.categorie) 
          ? editedService.categorie.join(',') 
          : (typeof editedService.categorie === 'string' ? editedService.categorie : '')
      };
  
      // Remove unused properties
      delete serviceToSave.category;
  
      if (editedService.id) {
        const { data, count } = await updateService(serviceToSave);
        if (data && data.length > 0) {
          notifySuccess('Service updated successfully');
          closeModal();
        } else {
          notifyInfo('No changes were made to the service or the service was not found.');
        }
      } else {
        const response = await addService(serviceToSave);
        if (response && response.length > 0) {
          closeModal();
        } else {
          notifyError('Failed to add new service');
        }
      }
    } catch (error) {
      notifyError('Error saving service');
      console.error('Error saving service:', error);
    }
  };

  const handleAdd = (service) => {
    let categoryValue = '';
    if (service.categories) {
      service.categories.forEach(category => {
        const categoryNameLower = category.name.toLowerCase();
        if (categoryNameLower.includes('gam') || categoryNameLower.startsWith('gam')) {
          categoryValue = 'GAMES';
        }
      });
    }

    const newService = {
      name: service.name || '',
      image: service.coverImage || '',
      price: service.convertedPrice ? service.convertedPrice.toFixed(2) : '',
      description: service.description || "Lors de l'achat, veuillez me contacter via Facebook (Liwa Hadri) avec une preuve de paiement",
      categorie: categoryValue,
      urlPlan: "https://www.g2a.com"+service.slug
    };

    openModal(
      <>
        <Button color={"blue"} onClick={() => window.open(`https://www.g2a.com${service.slug}`, '_blank')}>Check Product</Button>
        <ServiceForm 
          provider="G2A"
          ref={serviceFormRef} 
          service={newService} 
          onSave={handleSave} 
        />
      </>, {
        title: 'Add Service',
        showOk: true,
        showCancel: true,
        onOk: () => {
          serviceFormRef.current.handleSubmit();
        }
      }
    );
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageInputChange = (e) => {
    const pageNumber = parseInt(e.target.value, 10);
    if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPageInput(pageNumber);
    } else {
      setCurrentPageInput(e.target.value);
    }
  };

  const handlePageInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      const pageNumber = parseInt(e.target.value, 10);
      if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= totalPages) {
        setCurrentPage(pageNumber);
      }
    }
  };

  return (
    <>
      <div className={styles.currentlyAdded}>Services of G2A</div>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center'}}>
        {g2aServices.map((service, index) => (
          <HoverCard
            key={index}
            bgImage={service.image || service.coverImage}
            name={service.name}
            description={service.description}
            onAdd={() => handleAdd(service)}
          />
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <Button color={currentPage === 1 ? "red" : "blue"} style={{opacity: currentPage === 1 ? 0.5 : 1, pointerEvents: currentPage === 1 ? 'none' : 'auto'}} onClick={handlePreviousPage} disabled={currentPage === 1}>
            Previous
        </Button>
        <div style={{display: 'flex', alignItems: 'center', gap: '10px', flexDirection: 'column'}}>
          <span style={{ margin: '0 10px' }}>Page {currentPage} of {totalPages}</span>
          <input
            type="text"
            value={currentPageInput}
            onChange={handlePageInputChange}
            onKeyDown={handlePageInputKeyPress}
            style={{ width: '50px', textAlign: 'center' }}
          />
        </div>
        <Button color={currentPage === totalPages ? "red" : "blue"} style={{opacity: currentPage === totalPages ? 0.5 : 1, pointerEvents: currentPage === totalPages ? 'none' : 'auto'}} onClick={handleNextPage} disabled={currentPage === totalPages}>
            Next
        </Button>
      </div>
    </>
  );
}