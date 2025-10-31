import { useState, useRef } from "react";
import styled from "styled-components";

const FooterContainer = styled.footer<{ visible: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 50px;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: transform 0.3s ease;
  transform: ${({ visible }) => (visible ? "translateY(0)" : "translateY(100%)")};
  z-index: 1000;
  font-size: 14px;
  color: #555;

  &:before {
    content: '';
    position: absolute;
    top: -10px; /* above footer */
    left: 0;
    width: 100%;
    height: 10px;
    background: linear-gradient(to bottom, rgba(0, 0, 0, 0.03), transparent);
  }
`;

const HoverZone = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 40px; /* easier to hover */
  z-index: 999;
`;

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
        visible={visible}
        onMouseEnter={showFooter}
        onMouseLeave={hideFooter}
      >
        Footer content here
      </FooterContainer>
    </>
  );
}

export default Footer;


