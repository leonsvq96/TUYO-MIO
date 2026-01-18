// Respuesta base de la API
const indexController = (req, res) => {
    res.status(200).json({ message: "Welcome to the API" });
};

export default indexController;