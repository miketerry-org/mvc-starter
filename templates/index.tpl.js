module.exports = ({
  project_title,
  project_slogan,
  project_owner,
  copyright_year,
}) => {
  return `
  <h1>${project_title}</h1>
  <h2>${project_slogan}</h2>
<p>Copyright ${copyright_year} ${project_owner}</p>
  `;
};
