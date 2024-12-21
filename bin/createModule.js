#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// মডিউলের নাম প্যারামিটার হিসেবে নিন
const moduleName = process.argv[2];

if (!moduleName) {
    console.error("Please provide a module name. Usage: create-vue-module <module-name>");
    process.exit(1);
}

// Root path for the modules directory
const modulesPath = path.resolve('src/modules');
const newModulePath = path.join(modulesPath, moduleName);

// Main route file path
const mainRouteFilePath = path.resolve('src/router/index.js');

// ফোল্ডার স্ট্রাকচার তৈরি করুন
const directories = [
    `${newModulePath}/components`,
    `${newModulePath}/store`,
    `${newModulePath}/services`,
];

// রাউট ফাইল এবং অন্যান্য ফাইলের জন্য ডিফল্ট টেমপ্লেট
const routeTemplate = `
export default [
    {
        path: '/${moduleName}',
        name: '${moduleName}',
        component: () => import('./components/${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}.vue'),
    },
];
`;

const componentTemplate = `<template>
  <div>
    <h1>${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)} Module</h1>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
`;

const serviceTemplate = `export const fetchData = async () => {
    // Example API call
    return await fetch('/api/${moduleName}');
};
`;

const storeTemplate = `import { defineStore } from 'pinia';

export const use${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}Store = defineStore('${moduleName}', {
    state: () => ({
        data: [],
    }),
    actions: {
        async fetchData() {
            console.log('Fetching data for ${moduleName}');
        },
    },
});
`;

function updateMainRouteFile() {
    try {
        if (!fs.existsSync(mainRouteFilePath)) {
            console.error("Main route file not found. Please ensure 'src/router/index.js' exists.");
            process.exit(1);
        }

        const importStatement = `import ${moduleName}Routes from '../modules/${moduleName}/routes.js';\n`;
        const routeAddition = `...${moduleName}Routes,`;

        let mainRouteFileContent = fs.readFileSync(mainRouteFilePath, 'utf-8');

        // রাউট ফাইলটি সঠিকভাবে আপডেট হচ্ছে কিনা তা চেক করুন
        if (!mainRouteFileContent.includes(importStatement)) {
            // Import স্টেটমেন্টটি সঠিক জায়গায় যোগ করা হচ্ছে
            mainRouteFileContent = importStatement + mainRouteFileContent;
        }

        // routes অ্যারের মধ্যে নতুন রাউট অ্যাড করুন
        if (!mainRouteFileContent.includes(routeAddition)) {
            const routesArrayMatch = mainRouteFileContent.match(/routes\s*:\s*\[([\s\S]*?)\]/);

            if (routesArrayMatch) {
                const updatedRoutesArray = routesArrayMatch[0].replace(
                    /\[(.*?)\]/s,
                    `[\n    ${routeAddition}$1\n]`
                );
                mainRouteFileContent = mainRouteFileContent.replace(routesArrayMatch[0], updatedRoutesArray);
            } else {
                console.error("No 'routes' array found in the main route file.");
                process.exit(1);
            }
        }

        // আপডেট হওয়া কনটেন্টটি আবার ফাইলটিতে লেখুন
        fs.writeFileSync(mainRouteFilePath, mainRouteFileContent);
        console.log(`Updated main route file: ${mainRouteFilePath}`);
    } catch (error) {
        console.error("Error updating main route file:", error);
    }
}

// ফোল্ডার এবং ফাইল ক্রিয়েট করুন
(async () => {
    try {
        if (!fs.existsSync(modulesPath)) {
            fs.mkdirSync(modulesPath, { recursive: true });
        }

        directories.forEach((dir) => {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
                console.log(`Created directory: ${dir}`);
            }
        });

        fs.writeFileSync(`${newModulePath}/routes.js`, routeTemplate);
        console.log(`Created file: ${newModulePath}/routes.js`);

        fs.writeFileSync(
            `${newModulePath}/components/${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}.vue`,
            componentTemplate
        );
        console.log(`Created file: ${newModulePath}/components/${moduleName.charAt(0).toUpperCase() + moduleName.slice(1)}.vue`);

        fs.writeFileSync(`${newModulePath}/services/${moduleName}Service.js`, serviceTemplate);
        console.log(`Created file: ${newModulePath}/services/${moduleName}Service.js`);

        fs.writeFileSync(`${newModulePath}/store/${moduleName}Store.js`, storeTemplate);
        console.log(`Created file: ${newModulePath}/store/${moduleName}Store.js`);

        // Update the main route file
        updateMainRouteFile();

        console.log(`Module "${moduleName}" has been created successfully!`);
    } catch (error) {
        console.error("Error creating module:", error);
    }
})();
