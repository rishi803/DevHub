import React, { useState } from 'react';
import './CreateResourceModal.css'

const CreateResourceModal = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    url: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const newResource = {
      ...formData,
      id: Date.now(),
      likes: 0,
      saves: 0,
      author: "Current User",
      date: new Date().toISOString(),
    };
    onSave(newResource);
    onClose();
    setFormData({
      title: "",
      description: "",
      category: "",
      type: "",
      url: "",
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>Share Resource</h2>
          <button onClick={onClose} className="modal-close">X</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter resource title"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="2"
              placeholder="Describe the resource"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="Angular">Angular</option>
                <option value="Blockchain">Blockchain</option>
                <option value="C++">C++</option>
                <option value="C#">C#</option>
                <option value="CSS">CSS</option>
                <option value="Cybersecurity">Cybersecurity</option>
                <option value="Data Science">Data Science</option>
                <option value="DevOps">DevOps</option>
                <option value="Go">Go</option>
                <option value="HTML">HTML</option>
                <option value="Java">Java</option>
                <option value="JavaScript">JavaScript</option>
                <option value="Kotlin">Kotlin</option>
                <option value="Machine Learning">Machine Learning</option>
                <option value="Mobile Development">Mobile Development</option>
                <option value="Node.js">Node.js</option>
                <option value="Other">Other</option>
                <option value="PHP">PHP</option>
                <option value="Python">Python</option>
                <option value="React">React</option>
                <option value="Ruby">Ruby</option>
                <option value="SQL">SQL</option>
                <option value="Swift">Swift</option>
                <option value="TypeScript">TypeScript</option>
                <option value="Vue.js">Vue.js</option>
              </select>
            </div>

            <div className="form-group">
              <label>Type</label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
              >
                <option value="Article">Article</option>
                <option value="Video">Video</option>
                <option value="Tutorial">Tutorial</option>
                <option value="Tool">Tool</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>URL</label>
            <input
              type="url"
              name="url"
              value={formData.url}
              onChange={handleChange}
              required
              placeholder="https://example.com"
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="button-cancel">Cancel</button>
            <button type="submit" className="button-submit">Share Resource</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateResourceModal;
