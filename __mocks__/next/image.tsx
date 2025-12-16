import React from "react";

const Image = ({
  alt,
  ...props
}: React.ImgHTMLAttributes<HTMLImageElement>) => <img alt={alt} {...props} />;

export default Image;
