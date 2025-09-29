import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginButton from '@/components/generals/LoginButton';
import Logo from '@/components/layout/Logo';
import MeltingText from '@/components/generals/MeltingText';
import '@/styles/landing/landing.css';

const Header: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setIsVisible(true);
    // Force dark mode on landing page
    document.body.classList.remove('light-theme');
    document.body.classList.add('dark-theme');
  }, []);

  // Verificar si hay una sesión activa
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Si hay una sesión activa, redirigir al dashboard
      navigate('/dashboard');
    }
  }, [navigate]);

  return (
    <header className="header dark-theme">
      {/* <FlowEffect /> */} {/* Temporalmente deshabilitado */}
      <div className="absolute top-8 left-8 z-10">
        <Logo />
      </div>
      <div className={`overlay ${isVisible ? 'visible' : ''}`}>
        <div className="content">
          <h1 className="title">
            <MeltingText text="esporahub" />
          </h1>
          <LoginButton />
        </div>
      </div>
    </header>
  );
};

export default Header;