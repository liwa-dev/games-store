// UserManagement.js
import React, { useState, useEffect, useRef } from 'react';
import styles from './UserManagement.module.css';
import Button from '../libs/Button';
import { useModal } from '../provider/ModalProvider';
import CustomInput from '../libs/CustomInput';
import { getUsers } from '../supabase/getData';
import { addUser, updateUser, deleteUser } from '../supabase/setData';
import {useNotification} from '../provider/NotificationProvider';



const UserForm = React.forwardRef(({ user, onSave }, ref) => {
  const [editingUser, setEditingUser] = useState({
    ...user,
    role: user.role ? 
      (Array.isArray(user.role) ? user.role.join(',') : user.role) 
      : '',
    're-password': '' // Initialize re-password field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingUser(prev => ({...prev, [name]: value}));
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
  
    if (editingUser.password !== editingUser['re-password']) {
      alert('Passwords do not match');
      return;
    }
  
    const userToSave = {
      ...editingUser,
      role: editingUser.role // Now it's already a string
    };
  
    onSave(userToSave);
  };

  React.useImperativeHandle(ref, () => ({
    handleSubmit
  }));

  return (
    <form onSubmit={handleSubmit} className={styles.editForm}>
      <CustomInput
        style="standard"
        name="username"
        value={editingUser.username || ''}
        onChange={handleChange}
        placeholder="Username"
        required
        wid="100%"
      />
      <CustomInput
        style="standard"
        name="email"
        type="email"
        value={editingUser.email || ''}
        onChange={handleChange}
        placeholder="Email"
        required
        wid="100%"
      />
      <CustomInput
        style="standard"
        name="password"
        type="password"
        value={editingUser.password || ''}
        onChange={handleChange}
        placeholder="Password"
        required={!editingUser.id}
        wid="100%"
      />
      <CustomInput
        style="standard"
        name="re-password"
        type="password"
        value={editingUser.password || ''}
        onChange={handleChange}
        placeholder="Re-enter Password"
        required={!editingUser.id}
        wid="100%"
      />
      <CustomInput
        style="standard"
        name="role"
        value={editingUser.role || ''}
        onChange={handleChange}
        placeholder="Role (comma-separated)"
        wid="100%"
      />
    </form>
  );
});




const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const { openModal, closeModal } = useModal();
  const formRef = useRef();
  const { notifySuccess, notifyError, notifyWarning } = useNotification();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        const cleanedData = data.map(user => ({
          ...user,
          role: user.role ? (Array.isArray(user.role) ? user.role : user.role.split(',').map(role => role.trim()).filter(role => role !== '')) : []
        }));
        setUsers(cleanedData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleEdit = (user) => {
    openModal(
      <UserForm
        ref={formRef}
        user={user}
        onSave={handleSave}
      />,
      {
        title: 'Edit User',
        showOk: true,
        showCancel: true,
        onOk: () => {
          formRef.current.handleSubmit();
        }
      }
    );
  };

  const handleDelete = async (userId) => {
    openModal(
      <p>Are you sure you want to delete this user?</p>,
      {
        title: 'Confirm Deletion',
        showOk: true,
        showCancel: true,
        onOk: async () => {
          try {
            await deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
            notifySuccess('User deleted successfully');
            closeModal();
          } catch (error) {
            notifyError('Failed to delete user');
            console.error('Error deleting user:', error);
          }
        }
      }
    );
  };

  const handleSave = async (editedUser) => {
    try {
      const userToSave = {
        ...editedUser,
        role: editedUser.role.trim() // Ensure role is trimmed
      };

      if (editedUser.id) {
        // Update existing user logic remains the same
      } else {
        // Add new user
        const response = await addUser(userToSave);
        if (response && response.length > 0) {
          setUsers(prevUsers => [...prevUsers, response[0]]);
          notifySuccess('User added successfully');
          closeModal();
        } else {
          // If no data is returned, fetch the users again
          const updatedUsers = await getUsers();
          setUsers(updatedUsers);
          notifySuccess('User added successfully, refreshing user list');
          closeModal();
        }
      }
    } catch (error) {
      notifyError(`Failed to save user: ${error.message}`);
      console.error('Error saving user:', error);
    }
  };



  const handleAddNew = () => {
    const newUser = {
      id: null,
      username: '',
      email: '',
      fullName: '',
      role: []
    };
    openModal(
      <UserForm
        ref={formRef}
        user={newUser}
        onSave={handleSave}
      />,
      {
        title: 'Add New User',
        showOk: true,
        showCancel: true,
        onOk: () => {
          formRef.current.handleSubmit();
        }
      }
    );
  };

  return (
    <div className={styles.container}>
      <h2>User Management</h2>
      <Button color="blue" onClick={handleAddNew}>Add New User</Button>
      <ul className={styles.userList}>
        {users.map(user => (
          <li key={user.id} className={styles.userItem}>
            <div className={styles.userInfo}>
              <h3>{user.username}</h3>
              <p>Email: {user.email}</p>
              <p>Full Name: {user.fullName || user.username || 'Not Provided'}</p>
              <p>Role: {Array.isArray(user.role) ? user.role.join(', ') : user.role || 'No Role'}</p>
            </div>
            <div className={styles.userActions}>
              <Button color="yellow" onClick={() => handleEdit(user)}>Edit</Button>
              <Button color="red" onClick={() => handleDelete(user.id)}>Delete</Button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};



export default UserManagement;