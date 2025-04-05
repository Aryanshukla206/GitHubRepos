import React from 'react';
import { X } from 'lucide-react';

export const UserCard = ({ avatar, username, name, bio, onClick, onClose }) => {
  const handleCloseClick = (e) => {
    e.stopPropagation();
    onClose();
  };
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
        <button
          onClick={handleCloseClick}
          className="text-white/60 hover:text-white transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
};
