import React, { useState, useCallback, useMemo, useEffect } from "react";
import {
  Search,
  Bookmark,
  Share,
  ThumbsUp,
  Link,
  ExternalLink,
  Plus,
  X,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useDarkMode from "./DarkMode";
import CreateResourceModal from "./CreateResourceModal";

const ITEMS_PER_PAGE = 6;

// Initial resources data
const initialResources = [
  {
    id: 1,
    title: "Advanced React Patterns",
    description:
      "Learn advanced React patterns including compound components, render props, and hooks patterns.",
    category: "React",
    type: "Article",
    likes: 234,
    saves: 56,
    url: "https://example.com",
    author: "Sarah Dev",
    date: Date.now(),
    likedBy: [], // Array to store user IDs who liked this resource
  },
  {
    id: 2,
    title: "Angular",
    description:
      "Learn advanced Angular patterns including compound components, render props, and two way data binding",
    category: "Angular",
    type: "Article",
    likes: 234,
    saves: 56,
    url: "https://example.com",
    author: "Sarah Dev",
    date: Date.now(),
    likedBy: [],
  },
  {
    id: 3,
    title: "Advanced Java Patterns",
    description: "Learn advanced Java Coding and data structures.",
    category: "Java",
    type: "Article",
    likes: 208,
    saves: 52,
    url: "https://example.com",
    author: "Rishi Singh",
    date: Date.now(),
    likedBy: [],
  },
  {
    id: 4,
    title: "Modern CSS Techniques",
    description:
      "Explore modern CSS features including Grid, Flexbox, and CSS Custom Properties.",
    category: "C++",
    type: "Tutorial",
    likes: 189,
    saves: 45,
    url: "https://example.com",
    author: "Mike Styles",
    date: "2024-03-14",
    likedBy: [],
  },
  {
    id: 5,
    title: "JavaScript Performance Tips",
    description:
      "Essential tips for optimizing JavaScript performance in modern web applications.",
    category: "JavaScript",
    type: "Video",
    likes: 567,
    saves: 123,
    url: "https://example.com",
    author: "John Code",
    date: "2024-03-13",
    likedBy: [],
  },
  {
    id: 6,
    title: "JavaScript Fundamentals",
    description:
      "Know the fundamentals of JavaScript in modern web applications.",
    category: "JavaScript",
    type: "Video",
    likes: 57,
    saves: 12,
    url: "https://example.com",
    author: "Abdul Hadi",
    date: Date.now(),
    likedBy: [],
  },
  {
    id: 7,
    title: "JavaScript Array methods",
    description:
      "Master the beauty of javascript array methods like filter, reduce, map and so on..",
    category: "JavaScript",
    type: "Video",
    likes: 527,
    saves: 112,
    url: "https://example.com",
    author: "Rishabh shukla",
    date: Date.now(),
    likedBy: [],
  },
];

const Home = () => {
  const [darkMode, setDarkMode] = useDarkMode();

  const [currentPage, setCurrentPage] = useState(1);
  const [userId] = useState(() => {
    // Generate a random user ID for demo purposes
    const saved = localStorage.getItem("userId");
    if (saved) return saved;
    const newId = Math.random().toString(36).substr(2, 9);
    localStorage.setItem("userId", newId);
    return newId;
  });

  const isInitialized = React.useRef(false);

  const [resources, setResources] = useState(() => {
    try {
      const storedResources = localStorage.getItem("resources");
      if (storedResources) {
        const parsedResources = JSON.parse(storedResources);
        if (Array.isArray(parsedResources) && parsedResources.length > 0) {
          return parsedResources;
        }
      }
    } catch (error) {
      console.error("Error loading initial resources:", error);
    }
    return initialResources;
  });

  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedResources, setSavedResources] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("savedResources") || "[]");
    } catch {
      return [];
    }
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
  }, [darkMode]);

  useEffect(() => {
    if (!isInitialized.current) {
      isInitialized.current = true;
      return;
    }

    if (resources.length > 0) {
      localStorage.setItem("resources", JSON.stringify(resources));
    }
  }, [resources]);

  useEffect(() => {
    localStorage.setItem("savedResources", JSON.stringify(savedResources));
  }, [savedResources]);

  const handleLikeResource = useCallback(
    (resourceId) => {
      setResources((prevResources) => {
        return prevResources.map((resource) => {
          if (resource.id === resourceId) {
            const isLiked = resource.likedBy?.includes(userId);
            /*if same user then remove(unlike) else add this user in likedBy*/
            const newLikedBy = isLiked
              ? resource.likedBy.filter((id) => id !== userId)
              : [...(resource.likedBy || []), userId];

            return {
              ...resource,
              likes: isLiked ? resource.likes - 1 : resource.likes + 1,
              likedBy: newLikedBy,
            };
          }
          return resource;
        });
      });
    },
    [userId]
  );

  const handleSearch = useCallback((event) => {
    setIsLoading(true);
    setCurrentPage(1); // Reset to first page on search
    const { value } = event.target;

    setTimeout(() => {
      setSearchTerm(value);
      setIsLoading(false);
    }, 500);
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(resources.map((item) => item.category))];
  }, [resources]);

  const filteredResources = useMemo(() => {
    return resources.filter((resource) => {
      const matchesSearch =
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || resource.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [resources, searchTerm, selectedCategory]);

  // Pagination logic
  const totalPages = Math.ceil(filteredResources.length / ITEMS_PER_PAGE);
  const paginatedResources = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredResources.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredResources, currentPage]);

  const handleCreateResource = (newResource) => {
    console.log("createe");
    setResources((prev) => [...prev, newResource]);
  };

  const ResourceCard = React.memo(({ resource }) => {
    const isLiked = resource.likedBy?.includes(userId);

    return (
      <div className="resource-card">
        <div className="resource-content">
          <div className="resource-header">
            <h3 className="resource-title">{resource.title}</h3>
            <span className="resource-type-badge">{resource.type}</span>
          </div>

          <p className="resource-description">{resource.description}</p>

          <div className="resource-meta">
            <span>{resource.author}</span>
            <span className="resource-meta-separator">•</span>
            <span>{new Date(resource.date).toLocaleDateString()}</span>
          </div>

          <div className="resource-actions">
            <button
              onClick={() => handleLikeResource(resource.id)}
              className={`like-button ${isLiked ? 'liked' : ''}`}
            >
              <ThumbsUp className={isLiked ? 'fill-current' : ''} />
              <span>{resource.likes}</span>
            </button>

            <a
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="visit-link"
            >
              <span>Visit</span>
              <ExternalLink />
            </a>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="devhub-container">
      <div className="main-wrapper">
        <div className="header-container">
          <h1 className="site-title">DevHub</h1>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="theme-toggle-btn"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>

        <div className="controls-container">
          <div className="search-container">
            <Search className="search-icon" />
            <input
              type="text"
              placeholder="Search resources..."
              onChange={handleSearch}
              className="search-input"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="share-resource-btn"
          >
            <Plus />
            <span>Share Resource</span>
          </button>
        </div>

        <div className="category-filters">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
              }}
              className={`category-btn ${
                selectedCategory === category ? 'active' : ''
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
          </div>
        ) : (
          <>
            <div className="resources-grid">
              {paginatedResources.map((resource) => (
                <ResourceCard key={resource.id} resource={resource} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination-container">
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`pagination-btn`}
                >
                  <ChevronLeft />
                </button>

                <span className="pagination-text">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                  }
                  disabled={currentPage === totalPages}
                  className="pagination-btn"
                >
                  <ChevronRight />
                </button>
              </div>
            )}
          </>
        )}

        {!isLoading && filteredResources.length === 0 && (
          <div className="empty-state">
            <p>No resources found matching your criteria.</p>
          </div>
        )}

        {isModalOpen && (
          <CreateResourceModal
            onClose={() => setIsModalOpen(false)}
            onSave={handleCreateResource}
          />
        )}
      </div>
    </div>
  );
};

export default Home;
