const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const adminRoutes = `            <Route path="students" element={<AdminStudents />} />
            <Route path="manage-appointments" element={<ManageAppointments />} />
            <Route path="manage-funds" element={<ManageFunds />} />`;
          
code = code.replace("            <Route path=\"students\" element={<AdminStudents />} />", adminRoutes);

fs.writeFileSync('src/App.tsx', code);
