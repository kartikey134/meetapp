const Room = require('../models/roomModel');

const add = async(req, res) => {
    try {
        const {name} = req.body;
        const createdBy = req.user.id;
        const roomExists = await Room.find({name});
        if (roomExists.length > 0) {
            return res.status(500).json({message: "Room already exists", success: true});
        }
        const room = new Room({
            name: name,
            createdBy: createdBy
        });
        await room.save();
        return res.status(200).json({ message: "Room Created", success: true });
    } catch (err) {
        return res.status(500).json({message: "Internal Server Error", success: false});
    }
};

const remove = async(req, res) => {
    try {
        const {id} = req.body;
        let room = await Room.findById(id);
        if (room) {
            await Room.deleteOne({_id: id});
            return res.status(200).json({message: "Room removed", success: true});
        } else {
            return res.status(200).json({message: "No room exists with such id", success: false});
        }
        
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: "Internal Server Error", success: false});
    }
};

const getRooms = async(req, res) => {
    try {
        const rooms = await Room.find({}).populate([
            {
                path: "createdBy",
            },
        ]);
        return res.status(200).json({message: "Room fetched", rooms, success: true});
    } catch (err) {
        return res.status(500).json({message: "Internal Server Error", success: false});
    }
};

module.exports = {add, remove, getRooms};