import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Star, GitFork, X } from 'lucide-react';

function UserCard({ avatar, username, name, bio, onClick }) {
  return (
    <div
      onClick={onClick}
      className="group cursor-pointer p-6 rounded-xl bg-white/10 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 hover:shadow-lg hover:shadow-white/5"
    >
      <div className="flex items-start gap-4">
        <img
          src={avatar}
          alt={username}
          className="w-16 h-16 rounded-full object-cover"
        />
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-white group-hover:text-blue-400 transition-colors">
            {username}
          </h3>
          <p className="text-sm text-white/60">{name}</p>
          <p className="mt-2 text-sm text-white/80 line-clamp-2">{bio}</p>
        </div>
      </div>
    </div>
  );
}

function UserModal({ user, repos, onClose }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-xl w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-start gap-4">
            <img
              src={user.avatar_url}
              alt={user.login}
              className="w-20 h-20 rounded-full"
            />
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white">{user.login}</h2>
              <p className="text-white/60">{user.name}</p>
              <p className="mt-2 text-white/80">{user.bio}</p>
            </div>
            <button
              onClick={onClose}
              className="text-white/60 hover:text-white transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(80vh-200px)]">
          <h3 className="text-lg font-semibold text-white mb-4">Repositories</h3>
          <div className="space-y-4">
            {repos.map((repo) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="block p-4 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <h4 className="text-blue-400 font-medium">{repo.name}</h4>
                <p className="text-sm text-white/60 mt-1">{repo.description}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="flex items-center gap-1 text-white/40 text-sm">
                    <Star size={16} />
                    {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1 text-white/40 text-sm">
                    <GitFork size={16} />
                    {repo.forks_count}
                  </span>
                  {repo.language && (
                    <span className="text-white/40 text-sm">{repo.language}</span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [savedUsers, setSavedUsers] = useState(() => {
    const saved = localStorage.getItem('savedUsers');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'dark';
  });
  
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userRepos, setUserRepos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem('savedUsers', JSON.stringify(savedUsers));
  }, [savedUsers]);

  useEffect(() => {
    localStorage.setItem('theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const handleSearch = async () => {
    if (!search.trim()) return;
    
    setLoading(true);
    try {
      const response = await fetch(`https://api.github.com/users/${search}`);
      const userData = await response.json();
      
      if (response.ok) {
        setSavedUsers(prev => {
          const filtered = prev.filter(u => u.login !== userData.login);
          return [...filtered, { ...userData, savedAt: Date.now() }];
        });
        setSearch('');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
    }
    setLoading(false);
  };

  const handleUserClick = async (user) => {
    setSelectedUser(user);
    try {
      const response = await fetch(`https://api.github.com/users/${user.login}/repos`);
      const repos = await response.json();
      setUserRepos(repos);
    } catch (error) {
      console.error('Error fetching repos:', error);
    }
  };

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Saved Repositories</h1>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button>
          </div>

          <div className="relative mb-8">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search GitHub username..."
              className="w-full px-12 py-4 bg-white/10 rounded-xl backdrop-blur-lg border border-white/10 focus:border-white/20 outline-none transition-all"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedUsers.map((user) => (
              <UserCard
                key={user.login}
                avatar={user.avatar_url}
                username={user.login}
                name={user.name}
                bio={user.bio}
                onClick={() => handleUserClick(user)}
              />
            ))}
          </div>

          {selectedUser && (
            <UserModal
              user={selectedUser}
              repos={userRepos}
              onClose={() => setSelectedUser(null)}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;