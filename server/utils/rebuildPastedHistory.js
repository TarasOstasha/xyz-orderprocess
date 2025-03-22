// helpers/rebuildPastedHistory.js

module.exports = function rebuildPastedHistory(req) {
    // If req.body doesn't exist, or is null/undefined, just return an empty array
    if (!req || !req.body) {
      return [];
    }
  
    const arr = [];
  
    // 1) Parse text fields named like pastedHistory[0].text
    //    If there's no text fields at all, we'll skip
    Object.keys(req.body).forEach((key) => {
      // e.g. 'pastedHistory[0].text'
      const match = key.match(/^pastedHistory\[(\d+)\]\.text$/);
      if (match) {
        const index = parseInt(match[1], 10);
        // Make sure arr[index] exists
        arr[index] = arr[index] || {};
        arr[index].text = req.body[key];
      }
    });
  
    // 2) Parse files (images) from req.files, if it’s an array
    if (Array.isArray(req.files)) {
      for (const file of req.files) {
        // e.g. file.fieldname = 'pastedHistory[0].images'
        const match = file.fieldname.match(/^pastedHistory\[(\d+)\]\.images$/);
        if (match) {
          const index = parseInt(match[1], 10);
          arr[index] = arr[index] || {};
          // If you need multiple images per entry, store them in an array
          // But for single-file logic, just store one path
          arr[index].images = file.path
            .replace(/\\/g, '/')      // fix Windows backslashes
            .replace(/^public\//, ''); // remove leading 'public/' if you prefer
        }
      }
    }
  
    // 3) Filter out empty slots (e.g. undefined)
    return arr.filter(Boolean);
  };