const internalServerError = (err, req, res, next) => {
    // En producción, no mostrar detalles del error
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    res.status(err.status || 500).json({
        error: "Internal Server Error",
        message: isDevelopment ? err.message : "Ha ocurrido un error inesperado en el servidor",
        ...(isDevelopment && { stack: err.stack })
    });
};

export default internalServerError;