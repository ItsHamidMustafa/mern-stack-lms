const Program = require('../models/Program');

const createProgram = async (req, res) => {
    const { name, departmentId, duration } = req.body;

    try {
        const program = await Program.create({ name, departmentId, duration });
        res.status(201).json(program);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const fetchAllPrograms = async (req, res) => {
    const programs = await Program.find().populate('departmentId');
    res.status(200).json(programs);
};

const fetchProgramsByDepartment = async (req, res) => {
    const { departmentId } = req.params;
    const programs = await Program.find({ departmentId: departmentId });
    res.status(200).json(programs);
};

const deleteProgram = async (req, res) => {
    const { id } = req.params;
    try {
        await Program.findByIdAndDelete(id);
        res.status(200).json({ msg: 'Program deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { createProgram, fetchAllPrograms, fetchProgramsByDepartment, deleteProgram };