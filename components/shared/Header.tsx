import React from "react";

const Header = ({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) => {
  return (
    <div className="text-center mb-8">
      {/* Title */}
      <h1 className="text-4xl font-extrabold text-white tracking-tigh">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 via-red-500 to-red-700">
          {title}
        </span>
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="mt-3 text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default Header;
