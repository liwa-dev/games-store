import React, { useState, useEffect, useRef } from 'react';
import styles from './ServiceManagement.module.css';
import Button from '../libs/Button';
import { useModal } from '../provider/ModalProvider';
import { getServices } from '../supabase/getData';
import { addService, updateService, deleteService } from '../supabase/setData';
import { useNotification } from '../provider/NotificationProvider';
import { ServiceForm } from './ServiceForm';
import G2AServices from './G2AServices';
import KinguinServices from './KinguinServices';
import CustomLoader from '../asset/CustomLoader'; //CustomLoader("Fetching Data")

const ServiceManagement = () => {
  const [state, setState] = useState("normal");
  const [services, setServices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const itemsPerPage = 10;
  const { openModal, closeModal } = useModal();
  const { notifySuccess, notifyError, notifyInfo } = useNotification();
  const formRef = useRef();

  useEffect(() => {
    fetchServices();
  }, [currentPage]);

  const fetchServices = async () => {
    setIsLoading(true);
    try {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;
      const { data, count } = await getServices(null, from, to);
      setServices(data);
      setTotalCount(count);
    } catch (error) {
      console.error('Error fetching services:', error);
      notifyError('Failed to fetch services');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (service) => {
    openModal(
      <ServiceForm
        ref={formRef}
        service={service}
        onSave={handleSave}
      />,
      {
        title: 'Edit Service',
        showOk: true,
        showCancel: true,
        onOk: () => {
          formRef.current.handleSubmit();
        }
      }
    );
  };

  const handleDelete = async (serviceId) => {
    openModal(
      <p>Are you sure you want to delete this service?</p>,
      {
        title: 'Confirm Deletion',
        showOk: true,
        showCancel: true,
        onOk: async () => {
          try {
            await deleteService(serviceId);
            await fetchServices(); // Refresh the list after deletion
            notifySuccess('Service deleted successfully');
            closeModal();
          } catch (error) {
            notifyError('Error deleting service');
            console.error('Error deleting service:', error);
          }
        }
      }
    );
  };

  const handleSave = async (editedService) => {
    try {
      const serviceToSave = {
        ...editedService,
        categorie: Array.isArray(editedService.categorie) 
          ? editedService.categorie.join(',') 
          : (typeof editedService.categorie === 'string' ? editedService.categorie : '')
      };
  
      delete serviceToSave.category;
  
      if (editedService.id) {
        const { data, count } = await updateService(serviceToSave);
        if (data && data.length > 0) {
          await fetchServices(); // Refresh the list after update
          notifySuccess('Service updated successfully');
          closeModal();
        } else {
          notifyInfo('No changes were made to the service or the service was not found.');
        }
      } else {
        const response = await addService(serviceToSave);
        if (response && response.length > 0) {
          await fetchServices(); // Refresh the list after addition
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

  const handleAddNew = () => {
    const newService = {
      id: null,
      name: '',
      image: '',
      price: 0,
      plans: [],
      description: '',
      categorie: []
    };
    openModal(
      <ServiceForm
        ref={formRef}
        service={newService}
        onSave={handleSave}
      />,
      {
        title: 'Add New Service',
        showOk: true,
        showCancel: true,
        onOk: () => {
          formRef.current.handleSubmit();
        }
      }
    );
  };

  const handleToggle = (newState) => {
    setState(prevState => (prevState === newState ? "normal" : newState));
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const totalPages = Math.ceil(totalCount / itemsPerPage);

  return (
    <div className={styles.container}>
      <h2>Service Management</h2>
      <Button 
        color={"orange"} 
        onClick={() => handleToggle("G2A")} 
        style={{ opacity: state === "G2A" ? 1 : .2 }}
      >
        G2A
      </Button>
      <Button 
        color={"yellow"} 
        onClick={() => handleToggle("Kinguin")} 
        style={{ opacity: state === "Kinguin" ? 1 : .2 }}
      >
        Kinguin
      </Button>
      {state === "normal" && (
        <>
          <Button color="blue" onClick={handleAddNew}>Manual Add Service</Button>
          <div className={styles.currentlyAdded}>Currently Added Services</div>
          {isLoading ? (
            <CustomLoader resourceName="Fetching Data" />
          ) : (
            <>
              <ul className={styles.serviceList}>
                {services.map(service => (
                  <li key={service.id} className={styles.serviceItem}>
                    <img src={service.image} alt={service.name} className={styles.serviceImage} />
                    <div className={styles.serviceInfo}>
                      <h3>{service.name}</h3>
                      <p>Price: ${service.price}</p>
                      <p>Categories: {
                        Array.isArray(service.categorie) 
                          ? service.categorie.join(', ') 
                          : (typeof service.categorie === 'string' ? service.categorie : '')
                      }</p>
                    </div>
                    <div className={styles.serviceActions}>
                      <Button color="yellow" onClick={() => handleEdit(service)}>Edit</Button>
                      <Button color="red" onClick={() => handleDelete(service.id)}>Delete</Button>
                    </div>
                  </li>
                ))}
              </ul>
              <div className={styles.pagination}>
                <Button 
                  color={"blue"}
                  style={{opacity: currentPage === 1 ? .2 : 1}}
                  onClick={() => handlePageChange(currentPage - 1)} 
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <span>{currentPage} of {totalPages}</span>
                <Button 
                  color={"blue"}
                  style={{opacity: currentPage === totalPages ? .2 : 1}}
                  onClick={() => handlePageChange(currentPage + 1)} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            </>
          )}
        </>
      )}

      {state === "G2A" && (
        <G2AServices/>
      )}

      {state === "Kinguin" && (
        <KinguinServices/>
      )}
    </div>
  );
};

export default ServiceManagement;