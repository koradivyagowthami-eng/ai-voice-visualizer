export default function Sidebar({
  addSection,
  loadTemplate,
  saveProject,
  previewMode,
  setPreviewMode,
}) {
  return (
    <div className="sidebar">

      <h2>Templates</h2>

      <button onClick={() => loadTemplate("business")}>
        🏢 Business
      </button>

      <button onClick={() => loadTemplate("portfolio")}>
        🎨 Portfolio
      </button>

      <button onClick={() => loadTemplate("ecommerce")}>
        🛒 E-Commerce
      </button>

      <button onClick={() => loadTemplate("education")}>
        📚 Education
      </button>

      <button onClick={() => loadTemplate("restaurant")}>
        🍽️ Restaurant
      </button>

      <button onClick={() => loadTemplate("saas")}>
        💻 SaaS
      </button>

      <hr />

      <h2>Sections</h2>

      <button onClick={() => addSection("hero")}>
        ➕ Hero
      </button>

      <button onClick={() => addSection("about")}>
        ➕ About
      </button>

      <button onClick={() => addSection("features")}>
        ➕ Features
      </button>

      <button onClick={() => addSection("pricing")}>
        ➕ Pricing
      </button>

      <button onClick={() => addSection("faq")}>
        ➕ FAQ
      </button>

      <button onClick={() => addSection("contact")}>
        ➕ Contact
      </button>

      <hr />

      <h2>Project</h2>

      <button onClick={saveProject}>
        💾 Save
      </button>

      <button
        onClick={() =>
          setPreviewMode(!previewMode)
        }
      >
        👁 Preview
      </button>

    </div>
  );
}