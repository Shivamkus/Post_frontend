import { useState, useEffect } from "react";
import {
  getPosts,
  createPost,
  deletePost,
  updatePost,
} from "./services/postService";
import { ToastContainer, toast } from "react-toastify"; // Import ToastContainer and toast
import "react-toastify/dist/ReactToastify.css"; // Import react-toastify CSS

function App() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false); // Loader state

  const show = () => {
    document.getElementById("textarea").style.display = "block";
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Fetch posts
  const fetchPosts = async () => {
    setLoading(true); // Start loading
    try {
      const data = await getPosts();
      if (Array.isArray(data)) {
        setPosts(data);
      } else {
        setError("Failed to load posts.");
      }
    } catch (error) {
      setError("Error fetching posts. Please try again.");
      toast.error("Error fetching posts.");
      console.log("error on load post", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  // Handle post create or update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !content) {
      setError("Please fill in all fields.");
      toast.error("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      if (isEditing) {
        await updatePost(editPostId, { title, content });
        toast.success("Post updated successfully!");
        setIsEditing(false);
        setEditPostId(null);
      } else {
        await createPost({ title, content });
        toast.success("Post created successfully!");
      }
      setTitle("");
      setContent("");
      fetchPosts();
    } catch (error) {
      setError("Failed to save post. Try again.");
      toast.error("Failed to save post.");
      console.log("error on creating post", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle edit button
  const handleEdit = (post) => {
    setTitle(post.title);
    setContent(post.content);
    setEditPostId(post._id);
    setIsEditing(true);
  };

  // Handle delete
  const handleDelete = async (id) => {
    setLoading(true);
    try {
      await deletePost(id);
      toast.success("Post deleted successfully!");
      fetchPosts();
    } catch (error) {
      setError("Failed to delete post. Try again.");
      toast.error("Failed to delete post.");
      console.log("error on delete post", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-slate-50 p-5">
      <ToastContainer /> {/* Notification Container */}
      <h1 className="text-3xl text-slate-900 font-semibold mb-5">
        {" "}
        Post Management
      </h1>
      {/* Error Handling */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Loader */}
      {loading && (
        <div className="absolute inset-0 flex justify-center items-center bg-black  z-50">
          <div className="text-white text-lg">Loading...</div>
        </div>
      )}
      {/* Form for Create/Update */}
      <div className="w-full max-w-xl bg-slate-100 p-5 rounded-lg mb-5 shadow-xl shadow-black ">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <input
            className="p-3 outline outline-1 rounded-lg w-full"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter Post Title"
            onClick={show}
            required
          />
          <textarea
            id="textarea"
            className="px-4 py-2 rounded-md border border-black outline-none focus:ring-2 focus:ring-blue-400 hidden"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Enter Post Content"
            required
          />
          <button
            className="px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg outline outline-1 outline-white"
            type="submit"
          >
            {isEditing ? "Update Post" : "Create Post"}
          </button>
        </form>
      </div>
      {/* Display Posts */}
      <div className="w-full max-w-5xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 h-auto  ">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div
              key={post._id}
              className="bg-white shadow-lg shadow-black rounded-lg p-6 flex flex-col space-y-4 justify-between"
            >
              <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
              <p className="text-slate-500 font-semibold mb-4 scrollbar-thin scrollable-content overflow-y-auto max-h-24">
                {post.content}
              </p>
              <p className="text-sm flex justify-end items-end">
                Date: {new Date(post.createdAt).toLocaleDateString("en-GB")}{" "}
                <br />
                Time:{" "}
                {new Date(post.createdAt).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })}
              </p>{" "}
              <div className="flex justify-between">
                <button
                  className="px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded-lg"
                  onClick={() => handleEdit(post)}
                >
                  Edit
                </button>
                <button
                  className="px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-lg"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-white text-lg">No posts found.</p>
        )}
      </div>
    </div>
  );
}

export default App;
