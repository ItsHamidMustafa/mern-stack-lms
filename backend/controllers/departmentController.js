const Department = require('../models/Department');

const createDepartment = async (req, res) => {
    const { name } = req.body;
    try {
        const exist = await Department.findOne({ name });
        if (exist) return res.status(400).json({ error: 'Department already exists' });

        const department = await Department.create({ name });
        res.status(201).json(department);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const fetchDepartments = async (req, res) => {
    const departments = await Department.find();
    res.status(200).json(departments);
};

const deleteDepartment = async (req, res) => {
    const { id } = req.params;
    try {
        await Department.findByIdAndDelete(id);
        res.status(200).json({ msg: 'Department deleted' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

module.exports = { createDepartment, fetchDepartments, deleteDepartment };