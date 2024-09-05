import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('debe renderizar el componente App correctamente', () => {
  render(<App />); // Renderiza el componente App

  // Verifica que un elemento esperado en la pantalla (puede ser un título, botón, texto, etc.) está presente
  // Asegúrate de que estás buscando algo que realmente exista en tu componente App.
  const linkElement = screen.getByText(/bienvenido/i); // Cambia 'bienvenido' por el texto de tu App

  // Comprueba que el elemento está en el documento
  expect(linkElement).toBeInTheDocument();
});
