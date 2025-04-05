import React, { useState, useEffect } from 'react';
import { Search, Moon, Sun, Star, GitFork, X } from 'lucide-react';
import { UserCard } from './components/UserCard';
import { UserModal } from './components/UserModal';
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
    <div className={theme === 'dark' ? 'dark' : 'light'}>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-4xl font-bold">Saved Github Profiles</h1>
            {/* <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              {theme === 'dark' ? <Sun size={24} /> : <Moon size={24} />}
            </button> */}
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
                onClose={() => setSavedUsers(prev => prev.filter(u => u.login !== user.login))}
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