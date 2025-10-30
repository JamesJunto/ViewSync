import { useRef } from "react";

const useLinkProvider = () => {
  const generatedLink = useRef(crypto.randomUUID());
  const shareLink = `http://localhost:5173/share/${generatedLink.current}`;

  return { shareLink, generatedLink };
};
export default useLinkProvider;