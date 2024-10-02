// adminMiddleware.js

const verifyAdmin = (req, res, next) => {
    if (req.role !== 'admin') {
        return res.status(403).json('Acceso denegado: Solo los administradores pueden realizar esta acción');
    }
    next();
};

module.exports = verifyAdmin;
