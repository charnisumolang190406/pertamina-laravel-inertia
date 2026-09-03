const fs = require('fs');
let content = fs.readFileSync('resources/js/Pages/Pilar/MainDashboard.jsx', 'utf8');

// Block 1: imports
content = content.replace(/<<<<<<< HEAD\r?\n\s*ResponsiveContainer, LineChart, Line, Legend, ComposedChart, AreaChart, Area, Customized,\r?\n\s*PieChart, Pie, Cell, LabelList\r?\n=======\r?\n\s*ResponsiveContainer, LineChart, Line, Legend, ComposedChart, Area, AreaChart, Customized,\r?\n\s*PieChart, Pie, Cell\r?\n>>>>>>> charni/g, '    ResponsiveContainer, LineChart, Line, Legend, ComposedChart, AreaChart, Area, Customized,\n    PieChart, Pie, Cell, LabelList');

// Block 2: The big UI block. We want to keep charni's version.
content = content.replace(/<<<<<<< HEAD[\s\S]*?=======\r?\n(            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">[\s\S]*?)>>>>>>> charni/g, '$1');

// Block 3: The data mapping block. Keep charni's version.
content = content.replace(/<<<<<<< HEAD[\s\S]*?=======\r?\n(    \/\/ Map dynamic data from database[\s\S]*?)>>>>>>> charni/g, '$1');

// Block 4: The second data mapping block which charni deleted.
content = content.replace(/<<<<<<< HEAD[\s\S]*?=======\r?\n>>>>>>> charni/g, '');

fs.writeFileSync('resources/js/Pages/Pilar/MainDashboard.jsx', content);
console.log('Merge conflicts resolved.');
