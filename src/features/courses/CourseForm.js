// src/features/courses/CourseForm.jsx
import React, { useState } from "react";
import { createCourse } from "../../services/courses";
import "../../styles/courseForm.css";

const CourseForm = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverImage, setCoverImage] = useState(null);

  // Data structure: modules -> chapters -> contents
  const [modules, setModules] = useState([
    {
      title: "",
      description: "",
      chapters: [
        {
          title: "",
          contents: [
            {
              content_title: "",
              content_type: "document",
              link: "",
              text: "",
              fileFieldKey: "", // identifies the file in FormData
              _actualFileObject: null, // the real file
            },
          ],
        },
      ],
    },
  ]);

  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleCoverChange = (e) => {
    if (e.target.files[0]) {
      setCoverImage(e.target.files[0]);
    }
  };

  // -----------------------
  // Add / Remove Modules
  // -----------------------
  const addModule = () => {
    setModules((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        chapters: [
          {
            title: "",
            contents: [
              {
                content_title: "",
                content_type: "document",
                link: "",
                text: "",
                fileFieldKey: "",
                _actualFileObject: null,
              },
            ],
          },
        ],
      },
    ]);
  };
  const removeModule = (moduleIndex) => {
    setModules((prev) => {
      const copy = [...prev];
      copy.splice(moduleIndex, 1);
      return copy;
    });
  };

  // -----------------------
  // Add / Remove Chapters
  // -----------------------
  const addChapter = (moduleIndex) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[moduleIndex].chapters.push({
        title: "",
        contents: [
          {
            content_title: "",
            content_type: "document",
            link: "",
            text: "",
            fileFieldKey: "",
            _actualFileObject: null,
          },
        ],
      });
      return copy;
    });
  };
  const removeChapter = (moduleIndex, chapterIndex) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[moduleIndex].chapters.splice(chapterIndex, 1);
      return copy;
    });
  };

  // -----------------------
  // Add / Remove Contents
  // -----------------------
  const addContent = (moduleIndex, chapterIndex) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[moduleIndex].chapters[chapterIndex].contents.push({
        content_title: "",
        content_type: "document",
        link: "",
        text: "",
        fileFieldKey: "",
        _actualFileObject: null,
      });
      return copy;
    });
  };
  const removeContent = (moduleIndex, chapterIndex, contentIndex) => {
    setModules((prev) => {
      const copy = [...prev];
      copy[moduleIndex].chapters[chapterIndex].contents.splice(contentIndex, 1);
      return copy;
    });
  };

  // -----------------------
  // Handle Submit
  // -----------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);

    if (coverImage) {
      formData.append("cover_image", coverImage);
    }

    // Build a cleaned modules array
    const cleanedModules = modules.map((mod, mIndex) => ({
      title: mod.title,
      description: mod.description,
      chapters: mod.chapters.map((ch, chIndex) => ({
        title: ch.title,
        contents: ch.contents.map((cnt, cIndex) => ({
          content_title: cnt.content_title,
          content_type: cnt.content_type,
          link: cnt.content_type === "link" ? cnt.link : "",
          text: cnt.content_type === "text" ? cnt.text : "",
          fileFieldKey: cnt.fileFieldKey,
        })),
      })),
    }));

    // Attach actual files
    modules.forEach((mod, mIndex) => {
      mod.chapters.forEach((chap, chIndex) => {
        chap.contents.forEach((cnt, cIndex) => {
          if (cnt.fileFieldKey && cnt._actualFileObject) {
            formData.append(cnt.fileFieldKey, cnt._actualFileObject);
          }
        });
      });
    });

    formData.append("modules", JSON.stringify(cleanedModules));

    try {
      await createCourse(formData);
      setMsg("Course created successfully!");
      // Reset everything
      setTitle("");
      setDescription("");
      setCoverImage(null);
      setModules([
        {
          title: "",
          description: "",
          chapters: [
            {
              title: "",
              contents: [
                {
                  content_title: "",
                  content_type: "document",
                  link: "",
                  text: "",
                  fileFieldKey: "",
                  _actualFileObject: null,
                },
              ],
            },
          ],
        },
      ]);
    } catch (err) {
      setError("Failed to create course");
      console.error(err);
    }
  };

  return (
    <div className="course-form-layout">
      <div className="course-form-container">
        <h2>Create Course</h2>
        {msg && <div className="success-message">{msg}</div>}
        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          {/* Section: Basic Course Info */}
          <div className="form-section">
            <h3>Course Information</h3>
            <div className="form-group">
              <label>Course Title</label>
              <input
                type="text"
                placeholder="e.g. Introduction to Data Science"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Course Description</label>
              <textarea
                placeholder="Brief overview of the course..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Cover Image (optional)</label>
              <input type="file" accept="image/*" onChange={handleCoverChange} />
              {coverImage && (
                <p className="file-indicator">Selected: {coverImage.name}</p>
              )}
            </div>
          </div>

          <div className="form-section">
            <h3>Modules & Chapters</h3>
            {modules.map((module, mIndex) => (
              <div key={mIndex} className="module-card">
                <div className="form-group">
                  <label>Module Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Basics of Python"
                    value={module.title}
                    onChange={(e) => {
                      const copy = [...modules];
                      copy[mIndex].title = e.target.value;
                      setModules(copy);
                    }}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Module Description</label>
                  <textarea
                    placeholder="Short description for this module..."
                    value={module.description}
                    onChange={(e) => {
                      const copy = [...modules];
                      copy[mIndex].description = e.target.value;
                      setModules(copy);
                    }}
                    required
                  />
                </div>

                {/* Remove module button (if multiple modules exist) */}
                {modules.length > 1 && (
                  <button
                    type="button"
                    className="btn-remove-module"
                    onClick={() => removeModule(mIndex)}
                  >
                    Remove Module
                  </button>
                )}

                <div className="chapters-block">
                  <h4>Chapters</h4>
                  {module.chapters.map((chapter, chIndex) => (
                    <div key={chIndex} className="chapter-card">
                      <div className="form-group">
                        <label>Chapter Title</label>
                        <input
                          type="text"
                          placeholder="e.g. Chapter 1: Variables"
                          value={chapter.title}
                          onChange={(e) => {
                            const copy = [...modules];
                            copy[mIndex].chapters[chIndex].title =
                              e.target.value;
                            setModules(copy);
                          }}
                          required
                        />
                      </div>

                      {/* Remove chapter if there's more than one */}
                      {module.chapters.length > 1 && (
                        <button
                          type="button"
                          className="btn-remove-chapter"
                          onClick={() => removeChapter(mIndex, chIndex)}
                        >
                          Remove Chapter
                        </button>
                      )}

                      <div className="contents-block">
                        <h5>Contents</h5>
                        {chapter.contents.map((cnt, cIndex) => (
                          <div key={cIndex} className="content-card">
                            <div className="form-group">
                              <label>Content Title</label>
                              <input
                                type="text"
                                placeholder="e.g. Intro Video"
                                value={cnt.content_title}
                                onChange={(e) => {
                                  const copy = [...modules];
                                  copy[mIndex].chapters[chIndex].contents[
                                    cIndex
                                  ].content_title = e.target.value;
                                  setModules(copy);
                                }}
                                required
                              />
                            </div>

                            <div className="form-group">
                              <label>Content Type</label>
                              <select
                                value={cnt.content_type}
                                onChange={(e) => {
                                  const copy = [...modules];
                                  copy[mIndex].chapters[chIndex].contents[
                                    cIndex
                                  ].content_type = e.target.value;
                                  setModules(copy);
                                }}
                              >
                                <option value="document">Document</option>
                                <option value="video">Video</option>
                                <option value="image">Image</option>
                                <option value="text">Text</option>
                                <option value="presentation">Presentation</option>
                                <option value="link">Link</option>
                              </select>
                            </div>

                            {cnt.content_type === "text" && (
                              <div className="form-group">
                                <label>Text Content</label>
                                <textarea
                                  placeholder="Write your text here..."
                                  value={cnt.text}
                                  onChange={(e) => {
                                    const copy = [...modules];
                                    copy[mIndex].chapters[chIndex].contents[
                                      cIndex
                                    ].text = e.target.value;
                                    setModules(copy);
                                  }}
                                />
                              </div>
                            )}

                            {cnt.content_type === "link" && (
                              <div className="form-group">
                                <label>Link URL</label>
                                <input
                                  type="url"
                                  placeholder="e.g. https://example.com"
                                  value={cnt.link}
                                  onChange={(e) => {
                                    const copy = [...modules];
                                    copy[mIndex].chapters[chIndex].contents[
                                      cIndex
                                    ].link = e.target.value;
                                    setModules(copy);
                                  }}
                                />
                              </div>
                            )}

                            {cnt.content_type !== "text" &&
                              cnt.content_type !== "link" && (
                                <div className="form-group">
                                  <label>Attach File</label>
                                  <input
                                    type="file"
                                    onChange={(e) => {
                                      const file = e.target.files[0];
                                      const copy = [...modules];
                                      copy[mIndex].chapters[chIndex].contents[
                                        cIndex
                                      ]._actualFileObject = file;
                                      copy[mIndex].chapters[chIndex].contents[
                                        cIndex
                                      ].fileFieldKey = `file-${mIndex}-${chIndex}-${cIndex}`;
                                      setModules(copy);
                                    }}
                                  />
                                  {cnt._actualFileObject && (
                                    <p className="file-indicator">
                                      Selected: {cnt._actualFileObject.name}
                                    </p>
                                  )}
                                </div>
                              )}

                            {/* Remove content if more than 1 */}
                            {chapter.contents.length > 1 && (
                              <button
                                type="button"
                                className="btn-remove-content"
                                onClick={() =>
                                  removeContent(mIndex, chIndex, cIndex)
                                }
                              >
                                Remove Content
                              </button>
                            )}
                          </div>
                        ))}

                        <button
                          type="button"
                          className="btn-add-content"
                          onClick={() => addContent(mIndex, chIndex)}
                        >
                          + Add Content
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    className="btn-add-chapter"
                    onClick={() => addChapter(mIndex)}
                  >
                    + Add Chapter
                  </button>
                </div>
              </div>
            ))}

            <button type="button" className="btn-add-module" onClick={addModule}>
              + Add Module
            </button>
          </div>

          <hr />
          <button type="submit" className="btn-submit">
            Create Course
          </button>
        </form>
      </div>
    </div>
  );
};

export default CourseForm;
