const Pedido = require('../models/Pedido');
const Producto = require('../models/Producto');

exports.crearPedido = async (req, res) => {
    try {
        const { cliente, articulos, envioTipo } = req.body;

        if (!articulos || articulos.length === 0) {
            return res.status(400).json({ msg: 'No hay artículos en el pedido' });
        }

        let totalCalculado = 0;
        
        for (const item of articulos) {
            const productoDB = await Producto.findById(item.producto);
            if (!productoDB) {
                return res.status(404).json({ msg: `Producto ${item.producto} no existe` });
            }

            if (productoDB.stockActual < item.cantidad) {
                return res.status(400).json({ msg: `Stock insuficiente para ${productoDB.nombreP}` });
            }

            productoDB.stockActual -= item.cantidad;
            await productoDB.save();

            totalCalculado += item.precioUnitario * item.cantidad;
        }

        const nuevoPedido = new Pedido({
            cliente,
            articulos,
            total: totalCalculado,
            envio: {
                tipo: envioTipo,
                estado_entrega: 'PREPARACION'
            }
        });

        nuevoPedido.pago.id_transaccion = "SIM-PAY-" + Math.random().toString(36).substr(2, 9);
        
        await nuevoPedido.save();

        res.status(201).json(nuevoPedido);

    } catch (error) {
        console.log(error);
        res.status(500).send('Hubo un error al procesar el pedido');
    }
};

exports.obtenerPedidosCliente = async (req, res) => {
    try {
        const pedidos = await Pedido.find({ cliente: req.params.clienteId })
                                    .populate('cliente', 'nombre email')
                                    .sort({ fechaPedido: -1 });
        res.json(pedidos);
    } catch (error) {
        res.status(500).send('Error al obtener pedidos');
    }
};

exports.actualizarLogistica = async (req, res) => {
    try {
        const { tracking_number, estado_entrega } = req.body;       
        const pedido = await Pedido.findByIdAndUpdate(
            req.params.id,
            { 
                'envio.tracking_number': tracking_number,
                'envio.estado_entrega': estado_entrega 
            },
            { new: true }
        );

        res.json(pedido);
    } catch (error) {
        res.status(500).send('Error al actualizar logística');
    }
};

exports.obtenerTodosLosPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find()
                                    .populate('cliente', 'nombre email rol')
                                    .sort({ fechaPedido: -1 });
        res.json(pedidos);
    } catch (error) {
        res.status(500).send('Error al obtener el historial de pedidos');
    }
};