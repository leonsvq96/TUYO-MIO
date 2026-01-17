const indexController = (req, res) => {
    res.status(200).json({ message: "Welcome to the API" });
};

export default indexController;