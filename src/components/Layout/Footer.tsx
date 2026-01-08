import { useState, useRef } from "react";

function Footer() {
  const [visible, setVisible] = useState(false);
  const hideTimeout = useRef<number | null>(null);

  const showFooter = () => {
    if (hideTimeout.current) clearTimeout(hideTimeout.current);
    setVisible(true);
  };

  const hideFooter = () => {
    hideTimeout.current = window.setTimeout(() => {
      setVisible(false);
    }, 400);
  };

  return (
    <>
      <div onMouseEnter={showFooter} />
      <footer
        className={`p-4 border-t-4 border-primary justify-center ${visible ? 'flex' : 'hidden'}`}
        onMouseEnter={showFooter}
        onMouseLeave={hideFooter}
      >
        Footer content here
      </footer>
    </>
  );
}

export default Footer;


