import { useEffect, useState } from "react";

export function useImage(src: string): HTMLImageElement | undefined {
  const [image, setImage] = useState<HTMLImageElement>();

  useEffect(() => {
    const img = new window.Image();
    img.src = src;
    img.onload = () => setImage(img);
  }, [src]);

  return image;
}
