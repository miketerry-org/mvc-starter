// index.tpl.js: implements template literal for main index html page

// define the template literal function for the main index web page
module.exports = (data) => {
  return `
  <!DOCTYPE html>
  <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${data.title}</title>

      <!-- Tailwind CSS CDN -->
      <script src="https://cdn.tailwindcss.com"></script>

      <!-- HTMX CDN -->
      <script src="https://unpkg.com/htmx.org@1.9.4"></script>

      <link rel="stylesheet" href="styles.css" />
    </head>
    <body class="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <!-- Header -->
      <header class="header py-6 px-4">
        <div
          class="container mx-auto flex flex-col md:flex-row items-center justify-between md:justify-between"
        >
          <!-- Left Block: Logo and Navbar -->
          <div class="left-block flex flex-col items-center md:items-start">
            <!-- Logo -->
            <div class="logo mb-4 md:mb-0">
              <img src="logo.svg" alt="Mike Terry Logo" class="w-16 h-16" />
            </div>

            <!-- Navbar -->
            <nav class="navbar mt-4 md:mt-0">
              <ul class="flex space-x-4 justify-center md:justify-start">
                <li><a href="#home" class="navbar-link">Home</a></li>
                <li><a href="#about" class="navbar-link">About</a></li>
                <li><a href="#contact" class="navbar-link">Contact</a></li>
                <li><a href="#support" class="navbar-link">Support</a></li>
              </ul>
            </nav>
          </div>

          <!-- Middle Block: Project Title and Slogan -->
          <div class="middle-block text-center md:text-center">
            <h1 class="text-3xl font-bold">${data.title}</h1>
            <h2 class="text-xl text-gray-600">${data.slogan}</h2>
          </div>

          <!-- Right Block: Login/Logout (conditionally rendered) -->
          <div class="right-block mt-4 md:mt-0 md:ml-auto flex items-center">
            ${
              data.isLoggedIn
                ? `<a
                  href="#logout"
                  class="login-logout-link bg-blue-500 text-white rounded-full px-6 py-2 text-lg hover:bg-blue-600"
                >Logout</a>`
                : `<a
                  href="#login"
                  class="login-logout-link bg-blue-500 text-white rounded-full px-6 py-2 text-lg hover:bg-blue-600"
                >Login</a>`
            }
          </div>
        </div>
      </header>

      <!-- Main Content -->
      <main class="main py-6 px-4">${data.content}</main>

      <!-- Footer -->
      <footer class="footer py-4 text-center text-sm text-gray-500">
        <p>© Copyright ${data.year} ${data.owner}</p>
      </footer>
    </body>
  </html>
  `;
};
