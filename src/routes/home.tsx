import styled from "styled-components";
import PostTweetForm from "../compnents/post-tweet-form";
import Timeline from "../compnents/timeline";

const Wraaper = styled.div`
  display: grid;
  gap: 50px;
  overflow-y: scroll;
  grid-template-rows: 1fr 5fr;
`;

export default function Home() {
  return (
    <Wraaper>
      <PostTweetForm />
      <Timeline />
    </Wraaper>
  );
}
