const { Task, Note, Step, PastedHistory } = require('../models');

async function getUpdatedTask(taskId) {
  return Task.findByPk(taskId, {
    include: [Note, Step, PastedHistory],
  });
}

function rebuildPastedHistory(req) {
  const arr = [];

  Object.keys(req.body).forEach((key) => {
    const match = key.match(/^pastedHistory\[(\d+)\]\.text$/);
    if (match) {
      const index = parseInt(match[1], 10);
      arr[index] = arr[index] || {};
      arr[index].text = req.body[key];
    }
  });

  if (Array.isArray(req.files)) {
    for (const file of req.files) {
      const match = file.fieldname.match(/^pastedHistory\[(\d+)\]\.images$/);
      if (match) {
        const index = parseInt(match[1], 10);
        arr[index] = arr[index] || {};
        arr[index].images = file.path
          .replace(/\\/g, '/')
          .replace(/^public\//, '');
      }
    }
  }

  return arr.filter(Boolean);
}

module.exports = {
  getUpdatedTask,
  rebuildPastedHistory,
};
