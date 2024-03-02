import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import styled, { keyframes } from "styled-components";
import { Input } from "./auth-components";
import { auth } from "../firebase";

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const fadeOut = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

interface FadeWrapperProps {
  $visible: boolean;
}

const FadeWrapper = styled.div<FadeWrapperProps>`
  animation: ${({ $visible }) => ($visible ? fadeIn : fadeOut)} 1s ease-in-out;
`;

interface FindPasswordProps {
  isLoading: boolean;
  isFPInputVisible: boolean;
  setIsFPInputVisible: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function FindPassword({
  isLoading,
  isFPInputVisible,
  setIsFPInputVisible,
}: FindPasswordProps) {
  const [email, setEmail] = useState("");

  const handleEmailBlur = () => {
    setIsFPInputVisible(false);
  };

  const handleSendEmail = () => {
    sendPasswordResetEmail(auth, email);
  };

  return (
    <FadeWrapper $visible={isFPInputVisible}>
      {isFPInputVisible && (
        <div>
          <Input
            type="text"
            placeholder="Your Email"
            onBlur={handleEmailBlur}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginTop: "10px" }}
          />
          <Input
            type="submit"
            value={isLoading ? "Loading..." : "Send Email"}
            onClick={handleSendEmail}
            style={{ marginTop: "10px" }}
          />
        </div>
      )}
    </FadeWrapper>
  );
}
