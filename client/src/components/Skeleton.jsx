import React from "react";

const Skeleton = ({ className = "", style = {}, width = "100%", height = 20, rounded = "md" }) => (
  <div
    className={`animate-pulse bg-gray-200 ${rounded} ${className}`}
    style={{ width, height, ...style }}
  />
);

export const SkeletonText = ({ lines = 3, width = "100%", className = "" }) => (
  <div className={className}>
    {Array.from({ length: lines }).map((_, i) => (
      <Skeleton key={i} width={typeof width === "string" ? width : width[i] || width[0]} height={16} className="mb-2" />
    ))}
  </div>
);

export default Skeleton;
