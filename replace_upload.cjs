const fs = require('fs');

function convert(file) {
  let content = fs.readFileSync(file, 'utf8');

  // Replace firebase storage imports with empty
  content = content.replace("import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';", "");
  content = content.replace("import { v4 as uuidv4 } from 'uuid';", "");
  
  // Find the try block in handleSubmit
  const newLogic = `
      let imageUrl = null;
      if (file) {
        imageUrl = await new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }
  `;

  content = content.replace(/let imageUrl = null;[\s\S]*?imageUrl = await getDownloadURL\(uploadTask\.ref\);\n      \}/, newLogic.trim());

  fs.writeFileSync(file, content);
}

convert('src/pages/LostAndFound.tsx');
convert('src/pages/admin/ManageAnnouncements.tsx');
