import morgan from 'morgan';

// Configuración de morgan con formato personalizado
const logger = morgan(':method :url :status :res[content-length] - :response-time ms - :remote-addr');

export default logger;