import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useChecklistLogic } from '@/components/ChecklistCaptura/useChecklistLogic';
import PageHeader from '@/components/layout/PageHeader';
import ChecklistTableContainer from '@/components/ChecklistCaptura/ChecklistTableContainer';
import LogoutButton from '@/components/ChecklistCaptura/LogoutButton';
import DeleteConfirmationModal from '@/components/modals/DeleteConfirmationModal';
import AccessDeniedModal from '@/components/modals/AccessDeniedModal';
import InputModal from '@/components/modals/InputModal';
import { User } from '@/data/users';
import { storage } from '@/utils/storage';
import '@/styles/overview/eho.css';

const EHOPage: React.FC = () => {
  const navigate = useNavigate();

  const {
    // State
    isVisible,
    clientName,
    checklistItems,
    users,
    itemToDelete,
    showLogoutDialog,
    showAccessDeniedModal,
    taskAssignments,
    dueDates,
    modalState,
    currentUser,
    groupedItems,
    orderedSections,

    // Setters
    setItemToDelete,
    setShowLogoutDialog,
    setShowAccessDeniedModal,

    // Functions
    toggleItemCompletion,
    handleDeleteItem,
    confirmDelete,
    openModal,
    closeModal,
    getFieldValue,
    handleUserAssignment,
    handleDueDateChange,
    hasPermission
  } = useChecklistLogic();

  // Get theme from body class and manage state
  const [isDarkMode, setIsDarkMode] = React.useState(() =>
    document.body.classList.contains('dark-theme')
  );

  const handleThemeToggle = () => {
    if (isDarkMode) {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    } else {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    }
    setIsDarkMode(!isDarkMode);
  };

  // Wrapper function for hasPermission that handles null users
  const hasPermissionWrapper = (user: User | null, permission: string) => {
    return user ? hasPermission(user, permission) : false;
  };

  return (
    <div className={`checklist-captura-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <PageHeader
        title="Checklist de captura"
        subtitle={clientName}
        showBackButton={false}
        showTitle={true}
        showSubtitle={true}
        showLogo={true}
        breadcrumbs={[
          { label: 'Menú', onClick: () => navigate('/dashboard') },
          { label: 'Overview', onClick: () => navigate('/overview-menu') },
          { label: 'Configuración', onClick: () => navigate('/overview') },
          { label: 'Seleccionar', onClick: () => navigate('/seleccionar-cuenta') },
          { label: clientName ? clientName.split(' - ')[0] : '', onClick: () => navigate('/cliente-dashboard', { state: { clientName } }) }
        ]}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        showUserAvatar={true}
        showUserName={true}
      />

      <LogoutButton
        showLogoutDialog={showLogoutDialog}
        setShowLogoutDialog={setShowLogoutDialog}
        taskAssignments={taskAssignments}
        isDarkMode={isDarkMode}
        storage={storage}
      />

      <div className={`checklist-content ${isVisible ? 'visible' : ''}`}>
        <ChecklistTableContainer
          orderedSections={orderedSections}
          groupedItems={groupedItems}
          users={users}
          dueDates={dueDates}
          currentUser={currentUser}
          hasPermission={hasPermissionWrapper}
          toggleItemCompletion={toggleItemCompletion}
          handleDeleteItem={handleDeleteItem}
          handleUserAssignment={handleUserAssignment}
          handleDueDateChange={handleDueDateChange}
          getFieldValue={getFieldValue}
          openModal={openModal}
        />
      </div>

      <InputModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        onSave={modalState.onSave}
        initialValue={modalState.initialValue}
        fieldName={modalState.fieldName}
        fieldType={modalState.fieldType}
        selectOptions={modalState.selectOptions}
      />

      <DeleteConfirmationModal
        isOpen={itemToDelete !== null}
        onClose={() => setItemToDelete(null)}
        onConfirm={confirmDelete}
        itemName={checklistItems.find(item => item.id === itemToDelete)?.concept || 'este elemento'}
      />

      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => setShowAccessDeniedModal(false)}
        featureName="Edición de Checklist"
      />
    </div>
  );
};

export default EHOPage;