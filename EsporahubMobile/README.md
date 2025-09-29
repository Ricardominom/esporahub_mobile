# 📱 Esporahub Mobile

> **Aplicación móvil para la gestión integral de campañas políticas**

Esporahub Mobile es la versión nativa para dispositivos móviles de la plataforma Esporahub, desarrollada con React Native y Expo. Permite a los usuarios gestionar campañas políticas, tareas y cuentas desde cualquier lugar.

## 🌟 Características principales

### 📱 Experiencia móvil nativa
- **Interfaz optimizada** para iOS y Android
- **Navegación fluida** con transiciones nativas
- **Gestos intuitivos** siguiendo las guías de diseño de cada plataforma
- **Rendimiento optimizado** para dispositivos móviles

### 🔐 Autenticación segura
- **Login biométrico** (próximamente)
- **Gestión de sesiones** con AsyncStorage
- **Roles y permisos** sincronizados con la web

### 🎯 Funcionalidades core
- **Dashboard Overview** con métricas en tiempo real
- **WorkHub móvil** para gestión de tareas
- **Gestión de cuentas** políticas
- **Checklist EHO** optimizado para móvil
- **Sincronización** con la plataforma web

## 🚀 Stack tecnológico

### Framework y Runtime
- **React Native 0.74.5** - Framework nativo multiplataforma
- **Expo SDK 51** - Herramientas de desarrollo y deployment
- **TypeScript 5.1.3** - Tipado estático para desarrollo robusto

### Navegación y Estado
- **React Navigation 6** - Navegación nativa con stack y tabs
- **Zustand 4.4.7** - Gestión de estado global ligera
- **AsyncStorage** - Persistencia de datos local

### UI/UX y Diseño
- **Expo Linear Gradient** - Gradientes nativos
- **Expo Blur** - Efectos de desenfoque
- **Vector Icons** - Iconografía consistente
- **Safe Area Context** - Manejo de áreas seguras

### Desarrollo y Calidad
- **TypeScript estricto** - Tipado completo
- **Expo Font** - Tipografías personalizadas
- **React Native Reanimated** - Animaciones fluidas

## 📁 Arquitectura móvil

```
src/
├── components/           # Componentes reutilizables
│   ├── ui/              # Componentes base de UI
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Header.tsx
│   └── ProtectedRoute.tsx
├── constants/           # Constantes de la app
│   ├── Colors.ts       # Sistema de colores
│   └── Fonts.ts        # Tipografías
├── screens/            # Pantallas principales
│   ├── auth/           # Autenticación
│   │   └── LoginScreen.tsx
│   ├── menu/           # Menú principal
│   │   └── MenuScreen.tsx
│   ├── overview/       # Dashboard
│   │   └── OverviewScreen.tsx
│   ├── workhub/        # Centro de trabajo
│   │   └── WorkHubScreen.tsx
│   ├── accounts/       # Gestión de cuentas
│   │   └── AccountsScreen.tsx
│   ├── checklist/      # Checklist EHO
│   │   └── ChecklistScreen.tsx
│   └── LandingScreen.tsx
├── stores/             # Estados globales
│   ├── authStore.ts
│   └── themeStore.ts
├── types/              # Definiciones TypeScript
│   ├── index.ts
│   └── navigation.ts
└── utils/              # Utilidades
    └── storage.ts
```

## 🛠️ Instalación y desarrollo

### Requisitos previos
- **Node.js** 18.x o superior
- **Expo CLI** instalado globalmente
- **iOS Simulator** (para desarrollo iOS)
- **Android Studio** (para desarrollo Android)

### Instalación rápida

