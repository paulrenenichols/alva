const fs = require('fs');
const path = require('path');

// Create symlinks for shared libraries in node_modules
const distPath = path.join(__dirname, '../../dist');
const nodeModulesPath = path.join(distPath, 'node_modules');
const libsPath = path.join(distPath, 'libs');

// Create node_modules directory if it doesn't exist
if (!fs.existsSync(nodeModulesPath)) {
  fs.mkdirSync(nodeModulesPath, { recursive: true });
}

// Create @alva directory in node_modules
const alvaPath = path.join(nodeModulesPath, '@alva');
if (!fs.existsSync(alvaPath)) {
  fs.mkdirSync(alvaPath, { recursive: true });
}

// Create symlinks for each shared library
const libraries = ['database', 'shared-types', 'validation', 'utils', 'api-client', 'auth-client'];

libraries.forEach(lib => {
  const libPath = path.join(libsPath, lib);
  const symlinkPath = path.join(alvaPath, lib);
  
  if (fs.existsSync(libPath)) {
    // Remove existing symlink if it exists
    if (fs.existsSync(symlinkPath)) {
      fs.unlinkSync(symlinkPath);
    }
    
    // Create symlink
    fs.symlinkSync(path.relative(alvaPath, libPath), symlinkPath, 'dir');
    console.log(`Created symlink for @alva/${lib}`);
  } else {
    console.log(`Warning: Library ${lib} not found at ${libPath}`);
  }
});

console.log('Created symlinks for shared libraries');
