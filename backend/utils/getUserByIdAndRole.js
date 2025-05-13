const Student = require('../models/Student');
const Teacher = require('../models/Teacher');
const Admin = require('../models/Admin');

const getUserByIdAndRole = async (id, role) => {
    let Model;
    if (role === 'student') Model = Student;
    else if (role === 'teacher') Model = Teacher;
    else if (role === 'admin') Model = Admin;
    else throw new Error('Invalid role!');

    const user = await Model.findById(id);
    return user;
};

module.exports = { getUserByIdAndRole };