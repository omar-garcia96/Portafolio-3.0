/* PostCSS procesa el CSS antes de enviarlo al navegador.
   - tailwindcss : genera las clases utilitarias
   - autoprefixer: agrega prefijos (-webkit-, etc.) para compatibilidad */
const config = {
  plugins: { tailwindcss: {}, autoprefixer: {} },
};

export default config;
