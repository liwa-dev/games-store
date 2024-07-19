import React, { useState, useEffect } from "react";
import styles from "./ServiceManagement.module.css";
import CustomInput from "../libs/CustomInput";
import { PenOff, Plus, Trash2 } from "lucide-react";

export const ServiceForm = React.forwardRef(({ provider="normal", service, onSave }, ref) => {
    const [editingService, setEditingService] = useState({
      ...service,
      categorie: service.categorie ? 
        (typeof service.categorie === 'string' ? service.categorie.split(',') : service.categorie) 
        : [],
      plans: service.plans || []
    });

    useEffect(() => {
      if (provider === "G2A") {
        setEditingService(prev => ({
          ...prev,
          plans: [{ price: service.price }],
        }));
      } else if (service.price && !editingService.plans.some(plan => plan.price === service.price)) {
        setEditingService(prev => ({
          ...prev,
          plans: [...prev.plans, { name: '', price: service.price }]
        }));
      }
    }, [provider]);
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setEditingService(prev => ({ ...prev, [name]: value }));
    };
    
    const handleCategorieChange = (e) => {
      const categorieArray = e.target.value.split(',').map(cat => cat.trim()).filter(cat => cat !== '');
      setEditingService(prev => ({...prev, categorie: categorieArray}));
    };
  
    const handlePlanEdit = (index) => {
      const currentPlan = editingService.plans[index];
      const newName = prompt("Enter plan name:", currentPlan.name || '');
      const newPrice = prompt("Enter plan price:", currentPlan.price);
      if (newName !== null && newPrice !== null) {
        const newPlans = [...editingService.plans];
        newPlans[index] = { 
          name: newName.trim(),
          price: parseFloat(newPrice)
        };
        setEditingService(prev => ({ ...prev, plans: newPlans }));
      }
    };
  
    const handlePlanDelete = (index) => {
      const newPlans = editingService.plans.filter((_, i) => i !== index);
      setEditingService(prev => ({ ...prev, plans: newPlans }));
    };
  
    const handleAddPlan = () => {
      const newName = prompt("Enter plan name:");
      const newPrice = prompt("Enter plan price:");
      if (newName !== null && newPrice !== null) {
        const newPlan = { 
          name: newName.trim(),
          price: parseFloat(newPrice)
        };
        setEditingService(prev => ({ ...prev, plans: [...prev.plans, newPlan] }));
      }
    };
  
    const handleSubmit = (e) => {
      if (e) e.preventDefault();
      const serviceToSave = {
        ...editingService,
        categorie: editingService.categorie.join(',')
      };
      console.log('Submitting service:', serviceToSave);
      onSave(serviceToSave);
    };
    
    React.useImperativeHandle(ref, () => ({
      handleSubmit
    }));
  
    return (
      <form onSubmit={handleSubmit} className={styles.editForm}>
  <CustomInput
    style="standard"
    name="name"
    value={editingService.name || ''}
    onChange={handleChange}
    placeholder="Service Name"
    required
    wid="100%"
  />
  <CustomInput
    style="standard"
    name="image"
    value={editingService.image || ''}
    onChange={handleChange}
    placeholder="Image URL"
    required
    wid="100%"
  />
  
        <CustomInput
          style="standard"
          name="price"
          type="number"
          value={editingService.price || ''}
          onChange={handleChange}
          placeholder="Price"
          required
          wid="100%"
        />
        
        <div className={styles.borderPricesContainer}>
          {editingService.plans.map((plan, index) => (
            <div className={styles.borderPrices} key={index}>
              <div className={styles.borderHover}></div>
              <div className={styles.borderPricesContent}>
                <p>${plan.price}</p>
              </div>
              <div className={styles.icons}>
                <button type="button" onClick={() => handlePlanEdit(index)}>
                  <PenOff />
                </button>
                <button type="button" onClick={() => handlePlanDelete(index)}>
                  <Trash2 />
                </button>
              </div>
            </div>
          ))}
          <div className={styles.borderPrices} onClick={handleAddPlan}>
            <div className={styles.borderPricesContent}>
              <Plus />
            </div>
          </div>
        </div>
  
        <CustomInput
          style="multiline"
          name="description"
          value={editingService.description || ''}
          onChange={handleChange}
          placeholder="Description"
          required
          wid="100%"
        />
        <CustomInput
          style="standard"
          name="categorie"
          value={Array.isArray(editingService.categorie) ? editingService.categorie.join(',') : editingService.categorie || ''}
          onChange={handleCategorieChange}
          placeholder="Categories (comma-separated)"
          required
          wid="100%"
        />
      </form>
    );
  });