1. **Navegar al directorio móvil**
   ```bash
   cd EsporahubMobile
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Iniciar el servidor de desarrollo**
   ```bash
   npm start
   ```

4. **Ejecutar en dispositivo/simulador**
   ```bash
   # iOS
   npm run ios
   
   # Android
   npm run android
   
   # Web (para testing)
   npm run web
   ```

### Desarrollo con Expo Go

1. **Instalar Expo Go** en tu dispositivo móvil
2. **Escanear el QR** que aparece en la terminal
3. **Desarrollo en tiempo real** con Hot Reload

## 📱 Características específicas móviles

### 🎨 Sistema de diseño nativo

- **Apple Design System** para iOS
- **Material Design** para Android
- **Temas dinámicos** (claro/oscuro/automático)
- **Tipografías nativas** (SF Pro Display)
- **Iconografía consistente** con Ionicons

### 🔄 Sincronización de datos

- **AsyncStorage** para persistencia local
- **Estado global** con Zustand
- **Sincronización** con backend (próximamente)
- **Modo offline** básico

### 📊 Funcionalidades optimizadas

- **Dashboard táctil** con cards interactivas
- **Listas optimizadas** con RefreshControl
- **Formularios móviles** con validación
- **Navegación por gestos** nativa

## 🚀 Scripts disponibles

```bash
# Desarrollo
npm start              # Iniciar Expo Dev Server
npm run ios           # Ejecutar en iOS Simulator
npm run android       # Ejecutar en Android Emulator
npm run web           # Ejecutar en navegador web

# Build y deployment
expo build:ios        # Build para iOS
expo build:android    # Build para Android
expo publish          # Publicar actualización OTA
```

## 📦 Estructura de componentes

### Componentes base (UI)
- **Button** - Botón con variantes y estados
- **Card** - Tarjeta con blur y sombras
- **Header** - Cabecera con navegación

### Pantallas principales
- **LandingScreen** - Pantalla de bienvenida
- **LoginScreen** - Autenticación con cuentas demo
- **MenuScreen** - Menú principal con grid de apps
- **OverviewScreen** - Dashboard con métricas
- **WorkHubScreen** - Gestión de tareas
- **AccountsScreen** - Gestión de cuentas
- **ChecklistScreen** - Checklist EHO móvil

## 🎯 Roadmap móvil

### ✅ **Completado** (v1.0)
- Estructura base con React Native + Expo
- Sistema de autenticación móvil
- Navegación nativa con React Navigation
- Temas dinámicos (claro/oscuro)
- Pantallas principales adaptadas
- Componentes UI base

### 🚧 **En desarrollo** (v1.1)
- Notificaciones push
- Sincronización con backend
- Modo offline completo
- Autenticación biométrica
- Cámara para documentos

### 🔮 **Próximas versiones** (v1.2+)
- Geolocalización para eventos
- Chat en tiempo real
- Widgets para pantalla de inicio
- Apple Watch / Wear OS support
- Realidad aumentada

## 🔧 Configuración avanzada

### Variables de entorno
```bash
# .env
API_BASE_URL=https://api.esporahub.com
EXPO_PUBLIC_API_KEY=your_api_key
```

### Configuración de build
```javascript
// app.config.js
export default {
  expo: {
    name: "Esporahub Mobile",
    slug: "esporahub-mobile",
    version: "1.0.0",
    // ... más configuraciones
  },
};
```

## 📱 Compatibilidad

### Plataformas soportadas
- **iOS** 13.0+ ✅
- **Android** API 21+ (Android 5.0) ✅
- **Web** (para desarrollo) ✅

### Dispositivos optimizados
- **iPhone** 12 Pro y superiores
- **iPad** con soporte completo
- **Android** flagship devices
- **Tablets Android** 10"+ 

## 🤝 Desarrollo colaborativo

### Flujo de trabajo
1. **Feature branches** desde main
2. **Testing** en Expo Go
3. **Review** de código
4. **Merge** y deployment

### Estándares de código
- **TypeScript estricto** obligatorio
- **Componentes funcionales** con hooks
- **Naming conventions** consistentes
- **Comentarios** en español

## 📄 Licencia

Este proyecto móvil es **propiedad intelectual exclusiva de Esporadix Team**.

**© 2025 Esporadix Team. Todos los derechos reservados.**

---

<div align="center">

**Desarrollado con ❤️ por el equipo de Esporadix**

[![React Native](https://img.shields.io/badge/React_Native-0.74.5-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-51.0.28-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.1.3-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

</div>