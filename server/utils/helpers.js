
const { Task, Note, Step, PastedHistory } = require('../models');


module.exports = async function getUpdatedTask(taskId) {
  console.log('getUpdatedTask')
  const updatedTask = await Task.findByPk(taskId, {
    include: [Note, Step, PastedHistory],
  });
  return updatedTask;
};



