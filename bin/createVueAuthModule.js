#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Paths
const modulesPath = path.resolve('src/modules');
const authModuleName = 'UserAuthentication';

// Templates for auth module
const templates = {
    directories: [
        `${modulesPath}/${authModuleName}/components`,
        `${modulesPath}/${authModuleName}/views`,
        `${modulesPath}/${authModuleName}/store`,
    ],
    axiosServiceTemplate: `import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: '/api',
    timeout: 1000,
});

export default axiosInstance;
`,
    changePasswordComponent: `<template>
  <div>
    <h1>Change Password</h1>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
`,
    loginViewTemplate: `<template>
  <div>
    <h1>Login</h1>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
`,
    authStoreTemplate: `import { defineStore } from 'pinia';

export const useAuth = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
    }),
    actions: {
        login() {
            this.isAuthenticated = true;
        },
        logout() {
            this.isAuthenticated = false;
        },
    },
});
`,
    newRoute: `
{
    path: '/login',
    name: 'login',
    component: () => import('@/modules/UserAuthentication/views/Login.vue'),
    meta: { title: 'Login', guest: true },
},
`,
    beforeEachLogic: `
const DEFAULT_TITLE = "404";
router.beforeEach((to, from, next) => {
  document.title = to.meta.title || DEFAULT_TITLE;
  const auth = useAuth();
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!auth.isAuthenticated) {
      next({ name: "login" });
    } else {
      next();
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (auth.isAuthenticated) {
      next({ name: "dashboard" });
    } else {
      next();
    }
  } else {
    next();
  }
});
`,
};

// Create directories and files
try {
    // Ensure `modulesPath` exists
    if (!fs.existsSync(modulesPath)) {
        fs.mkdirSync(modulesPath, { recursive: true });
    }

    // Ensure `src/services` exists
    const servicesPath = path.resolve('src/services');
    if (!fs.existsSync(servicesPath)) {
        fs.mkdirSync(servicesPath, { recursive: true });
        console.log(`Created directory: ${servicesPath}`);
    }

    // Create module directories
    templates.directories.forEach((dir) => {
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
            console.log(`Created directory: ${dir}`);
        }
    });

    // Create axios service
    const axiosServicePath = `${servicesPath}/axiosService.js`;
    if (!fs.existsSync(axiosServicePath)) {
        fs.writeFileSync(axiosServicePath, templates.axiosServiceTemplate);
        console.log(`Created file: ${axiosServicePath}`);
    }

    // Create ChangePassword component
    const changePasswordPath = `${modulesPath}/${authModuleName}/components/ChangePassword.vue`;
    if (!fs.existsSync(changePasswordPath)) {
        fs.writeFileSync(changePasswordPath, templates.changePasswordComponent);
        console.log(`Created file: ${changePasswordPath}`);
    }

    // Create Login view
    const loginViewPath = `${modulesPath}/${authModuleName}/views/Login.vue`;
    if (!fs.existsSync(loginViewPath)) {
        fs.writeFileSync(loginViewPath, templates.loginViewTemplate);
        console.log(`Created file: ${loginViewPath}`);
    }

    // Create Auth store
    const authStorePath = `${modulesPath}/${authModuleName}/store/authStore.js`;
    if (!fs.existsSync(authStorePath)) {
        fs.writeFileSync(authStorePath, templates.authStoreTemplate);
        console.log(`Created file: ${authStorePath}`);
    }

    // Update router file
    const routerFilePath = 'src/router/index.js';
    const { newRoute, beforeEachLogic } = templates;

    if (!fs.existsSync(routerFilePath)) {
        // Create a new router file if it doesn't exist
        const routerContent = `
import { createRouter, createWebHistory } from 'vue-router';
import { useAuth } from '@/modules/UserAuthentication/store/authStore';
import Login from '@/modules/UserAuthentication/views/Login.vue';

const routes = [
    ${newRoute}
];

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes,
    scrollBehavior() {
        return { top: 0, behavior: 'smooth' };
    },
});

${beforeEachLogic}

export default router;
`;
        fs.writeFileSync(routerFilePath, routerContent);
        console.log(`Created router file: ${routerFilePath}`);
    } else {
        // Update existing router file
        let routerData = fs.readFileSync(routerFilePath, 'utf-8');

        // Add new route
        if (!routerData.includes(newRoute.trim())) {
            routerData = routerData.replace(/(const routes = \[)/, `$1${newRoute}`);
            console.log('Added new route to router.');
        }

        // Add imports if missing
        if (!routerData.includes(`import { useAuth } from '@/modules/UserAuthentication/store/authStore';`)) {
            routerData = routerData.replace(
                /(import { createRouter, createWebHistory } from 'vue-router';)/,
                `$1\nimport { useAuth } from '@/modules/UserAuthentication/store/authStore';`
            );
            console.log('Added Auth store import.');
        }

        if (!routerData.includes(`import Login from '@/modules/UserAuthentication/views/Login.vue';`)) {
            routerData = routerData.replace(
                /(import { useAuth } from '@\/modules\/UserAuthentication\/store\/authStore';)/,
                `$1\nimport Login from '@/modules/UserAuthentication/views/Login.vue';`
            );
            console.log('Added Login view import.');
        }

        // Add beforeEach logic
        if (!routerData.includes('router.beforeEach')) {
            routerData += `\n${beforeEachLogic}`;
            console.log('Added router.beforeEach logic.');
        }

        // Save updated router file
        fs.writeFileSync(routerFilePath, routerData, 'utf-8');
        console.log(`Updated router file: ${routerFilePath}`);
    }
} catch (error) {
    console.error("Error creating auth module:", error);
}
