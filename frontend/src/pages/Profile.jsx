import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import cat from "../assets/cat.jpg";
import Footer from "../components/Footer";

const UserProfile = ({ user }) => {
  console.log(user.profile);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const token = localStorage.getItem("token");
    const trimmedInput = input.trim();
    const userMsg = { sender: "user", text: trimmedInput };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}/auth/protect/chat`,
        {
          message: trimmedInput,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const botMsg = { sender: "bot", text: data.response };
      setMessages((prev) => [...prev, botMsg]);
    } catch (error) {
      const errMsg = {
        sender: "bot",
        text: error.response?.data?.error || "Error: Unable to get response.",
      };
      setMessages((prev) => [...prev, errMsg]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <div className="min-h-screen p-4 overflow-x-hidden ">
        <p className="text-6xl font-heading mb-6 text-[#764b3a]">
          Welcome home
        </p>

        <div className="flex flex-col lg:flex-row gap-6">
          <div className="w-full lg:w-2/3 p-6 rounded-lg border bg-[#3d3d3d] border-black flex flex-col">
            <div className="p-4 rounded-lg border-2 border-dashed border-white flex-1">
              <div className="flex items-start mb-6 space-x-4">
                <div className="hidden sm:block w-24 h-24 rounded-full border-2 border-dashed border-white overflow-hidden">
                  <img
                    src={user.profile}
                    alt="Profile"
                    className=" w-full h-full object-cover "
                  />
                </div>
                <div className="space-y-2">
                  <p className="text-white font-article text-2xl break-words">
                    {user.name}
                  </p>
                  <p className="text-gray-300 font-article break-words">
                    {user.email}
                  </p>
                  <p className="text-gray-400 font-article">
                    Subscription:{" "}
                    {user.subscription ? "Active" : "Not Subscribed"}
                  </p>
                </div>
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    window.location.reload();
                  }}
                  className="text-xs font-article left text-white bg-red-800 rounded-2xl p-2"
                >
                  Logout
                </button>
              </div>

              <div>
                <h5 className="text-white text-3xl font-vault mb-2">
                  Breaches:
                </h5>
                {!user.breaches || user.breaches.length === 0 ? (
                  <p className="text-gray-300">No breaches found.</p>
                ) : (
                  <ul className="space-y-2">
                    {user.breaches.map((breach) => (
                      <li
                        key={breach.id}
                        className="p-2 rounded border border-gray-400"
                      >
                        <p className="text-white font-medium font-article break-words">
                          {breach.site}
                        </p>
                        <p className="text-gray-400 text-s break-words">
                          Domain: {breach.domain} | Industry: {breach.industry}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>

          <div className="w-full lg:w-1/3 flex flex-col">
            <div className="p-6 rounded-lg border border-black flex flex-col h-full ">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border-2 border-[#764b3a]">
                  <img
                    src={cat}
                    alt="AI Assistant"
                    className="w-full h-full object-cover"
                  />
                </div>
                <h2 className="text-2xl font-bold font-pixel  text-[#764b3a]">
                  AI Assistant
                </h2>
              </div>

              <div className="flex flex-col border rounded-lg flex-1 overflow-hidden bg0">
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  style={{ maxHeight: "400px" }}
                >
                  {messages.map((msg, idx) => (
                    <div
                      key={idx}
                      className={`flex items-start gap-2 ${
                        msg.sender === "bot" ? "justify-start" : "justify-end"
                      }`}
                    >
                      {msg.sender === "bot" && (
                        <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-1">
                          <img
                            src={cat}
                            alt="AI"
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div
                        className={`p-3 rounded-lg max-w-[80%] break-words ${
                          msg.sender === "bot"
                            ? "bg-[#764b3a] text-white font-pixel"
                            : "bg-[#3d3d3d] text-white font-pixel"
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))}
                  {loading && (
                    <div className="flex items-start gap-2 justify-start">
                      <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mt-1">
                        <img
                          src={cat}
                          alt="AI"
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3 rounded-lg max-w-[80%] break-words bg-[#764b3a] text-white font-pixel">
                        Thinking...
                      </div>
                    </div>
                  )}
                  <div ref={chatEndRef} />
                </div>

                <div className="border-t p-3 bg-white">
                  <div className="flex">
                    <input
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask about breaches, passwords, or account safety..."
                      className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#764b3a] font-pixel"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSend();
                      }}
                    />
                    <button
                      onClick={handleSend}
                      disabled={loading}
                      className="bg-[#764b3a] hover:bg-[#5a372a] disabled:bg-[#9f887d] text-white px-4 py-2 rounded-r-lg transition-colors font-pixel"
                    >
                      {loading ? "..." : "Send"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default UserProfile;
