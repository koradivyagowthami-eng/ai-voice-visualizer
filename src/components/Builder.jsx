import Sidebar from "./Sidebar";
import { templates } from "./data/templates";
const [previewMode, setPreviewMode] =
  useState(false);

const loadTemplate = (name) => {
  const data = templates[name];

  if (!data) return;

  const sectionsWithIds = data.map(
    (section) => ({
      ...section,
      id: uuid(),
    })
  );

  setSections(sectionsWithIds);
};

const saveProject = () => {
  localStorage.setItem(
    "website-builder",
    JSON.stringify(sections)
  );

  alert("Project Saved");
};