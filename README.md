
# Module Package

**Module Package** is a powerful CLI tool designed to help developers easily generate Vue.js module structures. Whether you're building a new application or maintaining an existing one, this tool will streamline the process of creating reusable and maintainable Vue modules.

## Features

- Automatically generates the folder structure for Vue.js modules.
- Supports Vue 3 and Composition API.
- Easy-to-use command line interface.
- Configurable templates for different module types.

## Installation

To get started, you'll first need to install **Module Package** globally.

### Using NPM:
```bash
npm i vue-module-maker
```

After installation, you can access the tool using the `npx create-vue-module <module-name>` command.

## Usage

Once installed, use the `npx create-vue-module <module-name>` command to generate a new module.

### Command Format:
```bash
npx create-vue-module <module-name>
```

For example, to create a new **Blog** module, run:

```bash
npx create-vue-module blog
```

This will generate a new module named `blog` with the following structure:

```
blog/
  ├── components/
  ├── views/
  ├── store/
  └── router/
```

## Configuration

You can customize the generated module by modifying the template files located in the **`templates/`** folder. These templates are fully configurable to suit your project's needs.

## Example

Here’s an example of how the generated module might look like:

```javascript
// blog/components/BlogPost.vue
<template>
  <div class="blog-post">
    <h1>{{ title }}</h1>
    <p>{{ content }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const title = ref('My First Blog Post')
const content = ref('This is the content of the blog post.')
</script>

<style scoped>
.blog-post {
  font-size: 1.5rem;
  color: #333;
}
</style>
```

## Contributing

We welcome contributions to improve **Module Package**! To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes and commit (`git commit -am 'Add new feature'`).
4. Push your changes to your fork (`git push origin feature-branch`).
5. Create a pull request to the main repository.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

### Support

If you have any questions or need assistance, feel free to open an issue on the repository or reach out via email.

---

Made with ❤️ by [Shakibul Islam]
