// src/features/courses/modules/ModulesList.jsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getCourseModules } from "../../../services/modules";
import { updateUserModuleProgress } from "../../../services/progress";
import "../../../styles/moduleList.css";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import classNames from "classnames";

const ModulesList = () => {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [openModuleId, setOpenModuleId] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const fetchedModules = await getCourseModules(courseId);
        setModules(fetchedModules);
        setError("");
      } catch (err) {
        console.error("Error fetching modules:", err);
        setError("Failed to fetch modules.");
      } finally {
        setLoading(false);
      }
    };
    fetchModules();
  }, [courseId]);

  // Expand/collapse a module in the sidebar
  const toggleModule = (moduleId) => {
    setOpenModuleId((prevId) => {
      // If we open a different module, auto-select the first chapter if it exists
      if (prevId !== moduleId) {
        const newModule = modules.find((m) => m.id === moduleId);
        if (newModule && newModule.chapters && newModule.chapters.length > 0) {
          const firstChap = newModule.chapters[0];
          setSelectedChapter(firstChap);
          handleProgressUpdate(newModule, firstChap);
        } else {
          setSelectedChapter(null);
        }
        return moduleId;
      }
      // If the same module was open, close it
      return prevId === moduleId ? null : moduleId;
    });
  };

  const handleChapterClick = (moduleId, chapter) => {
    setSelectedChapter(chapter);
    const mod = modules.find((m) => m.id === moduleId);
    if (mod) {
      handleProgressUpdate(mod, chapter);
    }
  };

  // Example approach: progress = (chapterIndex+1 / totalChapters) * 100
  const handleProgressUpdate = (moduleObj, chapterObj) => {
    if (!moduleObj.chapters) return;
    const totalChapters = moduleObj.chapters.length;
    const chapterIndex = moduleObj.chapters.findIndex(
      (ch) => ch.id === chapterObj.id
    );
    if (chapterIndex < 0) return;

    const progress = Math.round(((chapterIndex + 1) / totalChapters) * 100);
    // Pass both courseId and moduleObj.id
    updateUserModuleProgress(courseId, moduleObj.id, progress).catch((err) => {
      console.error("Failed to update progress:", err);
    });
  };

  // Find the current module and chapter index
  const findChapterLocation = () => {
    for (let i = 0; i < modules.length; i++) {
      const mod = modules[i];
      if (!mod.chapters) continue;
      const cIndex = mod.chapters.findIndex(
        (ch) => ch.id === selectedChapter?.id
      );
      if (cIndex >= 0) {
        return { mIndex: i, cIndex };
      }
    }
    return null;
  };

  // Move to next chapter
  const getNextChapter = () => {
    const loc = findChapterLocation();
    if (!loc) return;
    const { mIndex, cIndex } = loc;
    const mod = modules[mIndex];
    if (!mod.chapters) return;

    if (cIndex < mod.chapters.length - 1) {
      // Next chapter in the same module
      const nextChap = mod.chapters[cIndex + 1];
      setSelectedChapter(nextChap);
      handleProgressUpdate(mod, nextChap);
      setOpenModuleId(mod.id);
    } else {
      // Jump to next module if available
      if (mIndex < modules.length - 1) {
        const nextMod = modules[mIndex + 1];
        if (nextMod.chapters && nextMod.chapters.length > 0) {
          const firstChap = nextMod.chapters[0];
          setSelectedChapter(firstChap);
          handleProgressUpdate(nextMod, firstChap);
          setOpenModuleId(nextMod.id);
        } else {
          setSelectedChapter(null);
        }
      }
    }
  };

  // Move to previous chapter
  const getPreviousChapter = () => {
    const loc = findChapterLocation();
    if (!loc) return;
    const { mIndex, cIndex } = loc;
    const mod = modules[mIndex];
    if (!mod.chapters) return;

    if (cIndex > 0) {
      // Previous chapter in the same module
      const prevChap = mod.chapters[cIndex - 1];
      setSelectedChapter(prevChap);
      handleProgressUpdate(mod, prevChap);
      setOpenModuleId(mod.id);
    } else {
      // Jump to previous module if possible
      if (mIndex > 0) {
        const prevMod = modules[mIndex - 1];
        if (prevMod.chapters && prevMod.chapters.length > 0) {
          const lastChap = prevMod.chapters[prevMod.chapters.length - 1];
          setSelectedChapter(lastChap);
          handleProgressUpdate(prevMod, lastChap);
          setOpenModuleId(prevMod.id);
        } else {
          setSelectedChapter(null);
        }
      }
    }
  };

  if (loading) {
    return <div className="loading-message">Loading modules...</div>;
  }
  if (error) {
    return <div className="error-message">{error}</div>;
  }

  return (
    <div className="modules-layout">
      {/* ---------- LEFT SIDEBAR: Modules -> Chapters ---------- */}
      <div className="modules-sidebar">
        {modules.map((module) => {
          const isOpen = module.id === openModuleId;
          return (
            <div className="module-item" key={module.id}>
              <div
                className={classNames("module-header", {
                  "active-module": isOpen,
                })}
                onClick={() => toggleModule(module.id)}
              >
                <h3 className="module-title">{module.title}</h3>
                <span className="toggle-icon">
                  {isOpen ? <FaChevronUp /> : <FaChevronDown />}
                </span>
              </div>

              {isOpen && module.chapters && (
                <div className="module-content-list">
                  {module.chapters.length > 0 ? (
                    module.chapters.map((chapter) => (
                      <div
                        key={chapter.id}
                        className={classNames("module-subitem", {
                          "content-open": selectedChapter?.id === chapter.id,
                        })}
                        onClick={() => handleChapterClick(module.id, chapter)}
                      >
                        {chapter.title}
                      </div>
                    ))
                  ) : (
                    <p className="no-contents">No chapters in this module.</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ---------- RIGHT PANEL: Display a single Chapter + contents ---------- */}
      <div className="modules-main">
        <h2>Chapter Content</h2>
        {selectedChapter ? (
          <div className="chapter-detail">
            <h3>{selectedChapter.title}</h3>
            {selectedChapter.contents && selectedChapter.contents.length > 0 ? (
              selectedChapter.contents.map((content) => {
                const {
                  id,
                  content_title,
                  content_type,
                  text,
                  file,
                  video_url,
                } = content;

                // Example: handle each content type
                if (content_type === "video") {
                  return (
                    <div key={id} className="module-content-detail">
                      <h4>{content_title}</h4>
                      {file ? (
                        <video controls width="100%">
                          <source src={file} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      ) : video_url ? (
                        <video controls width="100%">
                          <source src={video_url} type="video/mp4" />
                        </video>
                      ) : (
                        <p>No video file or URL provided.</p>
                      )}
                    </div>
                  );
                } else if (content_type === "text") {
                  return (
                    <div key={id} className="module-content-detail">
                      <h4>{content_title}</h4>
                      <p>{text || "No text provided."}</p>
                    </div>
                  );
                } else if (content_type === "image" && file) {
                  return (
                    <div key={id} className="module-content-detail">
                      <h4>{content_title}</h4>
                      <img
                        src={file}
                        alt={content_title}
                        style={{ maxWidth: "100%", height: "auto" }}
                      />
                    </div>
                  );
                } else if (content_type === "document" && file) {
                  return (
                    <div key={id} className="module-content-detail">
                      <h4>{content_title}</h4>
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-link"
                      >
                        Download Document
                      </a>
                    </div>
                  );
                } else if (content_type === "presentation" && file) {
                  return (
                    <div key={id} className="module-content-detail">
                      <h4>{content_title}</h4>
                      <a
                        href={file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="download-link"
                      >
                        Download Presentation
                      </a>
                    </div>
                  );
                } else if (content_type === "link") {
                  return (
                    <div key={id} className="module-content-detail">
                      <h4>{content_title}</h4>
                      <p>
                        <a
                          href={video_url || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="download-link"
                        >
                          Go to Link
                        </a>
                      </p>
                    </div>
                  );
                }
                // Fallback for unsupported or missing data
                return (
                  <div key={id} className="module-content-detail">
                    <h4>{content_title}</h4>
                    <p>Unsupported content type or missing file.</p>
                  </div>
                );
              })
            ) : (
              <p>No contents in this chapter.</p>
            )}
          </div>
        ) : (
          <p>Select a chapter on the left to view its contents.</p>
        )}

        <div className="navigation-buttons">
          <button onClick={getPreviousChapter} disabled={!selectedChapter}>
            Previous
          </button>
          <button onClick={getNextChapter} disabled={!selectedChapter}>
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModulesList;
