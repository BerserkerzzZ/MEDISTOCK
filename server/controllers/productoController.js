const Producto = require("../models/Producto");


exports.crearProducto = async (req, res) => {
    try {
        let producto;

        producto=new Producto(req.body);

        await producto.save();
        res.send(producto);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.listarProducto = async (req, res) => {
    try {

        const productos = await Producto.find();
        res.json(productos)
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}

exports.actualizarProducto = async (req, res) => {
    try {
        const { 
            nombreP, 
            codigoBarra, 
            stocks,
            precioP, 
            descripcionP, 
            imgP, 
            isCritico, 
            categoria 
        } = req.body;

        let producto = await Producto.findById(req.params.id);

        if (!producto) {
            return res.status(404).json({ msg: 'El producto no existe' });
        }

        const nuevosDatos = {
            nombreP,
            codigoBarra,
            stocks, 
            precioP,
            descripcionP,
            imgP,
            isCritico,
            categoria,
            fechaActualizacion: Date.now() 
        };

        const productoActualizado = await Producto.findOneAndUpdate(
            { _id: req.params.id }, 
            nuevosDatos, 
            { new: true }
        );

        res.json(productoActualizado);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al actualizar el producto');
    }
}

exports.obtenerProducto = async (req, res) => {
    try {

        let producto = await Producto.findById(req.params.id);

        if(!producto) {
            res.status(404).json({msg: 'El producto no existe'})
        }

        res.json(producto);
        
    } catch (error) {
        console.log(error);
        res.status(500).send('pipipi');
    }
}

exports.eliminarProducto = async (req, res) => {
    try {

        let producto = await Producto.findById(req.params.id);

        if(!producto) {
            res.status(404).json({msg: 'El producto no existe'})
        }

        await Producto.findByIdAndDelete({ _id: req.params.id})
        res.json({ msg: 'producto eliminado'})
        
    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error');
    }
}