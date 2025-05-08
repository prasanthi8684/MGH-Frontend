import React, { useState } from "react";

const ProductDescription = ({ }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="text-sm text-gray-500">
      <p className={expanded ? "leading-relaxed" : "line-clamp-3 leading-relaxed"}>
        testtyfhdvhfvdhvdhfdb
      </p>
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-1 text-blue-600 hover:underline text-xs font-medium"
      >
        {expanded ? "Read less" : "Read more"}
      </button>
    </div>
  );
};

export default ProductDescription;
