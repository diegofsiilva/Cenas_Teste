import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase
// IMPORTANTE: Substitua estas credenciais pelas suas próprias do Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyDEMO_KEY_REPLACE_WITH_YOUR_OWN",
  authDomain: "cenas-bar-pdv.firebaseapp.com",
  projectId: "cenas-bar-pdv",
  storageBucket: "cenas-bar-pdv.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;

