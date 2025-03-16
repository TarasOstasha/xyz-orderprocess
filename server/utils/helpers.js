module.exports = async function getUpdatedTask(taskId) {
  const updatedTask = await Task.findByPk(taskId, {
    include: [Note, Step, PastedHistory],
  });
  return updatedTask;
};

module.exports = function rebuildPastedHistory(req) {
  const arr = [];

  // 1) Parse text from req.body
  Object.keys(req.body).forEach((key) => {
    // e.g. 'pastedHistory[0].text'
    const match = key.match(/^pastedHistory\[(\d+)\]\.text$/);
    if (match) {
      const index = parseInt(match[1], 10);
      arr[index] = arr[index] || {};
      arr[index].text = req.body[key];
    }
  });

  // 2) Parse images (files) from req.files
  if (Array.isArray(req.files)) {
    for (const file of req.files) {
      // e.g. file.fieldname = 'pastedHistory[0].images'
      const match = file.fieldname.match(/^pastedHistory\[(\d+)\]\.images$/);
      if (match) {
        const index = parseInt(match[1], 10);
        arr[index] = arr[index] || {};
        // If you want multiple images per item, store an array.
        // For a single file, just store the path.
        arr[index].images = file.path
          .replace(/\\/g, '/') // fix Windows backslashes
          .replace(/^public\//, ''); // remove leading 'public/'
      }
    }
  }

  // Filter out empty slots
  return arr.filter(Boolean);
};
