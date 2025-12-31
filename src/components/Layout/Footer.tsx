import { useState, useRef } from "react";
import { FooterContainer, HoverZone } from "../../styles/components/layout.styles";

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
      <HoverZone onMouseEnter={showFooter} />
      <FooterContainer
        $isVisible={visible}
        onMouseEnter={showFooter}
        onMouseLeave={hideFooter}
      >
        Footer content here
      </FooterContainer>
    </>
  );
}

export default Footer;


