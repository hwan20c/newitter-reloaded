import styled from "styled-components";
import { ITweet } from "./timeline";
import { auth, db, storage } from "../firebase";
import { deleteDoc, doc } from "firebase/firestore";
import { deleteObject, ref } from "firebase/storage";
import { useState } from "react";
import EditTweetForm from "./edit-tweet-form";

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div`
  display: flex;
  flex-direction: column;

  &:last-child {
    place-self: end;
  }

  button {
    &:not(:first-of-type) {
      margin-left: 10px; // 필요에 따라 마진 값을 조절하세요
    }
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const ButtonDiv = styled.div`
  margin-top: auto;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const EditButton = styled.button`
  background-color: white;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default function Tweet({ username, photo, tweet, userId, id }: ITweet) {
  const user = auth.currentUser;

  const [isEditing, setEditing] = useState(false);

  const onEditButtonClick = () => {
    setEditing(true);
  };

  const onCancelButtonClick = () => {
    setEditing(false);
  };

  const onDelete = async () => {
    const ok = confirm("Ara you sure you want to delete this tweet?");

    if (!ok || user?.uid !== userId) return;

    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  return (
    <Wrapper>
      {!isEditing && (
        <Column>
          <Username>{username}</Username>
          <Payload>{tweet}</Payload>
          <ButtonDiv>
            {user?.uid === userId ? (
              <DeleteButton onClick={onDelete}>Delete</DeleteButton>
            ) : null}
            {user?.uid === userId ? (
              <EditButton onClick={onEditButtonClick}>Edit</EditButton>
            ) : null}
          </ButtonDiv>
        </Column>
      )}

      {!isEditing && <Column>{photo ? <Photo src={photo} /> : null}</Column>}

      {isEditing && (
        <EditTweetForm
          onCancel={onCancelButtonClick}
          tweetInfo={{ id, photo, tweet }}
        />
      )}
    </Wrapper>
  );
}
