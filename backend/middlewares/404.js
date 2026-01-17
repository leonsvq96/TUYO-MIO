const notFound = (req, res, next) => {
    res.status(404).json({ 
        error: "Not Found", 
        message: `La ruta ${req.originalUrl} no existe` 
    });
};

export default notFound;