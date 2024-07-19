import React, { useEffect, useState, useCallback } from 'react';
import styles from '../styles/HeaderControl.module.css';
import Button from '../libs/Button';
import CustomInput from '../libs/CustomInput';
import { Trash2, Plus, GripVertical, Undo } from 'lucide-react';
import { useModal } from '../provider/ModalProvider';

export default function HeaderControl({ headerConfig, setHeaderConfig }) {
  const { openModal } = useModal();
  const [newCategory, setNewCategory] = useState({ name: '', path: '' });
  const [removedCategories, setRemovedCategories] = useState([]);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    console.log('Current headerConfig:', headerConfig);
  }, [headerConfig]);

  const addCategory = useCallback(() => {
    if (newCategory.name && newCategory.path) {
      setHeaderConfig(prev => ({
        ...prev,
        categories: [...prev.categories, { ...newCategory, id: `category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` }]
      }));
      setNewCategory({ name: '', path: '' });
    } else {
      console.log('Category name or path is missing');
    }
  }, [newCategory, setHeaderConfig]);

  const openAddCategoryModal = () => {
    openModal(
      <div className={styles.modalCategory}>
        <h2>Add Category</h2>
        <CustomInput
          style="fading"
          value={newCategory.name}
          onChange={(e) => setNewCategory(prev => ({ ...prev, name: e.target.value }))}
          placeholder="Category Name"
          wid={"100%"}
        />
        <CustomInput
          style="fading"
          value={newCategory.path}
          onChange={(e) => setNewCategory(prev => ({ ...prev, path: e.target.value }))}
          placeholder="Category Path"
          wid={"100%"}
        />
      </div>,
      {
        showCancel: true,
        showOk: true,
        onOk: () => {
          addCategory();
          return true;
        }
      }
    );
  };

  const removeCategory = useCallback((id) => {
    setHeaderConfig(prev => {
      const index = prev.categories.findIndex(cat => cat.id === id);
      if (index === -1) return prev;
      const newCategories = [...prev.categories];
      const [removedCategory] = newCategories.splice(index, 1);
      setRemovedCategories(prevRemoved => [...prevRemoved, { ...removedCategory, originalIndex: index }]);
      return { ...prev, categories: newCategories };
    });
  }, [setHeaderConfig]);

  const undoRemove = useCallback((id) => {
    const removedCategoryIndex = removedCategories.findIndex(cat => cat.id === id);
    if (removedCategoryIndex === -1) return;

    const removedCategory = removedCategories[removedCategoryIndex];
    
    setHeaderConfig(prev => {
      const newCategories = [...prev.categories];
      newCategories.splice(removedCategory.originalIndex, 0, removedCategory);
      return { ...prev, categories: newCategories };
    });

    setRemovedCategories(prev => prev.filter(cat => cat.id !== id));
  }, [removedCategories, setHeaderConfig]);

  const onDragStart = (e, index) => {
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = "move";
    e.target.style.opacity = '0.5';
  };

  const onDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
  };

  const onDragOver = useCallback((e, index) => {
    e.preventDefault();
    const draggedOverItem = index;

    if (draggedItem === draggedOverItem) return;

    setHeaderConfig(prev => {
      const newCategories = [...prev.categories];
      const draggedItemContent = newCategories[draggedItem];
      newCategories.splice(draggedItem, 1);
      newCategories.splice(draggedOverItem, 0, draggedItemContent);
      return { ...prev, categories: newCategories };
    });

    setDraggedItem(draggedOverItem);
  }, [draggedItem, setHeaderConfig]);

  return (
    <div className={styles.headerControl}>
      <h2>Control Header Categories</h2>
      <p className={styles.dragInstructions}>To reorder categories, click and drag the <GripVertical size={16} /> icon.</p>
      <div className={styles.categoriesList}>
        {headerConfig.categories.map((category, index) => (
          <div
            key={category.id}
            className={`${styles.categoryWrapper} ${draggedItem === index ? styles.dragging : ''}`}
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            onDragOver={(e) => onDragOver(e, index)}
          >
            <div className={styles.categoryItem}>
              <div className={styles.categoryInfo}>
                <div className={styles.dragHandleWrapper}>
                  <GripVertical size={16} className={styles.dragHandle} />
                </div>
                <span>{category.name} - {category.path}</span>
              </div>
              <div className={styles.categoryActions}>
                <Button color="red" onClick={() => removeCategory(category.id)}>
                  <Trash2 size={16} />
                  Remove
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.controlActions}>
        <Button color="blue" onClick={openAddCategoryModal}>
          <Plus size={16} />
          Add Category
        </Button>
      </div>
      {removedCategories.length > 0 && (
        <div className={styles.removedCategories}>
          <h3>Removed Categories</h3>
          {removedCategories.map((category) => (
            <div key={category.id} className={styles.removedCategoryItem}>
              <span>{category.name} - {category.path}</span>
              <Button color="green" onClick={() => undoRemove(category.id)}>
                <Undo size={16} />
                Undo
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}