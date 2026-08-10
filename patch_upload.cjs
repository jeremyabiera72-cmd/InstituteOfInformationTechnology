const fs = require('fs');
let code = fs.readFileSync('src/pages/Excuses.tsx', 'utf8');

const oldUpload = `  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProof(true);
    try {
      const storage = getStorage();
      const fileRef = ref(storage, \`excuses/\${uuidv4()}_\${file.name}\`);
      const snapshot = await uploadBytesResumable(fileRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      setFormData({ ...formData, proofUrl: downloadURL });
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed. Note: The app may use default Firebase storage which requires permissions.');
    } finally {
      setUploadingProof(false);
    }
  };`;

const newUpload = `  const handleProofUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingProof(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const MAX_HEIGHT = 800;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > MAX_WIDTH) {
            height *= MAX_WIDTH / width;
            width = MAX_WIDTH;
          }
        } else {
          if (height > MAX_HEIGHT) {
            width *= MAX_HEIGHT / height;
            height = MAX_HEIGHT;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        
        const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
        setFormData({ ...formData, proofUrl: dataUrl });
        setUploadingProof(false);
      };
      img.src = event.target?.result as string;
    };
    reader.onerror = () => {
      alert('Failed to read file');
      setUploadingProof(false);
    };
    reader.readAsDataURL(file);
  };`;

code = code.replace(oldUpload, newUpload);

fs.writeFileSync('src/pages/Excuses.tsx', code);
console.log("Patched file");
