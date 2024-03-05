import styled from "styled-components";
import PostTweetForm from "../compnents/post-tweet-form";

const Wraaper = styled.div``;

export default function Home() {
  return (
    <Wraaper>
      <PostTweetForm />
    </Wraaper>
  );
}
