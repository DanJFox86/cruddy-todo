const fs = require('fs');
const path = require('path');
const _ = require('underscore');
const counter = require('./counter');
const Promise = require('bluebird');
const readFileSync = Promise.promisify(fs.readFile);


var items = {};


// Public API - Fix these CRUD functions ///////////////////////////////////////

exports.create = (text, callback) => {
  // var id = counter.getNextUniqueId();
  // items[id] = text;
  // callback(null, { id, text });

  counter.getNextUniqueId((err, counterString) => {
    // counterString = filename of text file
    var filePath = path.join(exports.dataDir, `./${counterString}.txt`);
    // text = todolistitem to store in HD
    // write todolistitem to text file
    fs.writeFile(filePath, text, (err) => {
      if (err) {
        throw ('error writing content');
      } else {
        callback (null, {id: counterString, text});
      }
    });
  });
};


exports.readAll = (callback) => {
  fs.readdir(exports.dataDir, (err, files) => {
    if (err) {
      return callback(err);
    }
    var data = _.map(files, (file) => {
      var id = path.basename(file, '.txt');
      var filePath = path.join(exports.dataDir, file);
      return readFileSync(filePath).then((fileData) => {
        return {  
          id: id, 
          text: fileData.toString()
        };
      });
    });
    Promise.all(data)
      .then((items) => {
        callback(null, items);
      });
  });
};

// exports.readAll = (callback) => {
//   var data = _.map(items, (text, id) => {
//     return { id, text };
//   });
//   callback(null, data);
// };

exports.readOne = (id, callback) => {
  var filePath = path.join(exports.dataDir, `./${id}.txt`);
  fs.readFile(filePath, (err, todoListItem) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      callback(null, { id, text: todoListItem.toString() });
    }
  });
};

// exports.readOne = (id, callback) => {
//   var text = items[id];
//   if (!text) {
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     callback(null, { id, text });
//   }
// };

exports.update = (id, text, callback) => {
  var filePath = path.join(exports.dataDir, `./${id}.txt`);
  fs.readFile(filePath, (err, todoListItem) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.writeFile(filePath, text, (err) => {
        if (err) {
          throw ('error writing content');
        } else {
          callback (null, {id, text});
        }
      });
    }
  });
};

// exports.update = (id, text, callback) => {
//   var item = items[id];
//   if (!item) {
//     callback(new Error(`No item with id: ${id}`));
//   } else {
//     items[id] = text;
//     callback(null, { id, text });
//   }
// };


exports.delete = (id, callback) => {
  var filePath = path.join(exports.dataDir, `./${id}.txt`);

  fs.readFile(filePath, (err, todoListItem) => {
    if (err) {
      callback(new Error(`No item with id: ${id}`));
    } else {
      fs.unlink(filePath, (err) => {
        if (err) {
          return err;
        } else {
          callback();
        }
      });
    }
  });
};
// var item = items[id];
// delete items[id];
// if (!item) {
//   // report an error if item not found
//   callback(new Error(`No item with id: ${id}`));
// } else {
//   callback();
// }
// Config+Initialization code -- DO NOT MODIFY /////////////////////////////////

exports.dataDir = path.join(__dirname, 'data');

exports.initialize = () => {
  if (!fs.existsSync(exports.dataDir)) {
    fs.mkdirSync(exports.dataDir);
  }
};
