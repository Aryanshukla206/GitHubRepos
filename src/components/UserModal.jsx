import React from 'react';
import { X, Star, GitFork } from 'lucide-react';

export const UserModal = ({ user, repos, onClose }) => {
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
          <h3 className="text-lg font-semibold text-white mb-4">
            Repositories
          </h3>
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
                    <span className="text-white/40 text-sm">
                      {repo.language}
                    </span>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
