import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { LogOut, Upload, FileText, Download, Trash2, } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { hasPermission } from '@/data/users';
import PageHeader from '@/components/layout/PageHeader';
import LogoutDialog from '@/components/modals/LogoutDialog';
import AccessDeniedModal from '@/components/modals/AccessDeniedModal';
import '@/styles/overview/presentacion-inicial.css';

interface PdfFile {
  id: string;
  name: string;
  size: number;
  uploadDate: Date;
  url: string;
}

const PresentacionInicialPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const [clientName, setClientName] = useState('');
  const [pdfFile, setPdfFile] = useState<PdfFile | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [showAccessDeniedModal, setShowAccessDeniedModal] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() =>
    document.body.classList.contains('dark-theme')
  );
  const { user } = useAuthStore();

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

  // Listen for theme changes
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.body.classList.contains('dark-theme'));
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    // Get client name from location state if available
    const state = location.state as { clientName?: string };
    if (state?.clientName) {
      setClientName(state.clientName);
    }
  }, [location]);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Verificar permisos al cargar la página
  useEffect(() => {
    if (user && !hasPermission(user, 'edit_presentacion')) {
      setShowAccessDeniedModal(true);
    }
  }, [user]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      handlePdfFile(selectedFile);
    } else {
      alert('Por favor selecciona solo archivos PDF');
    }
  };

  const handlePdfFile = (file: File) => {
    const newPdf: PdfFile = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      size: file.size,
      uploadDate: new Date(),
      url: URL.createObjectURL(file)
    };

    setPdfFile(newPdf);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type === 'application/pdf') {
      handlePdfFile(droppedFile);
    } else {
      alert('Por favor arrastra solo archivos PDF');
    }
  };

  const handleDeletePdf = () => {
    if (pdfFile?.url) {
      URL.revokeObjectURL(pdfFile.url);
    }
    setPdfFile(null);
  };

  const handleDownloadPdf = () => {
    if (pdfFile?.url) {
      const link = document.createElement('a');
      link.href = pdfFile.url;
      link.download = pdfFile.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`presentacion-inicial-page ${isDarkMode ? 'dark-theme' : 'light-theme'}`}>
      <PageHeader
        title="Presentación inicial"
        subtitle={clientName ? clientName.split(' - ')[0] : 'Cliente'}
        showBackButton={false}
        showTitle={true}
        showSubtitle={true}
        showLogo={true}
        breadcrumbs={[
          { label: 'Menú', onClick: () => navigate('/dashboard') },
          { label: 'Overview', onClick: () => navigate('/overview-menu') },
          { label: 'Configuración', onClick: () => navigate('/overview') },
          { label: 'Seleccionar', onClick: () => navigate('/seleccionar-cuenta') },
          { label: clientName ? clientName.split(' - ')[0] : 'Cliente', onClick: () => navigate('/cliente-dashboard', { state: { clientName } }) },
        ]}
        isDarkMode={isDarkMode}
        onThemeToggle={handleThemeToggle}
        showUserAvatar={true}
        showUserName={true}
      />

      <div className={`presentacion-content ${isVisible ? 'visible' : ''}`}>
        <div className="content-layout">
          {/* PDF Viewer Area - 70% */}
          <div className="pdf-viewer-area">
            {pdfFile ? (
              <div className="pdf-viewer-container">
                <div className="pdf-viewer-header">
                  <div className="pdf-info">
                    <FileText size={20} className="pdf-icon" />
                    <div className="pdf-details">
                      <h3>{pdfFile.name}</h3>
                      <p>{formatFileSize(pdfFile.size)} • {pdfFile.uploadDate.toLocaleDateString('es-ES')}</p>
                    </div>
                  </div>
                  <div className="pdf-actions">
                    <button
                      className="pdf-action-btn download-btn"
                      onClick={handleDownloadPdf}
                      title="Descargar"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      className="pdf-action-btn delete-btn"
                      onClick={handleDeletePdf}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                <div className="pdf-viewer">
                  <iframe
                    src={`${pdfFile.url}#toolbar=1&navpanes=0&scrollbar=1&page=1&view=FitH&zoom=100`}
                    className="pdf-iframe"
                    title="PDF Viewer"
                  />
                </div>
              </div>
            ) : (
              <div className="empty-viewer">
                <FileText size={64} className="empty-icon" />
                <h3>No hay presentación cargada</h3>
                <p>Sube un archivo PDF para visualizarlo aquí</p>
              </div>
            )}
          </div>

          {/* Upload Area - 30% */}
          <div className="pdf-upload-section">
            <div
              className={`upload-area ${isDragOver ? 'drag-over' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <div className="upload-icon">
                <Upload size={32} />
              </div>
              <h3>Cargar presentación</h3>
              <p>Arrastra un PDF aquí o haz clic</p>
              <div className="upload-formats">
                <span>Solo archivos PDF</span>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="file-input"
              />
            </div>

            {pdfFile && (
              <div className="current-file-info">
                <h4>Archivo actual</h4>
                <div className="file-card">
                  <div className="file-card-icon">
                    📄
                  </div>
                  <div className="file-card-info">
                    <div className="file-card-name">{pdfFile.name}</div>
                    <div className="file-card-meta">
                      {formatFileSize(pdfFile.size)}
                    </div>
                  </div>
                  <button
                    className="file-card-delete-btn"
                    onClick={handleDeletePdf}
                    title="Eliminar archivo"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <button
        className="logout-button"
        onClick={() => setShowLogoutDialog(true)}
        style={{
          position: 'fixed',
          bottom: '2rem',
          right: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          padding: '0.5rem 1rem',
          borderRadius: '20px',
          fontSize: '0.875rem',
          cursor: 'pointer',
          zIndex: 10,
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          ...(isDarkMode ? {
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: 'rgba(255, 255, 255, 0.7)'
          } : {
            background: 'rgba(253, 253, 254, 0.95)',
            color: '#0171E2',
            border: '2px solid #0171E2',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
          })
        }}
      >
        <LogOut size={16} />
        <span>Cerrar sesión</span>
      </button>

      <LogoutDialog
        isOpen={showLogoutDialog}
        onClose={() => setShowLogoutDialog(false)}
      />

      <AccessDeniedModal
        isOpen={showAccessDeniedModal}
        onClose={() => {
          setShowAccessDeniedModal(false);
          navigate('/cliente-dashboard', { state: { clientName } });
        }}
        featureName="Presentación Inicial"
      />
    </div>
  );
};

export default PresentacionInicialPage;