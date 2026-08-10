const fs = require('fs');

let code = fs.readFileSync('src/pages/admin/AdminStudents.tsx', 'utf8');

const targetButton = `                    <button 
                      onClick={async () => {
                        if (window.confirm('Are you sure you want to delete this student?')) {
                          try {
                            await axios.delete(\`/api/users/\${student.id}\`);
                            fetchStudents();
                          } catch (err) {
                            console.error(err);
                          }
                        }
                      }}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete Student"
                    >`;

const replaceButton = `                    <button 
                      onClick={async () => {
                        try {
                          await axios.delete(\`/api/users/\${student.id}\`);
                          fetchStudents();
                        } catch (err) {
                          console.error(err);
                          alert('Failed to delete user');
                        }
                      }}
                      className="p-2 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                      title="Delete Student"
                    >`;

code = code.replace(targetButton, replaceButton);
fs.writeFileSync('src/pages/admin/AdminStudents.tsx', code);
