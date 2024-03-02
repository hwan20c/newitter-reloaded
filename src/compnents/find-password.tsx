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
  input[type="submit"] {
    cursor: pointer;

    &:hover {
      opacity: 0.8;
      // 추가로 hover 시에 적용하고 싶은 스타일을 여기에 추가합니다.
    }
  }
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
  const [error, setError] = useState<string | null>(null);

  const handleSendEmail = async () => {
    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // 여기서 이메일 보내기 로직 추가
    await sendPasswordResetEmail(auth, email)
      .then(() => {
        setError(null);
        alert(
          "Password reset email sent successfully \nIf the e-mail has not been sent, it may not be the registered e-mail address."
        );
        setIsFPInputVisible(false); // 성공했을 때만 숨김
      })
      .catch((error) => {
        setError(error.message);
        setIsFPInputVisible(true); // 실패했을 때는 숨기지 않음
      });
  };

  return (
    <FadeWrapper $visible={isFPInputVisible}>
      {isFPInputVisible && (
        <div>
          <Input
            type="text"
            placeholder="Your Email"
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginTop: "10px" }}
          />
          <Input
            type="submit"
            value={isLoading ? "Loading..." : "Send Email"}
            onClick={() => {
              handleSendEmail();
            }}
            style={{ marginTop: "10px" }}
          />
          {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
      )}
    </FadeWrapper>
  );
}
